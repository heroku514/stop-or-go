import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseLight, type Light } from "./light";

const KEY = "stop-or-go-v1";

export async function loadLight(): Promise<Light> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseLight(raw);
}

export async function saveLight(light: Light): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify({ light }));
}
