import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  onChange: (value: "email" | "phone") => void;
};

const ToggleButton: React.FC<Props> = ({ onChange }) => {
  const [selected, setSelected] = useState<"email" | "phone">("phone");

  const handlePress = (value: "email" | "phone") => {
    setSelected(value);
    onChange(value); // 👈 send to parent
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={[styles.button, selected === "email" && styles.activeButton]}
        onPress={() => handlePress("email")}
      >
        <Text style={[styles.text, selected === "email" && styles.activeText]}>
          Email
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selected === "phone" && styles.activeButton]}
        onPress={() => handlePress("phone")}
      >
        <Text style={[styles.text, selected === "phone" && styles.activeText]}>
          Phone Number
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#464748",
    borderRadius: 10,
    padding: 4,
    width: "100%",
    height:44,
    alignSelf: "center",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#fff",
  },
  text: {
    color: "#ccc",
    fontSize: 14,
    fontWeight:"semibold"
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
});