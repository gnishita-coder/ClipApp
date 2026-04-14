import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ToggleButton from "../components/ToggleButton";
import { CountryPicker } from "react-native-country-codes-picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const LoginScreen = () => {
  const [type, setType] = useState<"email" | "phone">("phone");
  const [showPicker, setShowPicker] = useState(false);
  const [countryCode, setCountryCode] = useState("+62");
  const [phone, setPhone] = useState("");

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >

          {/* Title */}
          <Text style={styles.text}>Login Screen</Text>

          {/* Top Section */}
          <View style={styles.box1}>
            <Image source={require("../images/group.png")} />
          </View>

          {/* Middle Section */}
          <View style={styles.box2}>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>
                Login to Your Account
              </Text>
            </View>

            {/* ToggleButton stays in the first view */}
            <View style={styles.toggleButtonContainer}>
              <ToggleButton onChange={(value) => setType(value)} />
            </View>

            {/* Lower input view */}
            <View style={styles.inputView}>
              {type === "phone" ? (
                <View style={styles.phoneContainer}>
                  {/* Country Code Button */}
                  <TouchableOpacity
                    style={styles.codeBox}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={styles.codeText}>{countryCode} ▼</Text>
                  </TouchableOpacity>

                  {/* Phone Input */}
                  <TextInput
                    placeholder="Enter phone number"
                    placeholderTextColor="#aaa"
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              ) : (
                <TextInput
                  placeholder="Enter email"
                  placeholderTextColor="#aaa"
                  style={styles.emailInput}
                />
              )}
            </View>

            {/* CountryPicker modal stays at top-level */}
            <CountryPicker
              show={showPicker}
              lang="en"
              pickerButtonOnPress={(item) => {
                setCountryCode(item.dial_code);
                setShowPicker(false);
              }}
              onBackdropPress={() => setShowPicker(false)}
            />

            {/* otp Button */}
            <View style={styles.otpButtonContainer}>
              <TouchableOpacity style={styles.otpButton}
                onPress={() => navigation.navigate('Otp', { phone })}
              >
                <Text style={styles.otpButtonText}>
                  Send OTP
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity>
                <Text style={styles.createAccountText}>
                  Create Account
                </Text>
              </TouchableOpacity>

              <Text style={styles.dontHaveText}>
                Don’t have account?
              </Text>
            </View>

          </View>

          {/* Bottom Section */}
          <View style={styles.box3} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

// --- Keep your existing styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D2E2F",
  },

  text: {
    fontSize: 24,
    color: "black",
    textAlign: "center",
    marginVertical: 10,
  },

  box1: {
    flex: 2,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D2E2F",
  },

  box2: {
    flex: 2,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D2E2F",
  },

  box3: {
    flex: 0.5,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D2E2F",
  },

  boxText: {
    fontSize: 18,
    color: "#000",
  },
  phoneContainer: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    marginTop: 0
  },

  codeBox: {
    width: 70,
    height: 45,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  codeText: {
    color: "#fff",
  },

  phoneInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
  },

  emailInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 2,
    paddingHorizontal: 10,
    color: "#fff",
  },
  inputContainer: {
    height: 48,
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 10,
    bottom: 10,
  },
  passwordContainer: {
    height: 48,
    width: "90%",
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 10,
    bottom: 6,
  },
  toggleButtonContainer: {
    height: 44,
    width: "90%",
    marginVertical: 10,
    bottom: 15,
  },
  titleContainer: {
    height: 35,
    width: "90%",
    marginVertical: 10,
    bottom: 20,
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  otpButtonContainer: {
    height: 48,
    width: "90%",
    marginVertical: 10,
    bottom: 6,
  },
  otpButton: {
    flex: 1,
    backgroundColor: "#FE8723",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  otpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inputView: {
    height: 48,
    width: "90%",
    marginVertical: 10,
    bottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  createAccountText: {
    color: "#FE8723",
    fontSize: 12,
    fontWeight: "semibold",
  },
  dontHaveText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "normal",
  },
});