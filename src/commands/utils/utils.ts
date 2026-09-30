export const dedent = (strings: TemplateStringsArray | string, ...values: unknown[]): string => {
  const raw = typeof strings === "string"
    ? strings
    : strings.reduce((r, p, i) => r + p + (i < values.length ? String(values[i]) : ""), "");

  const lines = raw
    .replace(/^\n/, "")
    .replace(/\n[ \t]*$/, "")
    .split("\n");

  const indent = Math.min(
    ...lines
      .filter(line => line.trim() !== "")
      .map(line => line.match(/^[ \t]*/)![0].length)
  );

  return lines.map(line => line.slice(indent)).join("\n");
};
