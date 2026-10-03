export type Light = "red" | "yellow" | "green";

export const EMPTY_LIGHT: Light = "red";

export function lightLine(light: Light): string {
  if (light === "yellow") return "Wait.";
  if (light === "green") return "Go.";
  return "Stop.";
}

export function statusLine(light: Light): string {
  if (light === "yellow") return "Yellow light.";
  if (light === "green") return "Green light.";
  return "Red light.";
}

export function hasProgress(light: Light): boolean {
  return light !== "red";
}

export function parseLight(raw: string | null): Light {
  if (!raw) return EMPTY_LIGHT;
  try {
    const value = JSON.parse(raw) as { light?: unknown };
    if (value.light === "red" || value.light === "yellow" || value.light === "green") {
      return value.light;
    }
    return EMPTY_LIGHT;
  } catch {
    return EMPTY_LIGHT;
  }
}

export function setLight(current: Light, next: Light): { light: Light; note: string } {
  if (current === next) {
    if (next === "yellow") return { light: current, note: "Already yellow." };
    if (next === "green") return { light: current, note: "Already green." };
    return { light: current, note: "Already red." };
  }
  const legal =
    (current === "red" && next === "yellow") ||
    (current === "yellow" && next === "green") ||
    (current === "green" && next === "red");
  if (!legal) return { light: current, note: "Not yet." };
  if (next === "yellow") return { light: next, note: "Turned yellow." };
  if (next === "green") return { light: next, note: "Turned green." };
  return { light: next, note: "Turned red." };
}

export function makeRed(light: Light): { light: Light; note: string } {
  return setLight(light, "red");
}

export function makeYellow(light: Light): { light: Light; note: string } {
  return setLight(light, "yellow");
}

export function makeGreen(light: Light): { light: Light; note: string } {
  return setLight(light, "green");
}

export function resetLight(): { light: Light; note: string } {
  return { light: EMPTY_LIGHT, note: "Look at the light." };
}
