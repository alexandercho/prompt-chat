import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleAuth } from '@/contexts/GoogleAuth';
import { AntDesign } from '@expo/vector-icons';

export default function GoogleSignInButton() {
    const { login } = useAuth();
    const { promptAsync } = useGoogleAuth(login);

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={promptAsync}
            activeOpacity={0.8}>
            <View style={styles.content}>
                <AntDesign name="google" size={24} color="#4285F4" style={styles.icon} />
                <Text style={styles.text}>Sign in with Google</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        width: '100%'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginRight: 12
    },
    text: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600'
    }
});