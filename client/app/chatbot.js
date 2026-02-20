import { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import { GiftedChat, InputToolbar, Bubble, Send, Composer } from 'react-native-gifted-chat';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const BOT_USER = {
    _id: 2,
    name: 'Bot',
};

const HUMAN_USER = {
    _id: 1,
};

export default function ChatbotScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { prompt } = params;
    const [messages, setMessages] = useState([]);
    const [apiUp, setApiUp] = useState(null);
    const inputRef = useRef(null);

    useEffect(() => {
        checkApiHealth()
        setMessages([
            {
                _id: Date.now(),
                text: prompt !== '' ? prompt : 'Ask me anything.',
                createdAt: new Date(),
                user: prompt ? HUMAN_USER : BOT_USER,
            },
        ]);
    }, [prompt]);

    const checkApiHealth = () => {
        fetch(`${API_BASE}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then((res) => {
                if (!res.ok) {
                    setApiUp(false);
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (!data) return;
                setApiUp(data.status === 'ok');
            })
            .catch(() => {
                setApiUp(false);
            });
    };

    const onSend = useCallback(
        async (newMessages = []) => {
            setMessages((prev) => GiftedChat.append(prev, newMessages));

            const userMessage = newMessages[0];

            if (!apiUp) {
                appendDemoMessage();
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage.text }),
                });

                if (!res.ok) throw new Error();

                const data = await res.json();

                setMessages((prev) =>
                    GiftedChat.append(prev, [
                        {
                            _id: Date.now() + 1,
                            text: data.reply,
                            createdAt: new Date(),
                            user: BOT_USER,
                        },
                    ])
                );
            } catch {
                appendDemoMessage();
            }
        },
        [apiUp]
    );

    const appendDemoMessage = () => {
        setMessages((prev) =>
            GiftedChat.append(prev, [
                {
                    _id: Date.now() + 1,
                    text:
                        'This is a demo project.\n\nTry the full version or contact me here:\nhttps://alexandercho.github.io/contact',
                    createdAt: new Date(),
                    user: BOT_USER,
                },
            ])
        );
    };

    return (
        <LinearGradient colors={['#020617', '#0F172A']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        onSend={(msgs) => onSend(msgs)}
                        user={HUMAN_USER}
                        placeholder='Type a message...'
                        scrollToBottom
                        renderInputToolbar={renderInputToolbar}
                        renderBubble={renderBubble}
                        renderSend={renderSend}
                        textInputStyle={styles.textInput}
                        messagesContainerStyle={styles.messages}
                        renderComposer={(props) => (
                            <Composer
                                {...props}
                                textInputProps={{
                                    ...props.textInputProps,
                                    ref: inputRef,
                                    blurOnSubmit: Platform.OS === 'web',
                                    onSubmitEditing: Platform.OS === 'web'
                                        ? () => {
                                            if (props.text && props.onSend) {
                                                props.onSend({ text: props.text.trim() }, true);
                                                setTimeout(() => inputRef.current?.focus(), 50);
                                            }
                                        }
                                        : undefined,
                                }}
                            />
                        )}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const renderInputToolbar = props => (
    <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={{ alignItems: 'center' }}
    />
);

const renderBubble = props => (
    <Bubble
        {...props}
        textStyle={{
            right: styles.rightBubbleText,
            left: styles.leftBubbleText,
        }}
        wrapperStyle={{
            right: styles.rightBubble,
            left: styles.leftBubble,
        }}
    />
);

const renderSend = props => (
    <Send {...props} containerStyle={styles.sendContainer}>
        <Ionicons
            name='send'
            size={20}
            color='#FFFFFF'
            style={styles.sendIcon}
        />
    </Send>
);
const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 900, // limits chat width on large screens
        paddingHorizontal: Platform.OS === 'web' ? 24 : 0,
    },

    messages: {
        paddingTop: 12,
        paddingHorizontal: Platform.OS === 'web' ? 12 : 0,
    },

    inputToolbar: {
        backgroundColor: '#020617',
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
        paddingHorizontal: Platform.OS === 'web' ? 16 : 12,
        paddingVertical: Platform.OS === 'web' ? 8 : 6,
    },

    textInput: {
        color: '#E5E7EB',
        fontSize: Platform.OS === 'web' ? 18 : 16,
        lineHeight: Platform.OS === 'web' ? 22 : 20,
    },

    rightBubble: {
        backgroundColor: '#6366F1',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 6,
    },

    leftBubble: {
        backgroundColor: '#020617',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 6,
    },

    rightBubbleText: {
        color: '#FFFFFF',
        fontSize: Platform.OS === 'web' ? 16 : 15,
        lineHeight: Platform.OS === 'web' ? 24 : 22,
    },

    leftBubbleText: {
        color: '#E5E7EB',
        fontSize: Platform.OS === 'web' ? 16 : 15,
        lineHeight: Platform.OS === 'web' ? 24 : 22,
    },

    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },

    sendIcon: {
        backgroundColor: '#6366F1',
        borderRadius: 999,
        padding: Platform.OS === 'web' ? 12 : 10,
        overflow: 'hidden',
    },
});