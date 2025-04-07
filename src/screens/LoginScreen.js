import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Alert, 
  ScrollView, 
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("1@gmail.com");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { currentTheme } = useTheme();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, slideAnim, step]);

  const sendVerificationCode = () => {
    setStep(2);
    Alert.alert("Verification Code Sent", "Please check your email for the code.");
  };

  const verifyCode = () => {
    if (code !== "1234") {
      Alert.alert("Invalid Code", "Please enter the correct code.");
      return;
    }
    setStep(3);
  };

  const setNewPassword = () => {
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long.");
      return;
    }
    Alert.alert("Success", "Your account is now verified!");
    navigation.replace("Main");
  };

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <View style={[styles.stepIndicator, step >= 1 && styles.activeStepIndicator]} />
        <View style={styles.stepConnector} />
        <View style={[styles.stepIndicator, step >= 2 && styles.activeStepIndicator]} />
        <View style={styles.stepConnector} />
        <View style={[styles.stepIndicator, step >= 3 && styles.activeStepIndicator]} />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[currentTheme.gradient1 || '#6a11cb', currentTheme.gradient2 || '#2575fc']}
        style={styles.gradientBackground}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View 
            style={[
              styles.overlay, 
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          > 
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/unihive-logo.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeText}>Welcome to UniHive</Text>
            <Text style={styles.subtitleText}>Connect, Create, Compete</Text>

            {renderStepIndicator()}

            <View style={styles.container}>
              {step === 1 && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={email}
                    editable={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholderTextColor={currentTheme.placeholder || "#999"}
                  />
                </View>
              )}

              {step === 2 && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Verification Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 4-digit code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                    placeholderTextColor={currentTheme.placeholder || "#999"}
                    maxLength={4}
                  />
                  <TouchableOpacity onPress={sendVerificationCode} style={styles.resendContainer}>
                    <Text style={styles.resendText}>Resend Code</Text>
                  </TouchableOpacity>
                </View>
              )}

              {step === 3 && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>New Password</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Set a secure password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={currentTheme.placeholder || "#999"}
                  />
                  <Text style={styles.passwordHint}>Password must be at least 6 characters</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={step === 1 ? sendVerificationCode : step === 2 ? verifyCode : setNewPassword}
                style={styles.button}
              > 
                <Text style={styles.buttonText}>
                  {step === 1 ? "Send Code" : step === 2 ? "Verify Code" : "Complete Setup"}
                </Text>
              </TouchableOpacity>

              <View style={styles.helpContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.helpText}>Need help?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  overlay: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitleText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    width: '80%',
  },
  stepIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  activeStepIndicator: {
    backgroundColor: '#6200EA',
  },
  stepConnector: {
    height: 2,
    width: 40,
    backgroundColor: '#E0E0E0',
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 55,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 15,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
  },
  button: {
    height: 55,
    width: "100%",
    backgroundColor: "#6200EA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#6200EA",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resendContainer: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  resendText: {
    color: "#6200EA",
    fontSize: 14,
    fontWeight: "600",
  },
  passwordHint: {
    color: "#888",
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
  },
  helpContainer: {
    marginTop: 25,
  },
  helpText: {
    color: "#6200EA",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginScreen;