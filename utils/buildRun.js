import shuffle from "./shuffle";

export function buildRun(questions) {
  return shuffle(questions).map((q) => ({
    ...q,
    options: shuffle(q.options),
  }));
}
 