import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert at creating multiple-choice questions (QCM) from educational documents.

Given a document, generate a JSON object with the following structure:
{
  "topic": "concise topic name derived from the document",
  "questions": [
    {
      "id": 1,
      "question": "Clear, specific question",
      "options": ["A. option", "B. option", "C. option", "D. option"],
      "answer": "A",
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Rules:
- Generate between 10 and 30 questions depending on document length and richness
- Always use the document's language for ALL output including topic
- Each question must test a distinct concept
- Options must always be prefixed: "A. ...", "B. ...", "C. ...", "D. ..."
- "answer" must be just the letter: "A", "B", "C", or "D"
- Distribute questions across the ENTIRE document, not just the beginning
- Distractors (wrong options) must be plausible, not obviously wrong
- Avoid yes/no questions, trick questions, and "all of the above" options
- Prefer questions that test understanding over pure memorization
- Return ONLY the raw JSON object, no markdown, no backticks, no commentary`;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
    }


    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      SYSTEM_PROMPT,
    ]);

    const text = result.response.text().trim();

    // strip accidental markdown fences
    const clean = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
      
    if (!parsed.topic || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
  return NextResponse.json({ error: "Gemini returned incomplete data. Try again." }, { status: 500 });
}
    } catch {
      return NextResponse.json({ error: "Gemini returned invalid JSON. Try again." }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[generate-deck]", err);
      if (err.status === 429) {
    return NextResponse.json(
      { error: "The AI service is temporarily rate-limited. Please try again in a few seconds." },
      { status: 429 }
    );
  }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}