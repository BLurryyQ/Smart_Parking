import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useContext } from "react";
import ThemeContext from "../../theme/ThemeContext";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";

const Input = ({
                 label,
                 placeholder,
                 keyboardType,
                 borderRadius,
                 borderColor,
                 Icon,
                 textTransform,
                 value,
                 onChangeText
               }) => {
  const { theme, darkMode } = useContext(ThemeContext);
  const placeholderColor = darkMode ? "#f6f6f6" : "#505050";

  return (
      <View style={styles.inputBox}>
        <Text style={[styles.label, { color: theme.color, textTransform: textTransform || 'capitalize' }]}>{label}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
              style={[styles.input, {
                color: theme.color,
                borderRadius: borderRadius || 10,
                borderColor: borderColor || "rgba(255, 255, 255, 0.08)",
                backgroundColor: theme.card2,
              }]}
              placeholderTextColor={placeholderColor}
              placeholder={placeholder}
              keyboardType={keyboardType}
              value={value}
              onChangeText={onChangeText}
          />
          {Icon && <Icon style={styles.icon} />}
        </View>
      </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputBox: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "Montserrat_700Bold",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    borderRadius: 10,
    borderColor: "#F6F6F6",
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: "#F6F6F6",
  },
  icon: {
    position: "absolute",
    bottom: 15,
    left: 10,
  },
});