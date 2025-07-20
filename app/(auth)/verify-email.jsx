import { View, Text, Alert, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, TextInput } from "react-native";
import React from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";

const VerifyEmail = ({ email, onBack }) => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleVerifyEmail = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
      } else {
        Alert.alert("Error", "Email verification failed. Please try again.");
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to verify email."
      );
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i3.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Verify Your Email</Text>
          <Text style={authStyles.subtitle}>
            We have sent a verification code to {email}
          </Text>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Enter Verification Code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                style={authStyles.textInput}
                keyboardType="number-pad"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              authStyles.authButton,
              loading && authStyles.buttonDisabled,
            ]}
            onPress={handleVerifyEmail}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={authStyles.buttonText}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={authStyles.linkContainer}
            onPress={() => onBack()}
          >
            <Text style={authStyles.linkText}>
              <Text style={authStyles.link}> Back To Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
