export type DocCategories = "none" | "others" | "style" | "common" | "community" | "brochure";

export type ProjectForm = {
  name: string,
  version: string,
  desc: string,
  manager: number,
  resource: string[],
  documents: {
    path: string,
    category: DocCategories,
    rule: boolean
  }[],
  src_lang: string,
  supported_lang: string[]
};