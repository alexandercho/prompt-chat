import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginScreen() {
    return (
        <LinearGradient colors={['#020617', '#0F172A']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Text style={styles.title}>Welcome to Prompt Chat</Text>
                        <Text style={styles.subtitle}>
                            Sign in with Google to continue and start chatting instantly.
                        </Text>
                        <GoogleSignInButton />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: '100%',
        maxWidth: 560,
        backgroundColor: '#020617',
        borderRadius: 24,
        padding: 32,
        borderWidth: 1,
        borderColor: '#1E293B',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        alignItems: 'center'
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#F8FAFC',
        marginBottom: 12,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: '#CBD5F5',
        marginBottom: 24,
        textAlign: 'center'
    }
});