import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  EMPTY_LIGHT,
  hasProgress,
  lightLine,
  makeGreen,
  makeRed,
  makeYellow,
  resetLight,
  statusLine,
  type Light,
} from "./src/light";
import { loadLight, saveLight } from "./src/store";

export default function App() {
  const [light, setLight] = useState<Light>(EMPTY_LIGHT);
  const [note, setNote] = useState("Look at the light.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadLight()
      .then((loaded) => {
        if (!alive) return;
        setLight(loaded);
        setNote(hasProgress(loaded) ? "Saved light loaded." : "Look at the light.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the light.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveLight(light).catch(() => setNote("Could not save the light."));
  }, [ready, light]);

  if (!ready && note === "Look at the light.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the light</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { light: Light; note: string }) {
    setLight(result.light);
    setConfirmNew(false);
    setNote(result.note);
  }

  const lineColor = light === "yellow" ? "#A16207" : light === "green" ? "#166534" : "#B91C1C";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Stop or Go</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{statusLine(light)}</Text>
        <Text style={[styles.line, { color: lineColor }]}>{lightLine(light)}</Text>
        <BigButton label="Make it red" onPress={() => apply(makeRed(light))} />
        <BigButton label="Make it yellow" onPress={() => apply(makeYellow(light))} />
        <BigButton label="Make it green" onPress={() => apply(makeGreen(light))} />
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New light" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetLight();
    setLight(result.light);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New light canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F1EA" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#1A2332" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#1A2332" },
  note: { fontSize: 18, color: "#4B5563", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#1A2332" },
  line: { fontSize: 40, fontWeight: "800", lineHeight: 46 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1A2332",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#1A2332" },
  buttonText: { fontSize: 20, fontWeight: "800", color: "#1A2332", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
