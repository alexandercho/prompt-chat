import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useRouter } from "expo-router";

export default function PromptScreen() {
    const [prompt, setPrompt] = useState("");
    const router = useRouter();

    const handleGoToChat = () => {
        if (Platform.OS !== "web") {
            impactAsync(ImpactFeedbackStyle.Light);
        }

        router.push({
            pathname: "/chatbot",
            params: { prompt }
        });
    };

    return (
        <LinearGradient
            colors={["#020617", "#0F172A"]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.card}>
                        <Text style={styles.title}>Prompt Chat</Text>
                        <Text style={styles.subtitle}>
                            Provide a prompt that will be used for your conversation.
                        </Text>

                        <TextInput
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="Ex. Talk to me like a pirate"
                            placeholderTextColor="#94A3B8"
                            multiline
                            style={styles.input}
                        />

                        <Pressable
                            onPress={handleGoToChat}
                            style={({ pressed }) => [
                                styles.button,
                                pressed && styles.buttonPressed
                            ]}
                        >
                            <Text style={styles.buttonText}>Start chat</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "100%",
        maxWidth: 560,
        backgroundColor: "#020617",
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: "#1E293B",
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
    },
    eyebrow: {
        color: "#818CF8",
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 6,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#F8FAFC",
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: "#CBD5F5",
        marginBottom: 20,
    },
    input: {
        minHeight: 160,
        backgroundColor: "#020617",
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: "#E5E7EB",
        textAlignVertical: "top",
        borderWidth: 1,
        borderColor: "#1E293B",
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#6366F1",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
