import { Cast } from "./interfaces";

export const purgeDuplicates = (casts: Cast[]): Cast[] => {
  const obj: Record<string, Cast> = {};
  casts.forEach((t) => {
    obj[t.hash] = t;
  });

  return Object.values(obj);
};
