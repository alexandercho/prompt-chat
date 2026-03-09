import {
    Text,
    Pressable,
    StyleSheet
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SignOutButton() {
    const { logout } = useAuth();
    return (
        <Pressable
            onPress={logout}
            style={({ pressed }) => [
                styles.signOutButton,
                pressed && styles.buttonPressed
            ]}>
            <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9
    },
    signOutButton: {
        backgroundColor: '#F87171',
        paddingVertical: 14,
        borderRadius: 16,
        alignItems: 'center'
    },
    signOutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600'
    }
});
