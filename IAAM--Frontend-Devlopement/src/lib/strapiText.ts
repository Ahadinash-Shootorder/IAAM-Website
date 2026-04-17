export const getText = (blocks: any[]) =>
  blocks?.map(block => block.children?.map((c: any) => c.text).join("")).join("\n\n");
