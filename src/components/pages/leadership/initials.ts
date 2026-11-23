const HONORIFICS = /^(mr|mrs|ms|dr|eng|sheikh|h\.e\.|السيد|السيدة|الشيخ|د\.|المهندس|م\.)\.?\s+/i;

/** Two-letter monogram for a profile without a portrait (honorifics ignored). */
export function initials(name: string) {
  let n = name.trim();
  for (let i = 0; i < 2; i++) n = n.replace(HONORIFICS, "");
  const parts = n.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}
