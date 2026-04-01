export const PROMPT_TEMPLATE = `You are an expert educator and assessment designer. Your task is to deeply analyze the document I'm sharing and transform it into a rigorous, high-quality multiple choice quiz in JSON format.
Before generating questions, mentally ask yourself:

What are the core concepts a student must understand — not just memorize?
What are the most common points of confusion or misconception in this content?
What details are specific enough to test, but important enough to be worth testing?
Does every question I'm writing actually require understanding, not just recognition?

Then generate a JSON quiz using EXACTLY this format — no deviations:
json{
  "topic": "Name of the topic",
  "questions": [
    {
      "id": 1,
      "question": "What is...?",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "A",
      "explanation": "Because..."
    }
  ]
}
Strict rules:
Language: Detect the language of the document. Use that exact language for ALL output fields — topic, questions, options, explanations. No mixing, no translating.
Coverage: Generate as many questions as the content genuinely supports — aim for full breadth. Cover every major section of the document proportionally. Do not front-load questions on the introduction and ignore the rest. If the document has 6 sections, questions should reflect all 6.
Question quality: Every question must test genuine understanding, not surface recall. Prioritize questions that require the student to: apply a concept, distinguish between similar ideas, recall a specific and important detail, or understand why something works the way it does. Avoid yes/no questions rephrased as multiple choice. Avoid questions where the answer is obvious from the phrasing alone.
Options: Each question must have exactly 4 options labeled A, B, C, D. Wrong options (distractors) must be: plausible to someone who half-knows the material, drawn from the same conceptual category as the correct answer, and never obviously absurd. A good distractor is something a student who skimmed the content might genuinely choose. Vary which letter holds the correct answer — do not cluster correct answers on A or B.
Answer field: Must be exactly one character — A, B, C, or D. Nothing else.
Explanation: Each explanation must do two things: confirm why the correct answer is right, and briefly address why the most tempting wrong answer is wrong. Keep it concise but genuinely informative — not just a restatement of the correct option.
What to avoid: Trick questions, ambiguous wording, trivial facts that don't matter, questions that are nearly identical to each other, and any question where two options could both be argued as correct.
Quality bar: Before finalizing, verify: Does each question have exactly one clearly correct answer? Are the distractors genuinely plausible? Does the quiz as a whole cover the document evenly? Would a student who aces this quiz actually understand the material?
Output: Return ONLY the raw JSON. No intro sentence, no explanation, no markdown code fences, no trailing text. The first character of your response must be { and the last must be }.`;