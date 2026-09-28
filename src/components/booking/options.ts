export type Option = { id: string; label: string };

export const GOALS: Option[] = [
  { id: "konwersacje", label: "Chcę swobodnie rozmawiać" },
  { id: "egzamin", label: "Przygotowuję się do egzaminu" },
  { id: "biznes", label: "Potrzebuję angielskiego w pracy" },
  { id: "inne", label: "Coś innego" },
];

export const LESSON_TYPES: Option[] = [
  { id: "indywidualnie", label: "Indywidualnie, 90 zł / 60 min" },
  { id: "para", label: "Mini-grupa (2 osoby), 70 zł / os." },
  { id: "grupa", label: "Mini-grupa (3–4 osoby), 50 zł / os." },
];

export const LEVELS: Option[] = [
  { id: "zero", label: "Zaczynam od zera" },
  { id: "a1a2", label: "A1–A2" },
  { id: "b1b2", label: "B1–B2" },
  { id: "c1c2", label: "C1–C2" },
  { id: "niewiem", label: "Nie wiem" },
];

export const TIMES: Option[] = [
  { id: "rano", label: "Rano" },
  { id: "popoludnie", label: "Popołudniami" },
  { id: "wieczor", label: "Wieczorami" },
  { id: "elastycznie", label: "Elastycznie" },
];

export const labelOf = (list: Option[], id: string) =>
  list.find((o) => o.id === id)?.label ?? "";
