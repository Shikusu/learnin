export function validateDeck(raw) {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "File is not a valid JSON object." };
  }

  if (typeof raw.topic !== "string" || raw.topic.trim() === "") {
    return { valid: false, error: 'Missing or empty "topic" field.' };
  }

  if (!Array.isArray(raw.questions) || raw.questions.length === 0) {
    return { valid: false, error: '"questions" must be a non-empty array.' };
  }

  for (let i = 0; i < raw.questions.length; i++) {
    const q = raw.questions[i];
    const num = i + 1;

    if (typeof q.id === "undefined") {
      return { valid: false, error: `Question ${num}: missing "id".` };
    }
    if (typeof q.question !== "string" || q.question.trim() === "") {
      return { valid: false, error: `Question ${num}: missing or empty "question".` };
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return { valid: false, error: `Question ${num}: "options" must be an array with at least 2 items.` };
    }
    if (typeof q.answer !== "string" || q.answer.trim() === "") {
      return { valid: false, error: `Question ${num}: missing or empty "answer".` };
    }

    const answerMatches =
      q.options.includes(q.answer) ||
      q.options.some((opt) => opt.startsWith(q.answer.trim() + "."));

    if (!answerMatches) {
      return { valid: false, error: `Question ${num}: "answer" must match one of the "options".` };
    }
  }

  return { valid: true, data: raw };
}