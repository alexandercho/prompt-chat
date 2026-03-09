import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
    const router = useRouter();
    return (
        <Stack
            screenOptions={{
                // Default options for all screens
                headerStyle: {
                    backgroundColor: '#020617'
                },
                headerShadowVisible: false,
                headerTitleStyle: {
                    color: '#F8FAFC',
                    fontSize: 18,
                    fontWeight: '600'
                },
                headerTintColor: '#6366F1',
                headerBackgroundContainerStyle: {
                    borderBottomWidth: 1,
                    borderBottomColor: '#1E293B'
                }
            }}
        >
            {/* Index screen: no header */}
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />

            {/* Chatbot screen: show header with Go Home button */}
            <Stack.Screen
                name="chatbot"
                options={{
                    headerTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => router.push('/')}
                            style={{ marginLeft: 16 }}
                        >
                            <Ionicons name="arrow-back-outline" size={24} color="#6366F1" />
                        </TouchableOpacity>
                    )
                }}
            />
        </Stack>
    );
}