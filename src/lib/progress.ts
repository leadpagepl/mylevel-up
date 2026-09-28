/**
 * Pasek „Twoja droga z angielskim” pod hero.
 *
 * Celowo bez czasów i porównań z innymi szkołami — takie liczby wolno
 * pokazać dopiero wtedy, gdy szkoła ma na nie rzetelne dane.
 */

export type JourneyStep = {
  from: string;
  to: string;
  /** Krótko: co zmienia się na tym etapie. */
  label: string;
};

export const journeySteps: JourneyStep[] = [
  { from: "A1", to: "A2", label: "Pierwsze rozmowy" },
  { from: "A2", to: "B1", label: "Więcej swobody" },
  { from: "B1", to: "B2", label: "Pewność w mówieniu" },
];

export const journeyCopy = {
  eyebrow: "Twoja droga z angielskim",
  lead: "Od podstaw do swobodnej rozmowy.",
};
