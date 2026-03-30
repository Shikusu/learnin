export function resolveAnswer(options, answer) {
  if (options.includes(answer)) return answer;
  return options.find((o) => o.startsWith(answer.trim() + ".")) ?? answer;
}