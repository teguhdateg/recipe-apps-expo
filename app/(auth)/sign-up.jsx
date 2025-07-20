import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "../../assets/styles/auth.styles";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email";

const SignUpScreen = () => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);

  const handleSignUp = async () => {
    if (!email || !password)
      return Alert.alert("Error", "please fill in all fields.");
    if (password.length < 6)
      return Alert.alert("Error", "Password must be at least 6 characters.");
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (err) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to create account."
      );
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification)
    return (
      <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
    );

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        KeyboardAvoidingView={Platform.OS === "ios" ? 64 : 0}
        style={authStyles.container}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("../../assets/images/i2.png")}
              style={authStyles.image}
              contentFit="contain"
            />
          </View>

          <Text style={authStyles.title}>Create Account</Text>

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Email"
                placeholderTextColor={COLORS.textLight}
                value={email}
                onChangeText={setEmail}
                style={authStyles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Password"
                placeholderTextColor={COLORS.textLight}
                value={password}
                onChangeText={setPassword}
                style={authStyles.textInput}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                authStyles.authButton,
                loading && authStyles.buttonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={authStyles.linkContainer}
              onPress={() => router.back()}
            >
              <Text style={authStyles.linkText}>
                Already have an account?
                <Text style={authStyles.link}> Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
