import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PROMPT_TEMPLATE } from "@/constants/deckPrompt";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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
      PROMPT_TEMPLATE,
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