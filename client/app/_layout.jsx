import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function AuthGate() {
    const { user, loading } = useAuth();
    const [ready, setReady] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready || loading) return;

        router.replace(user ? '/(signed-in)' : '/(signed-out)');
    }, [ready, user, loading, router]);

    if (!ready || loading) {
        return (
            <LinearGradient colors={['#020617', '#0F172A']} style={styles.loadingContainer}>
                <View style={styles.loadingCard}>
                    <Text style={styles.loadingText}>Checking authentication...</Text>
                    <ActivityIndicator size="large" color="#6366F1" />
                </View>
            </LinearGradient>
        );
    }

    return <Slot />;
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingCard: {
        width: '80%',
        maxWidth: 400,
        backgroundColor: '#020617',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E293B',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 }
    },
    loadingText: {
        color: '#CBD5F5',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center'
    }
});