import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../lib/firebase";

WebBrowser.maybeCompleteAuthSession();

type AuthMode = "login" | "signup" | "forgot";

type AuthScreenProps = {
  mode: AuthMode;
};

const GOOGLE_WEB_CLIENT_ID =
  "345620021753-j1n2uv68bm70mt8p7o45l3rmofj1bopb.apps.googleusercontent.com";

export default function AuthScreen({ mode }: AuthScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "learn",
  });

  const [googleRequest, googleResponse, promptGoogleSignIn] =
    Google.useIdTokenAuthRequest({
      clientId: GOOGLE_WEB_CLIENT_ID,
      redirectUri,
    });

  const title = isLogin
    ? "Welcome back"
    : isSignup
      ? "Create your account"
      : "Reset password";

  const subtitle = isLogin
    ? "Sign in to continue your journey."
    : isSignup
      ? "Join our community and get started."
      : "Enter your email to receive a reset link.";

  // Google OAuth response -> Firebase Authentication
  useEffect(() => {
    let cancelled = false;

    async function handleGoogleResponse() {
      if (googleResponse?.type !== "success") {
        if (googleResponse?.type === "error") {
          setGoogleLoading(false);

          Alert.alert(
            "Google Sign-In Failed",
            googleResponse.error?.message ??
              "Google authentication could not be completed.",
          );
        }

        if (googleResponse?.type === "dismiss") {
          setGoogleLoading(false);
        }

        return;
      }

      try {
        const idToken =
          googleResponse.params?.id_token ??
          googleResponse.authentication?.idToken;

        if (!idToken) {
          throw new Error(
            "Google ID token পাওয়া যায়নি। OAuth configuration পরীক্ষা কর।",
          );
        }

        const credential = GoogleAuthProvider.credential(idToken);

        await signInWithCredential(auth, credential);

        if (!cancelled) {
          router.replace("/");
        }
      } catch (error: unknown) {
        if (!cancelled) {
          Alert.alert(
            "Google Sign-In Failed",
            getAuthErrorMessage(
              (error as { code?: string })?.code,
            ) ||
              (error instanceof Error
                ? error.message
                : "Unknown error"),
          );
        }
      } finally {
        if (!cancelled) {
          setGoogleLoading(false);
        }
      }
    }

    void handleGoogleResponse();

    return () => {
      cancelled = true;
    };
  }, [googleResponse]);

  // Email / Password / Reset
  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert("Missing email", "Please enter your email address.");
      return;
    }

    if (isSignup && !name.trim()) {
      Alert.alert("Missing name", "Please enter your name.");
      return;
    }

    if (isForgot) {
      try {
        setLoading(true);

        await sendPasswordResetEmail(auth, normalizedEmail);

        Alert.alert(
          "Check your email",
          "Follow the instructions sent to your inbox to reset your password.",
          [
            {
              text: "Back to login",
              onPress: () => router.replace("/(auth)"),
            },
          ],
        );
      } catch (error: unknown) {
        Alert.alert(
          "Unable to send email",
          getAuthErrorMessage(
            (error as { code?: string })?.code,
          ),
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!password) {
      Alert.alert("Missing password", "Please enter your password.");
      return;
    }

    if (isSignup && password.length < 6) {
      Alert.alert(
        "Weak password",
        "Your password must contain at least 6 characters.",
      );
      return;
    }

    if (isSignup && password !== confirmPassword) {
      Alert.alert("Password mismatch", "Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        const result = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );

        await updateProfile(result.user, {
          displayName: name.trim(),
        });

        Alert.alert(
          "Account created",
          "Your account has been created successfully.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/"),
            },
          ],
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );

        router.replace("/");
      }
    } catch (error: unknown) {
      Alert.alert(
        "Authentication Failed",
        getAuthErrorMessage(
          (error as { code?: string })?.code,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    if (!googleRequest) {
      Alert.alert(
        "Please wait",
        "Google Sign-In is still initializing.",
      );
      return;
    }

    try {
      setGoogleLoading(true);

      await promptGoogleSignIn();
    } catch (error: unknown) {
      setGoogleLoading(false);

      Alert.alert(
        "Google Sign-In Failed",
        error instanceof Error
          ? error.message
          : "Unable to open Google Sign-In.",
      );
    }
  };

  const isBusy = loading || googleLoading;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>C</Text>
          </View>

          <Text style={styles.brand}>Community</Text>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.form}>
            {isSignup && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full name</Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#77809A"
                  autoCapitalize="words"
                  autoComplete="name"
                  style={styles.input}
                  editable={!isBusy}
                  returnKeyType="next"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#77809A"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                style={styles.input}
                editable={!isBusy}
                returnKeyType="next"
              />
            </View>

            {!isForgot && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#77809A"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  style={styles.input}
                  editable={!isBusy}
                  returnKeyType={isSignup ? "next" : "done"}
                  onSubmitEditing={
                    isSignup ? undefined : handleSubmit
                  }
                />
              </View>
            )}

            {isSignup && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm password</Text>

                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Enter your password again"
                  placeholderTextColor="#77809A"
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="new-password"
                  style={styles.input}
                  editable={!isBusy}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>
            )}

            {isLogin && (
              <TouchableOpacity
                style={styles.forgotButton}
                onPress={() =>
                  router.push("/(auth)/forgot-password")
                }
                disabled={isBusy}
              >
                <Text style={styles.forgotText}>
                  Forgot password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                isBusy && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={isBusy}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLogin
                    ? "Sign in"
                    : isSignup
                      ? "Create account"
                      : "Send reset link"}
                </Text>
              )}
            </TouchableOpacity>

            {!isForgot && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />

                  <Text style={styles.dividerText}>OR</Text>

                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={[
                    styles.googleButton,
                    (isBusy || !googleRequest) &&
                      styles.disabledButton,
                  ]}
                  onPress={handleGoogleSignIn}
                  disabled={isBusy || !googleRequest}
                  activeOpacity={0.85}
                >
                  {googleLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.googleButtonContent}>
                      <View style={styles.googleIcon}>
                        <Text style={styles.googleG}>G</Text>
                      </View>

                      <Text style={styles.googleButtonText}>
                        Continue with Google
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>

          {!isForgot ? (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.replace(
                    isLogin ? "/(auth)/signup" : "/(auth)",
                  )
                }
                disabled={isBusy}
              >
                <Text style={styles.linkText}>
                  {isLogin ? "Sign up" : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/(auth)")}
              disabled={isBusy}
            >
              <Text style={styles.linkText}>← Back to login</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.bottomNote}>
            Secure authentication powered by Firebase
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getAuthErrorMessage(code?: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/weak-password":
      return "Please choose a stronger password.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    case "auth/account-exists-with-different-credential":
      return "An account already exists with another sign-in method.";

    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase Console.";

    case "auth/invalid-credential":
      return "Google credential is invalid or expired.";

    default:
      return "Something went wrong. Please try again.";
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B1020",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  container: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
  },

  logo: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: "#7357FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  logoText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  brand: {
    color: "#A99AFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.7,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#9CA7C2",
    marginBottom: 32,
  },

  form: {
    gap: 20,
  },

  inputGroup: {
    gap: 9,
  },

  label: {
    color: "#E6EAF5",
    fontSize: 14,
    fontWeight: "600",
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#29334D",
    borderRadius: 14,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    backgroundColor: "#131B30",
    fontSize: 15,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -8,
  },

  forgotText: {
    color: "#A99AFF",
    fontSize: 13,
    fontWeight: "600",
  },

  primaryButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: "#7357FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.55,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 2,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#29334D",
  },

  dividerText: {
    color: "#77809A",
    fontSize: 12,
    fontWeight: "600",
  },

  googleButton: {
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#29334D",
    backgroundColor: "#131B30",
    justifyContent: "center",
    alignItems: "center",
  },

  googleButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  googleIcon: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  googleG: {
    color: "#4285F4",
    fontSize: 17,
    fontWeight: "800",
  },

  googleButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 28,
  },

  footerText: {
    color: "#9CA7C2",
    fontSize: 14,
  },

  linkText: {
    color: "#A99AFF",
    fontSize: 14,
    fontWeight: "700",
  },

  backButton: {
    alignSelf: "center",
    marginTop: 28,
  },

  bottomNote: {
    textAlign: "center",
    color: "#68738F",
    fontSize: 12,
    marginTop: 40,
  },
});