import { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import { GiftedChat, InputToolbar, Bubble, Send, Composer } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiPrompt, sendMessage } from '@/util/api';

const HUMAN_USER = { _id: 1 };
const BOT_USER = { _id: 2, name: 'Bot' };

const isWeb = Platform.OS === 'web';

export default function ChatbotScreen() {
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const storedPrompt = await AsyncStorage.getItem('prompt');
            const prompt = storedPrompt ?? '';

            setMessages([
                {
                    _id: Date.now(),
                    text: prompt !== '' ? prompt : 'Ask me anything.',
                    createdAt: new Date(),
                    user: prompt ? HUMAN_USER : BOT_USER,
                },
            ]);

            if (prompt) {
                await setApiPrompt(prompt);
            }
        };

        init();
    }, []);

    const onSend = useCallback(async (newMessages = []) => {
        setMessages(prev => GiftedChat.append(prev, newMessages));
        const userMessage = newMessages[0];
        const data = await sendMessage(userMessage);

        setMessages(prev =>
            GiftedChat.append(prev, [
                {
                    _id: Date.now() + 1,
                    text: data.reply,
                    createdAt: new Date(),
                    user: BOT_USER,
                },
            ])
        );
    }, []);

    return (
        <LinearGradient
            colors={['#020617', '#0F172A']}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <View style={styles.chatContainer}>
                    <GiftedChat
                        messages={messages}
                        onSend={onSend}
                        user={HUMAN_USER}
                        placeholder="Type a message..."
                        scrollToBottom
                        renderInputToolbar={renderInputToolbar}
                        renderBubble={renderBubble}
                        renderSend={renderSend}
                        textInputStyle={styles.textInput}
                        messagesContainerStyle={styles.messages}
                        renderComposer={props => (
                            <Composer
                                {...props}
                                textInputProps={{
                                    ...props.textInputProps,
                                    ref: inputRef,
                                    blurOnSubmit: isWeb,
                                    onSubmitEditing: isWeb
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
        containerStyle={[
            styles.inputToolbar,
            styles.surfaceDark,
            styles.borderTop,
        ]}
        primaryStyle={styles.inputPrimary}
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
            right: [styles.bubbleBase, styles.surfacePrimary],
            left: [styles.bubbleBase, styles.surfaceDark, styles.borderDefault],
        }}
    />
);

const renderSend = props => (
    <Send {...props} containerStyle={styles.sendContainer}>
        <Ionicons
            name="send"
            size={20}
            color="#FFFFFF"
            style={[
                styles.sendIconBase,
                styles.surfacePrimary,
            ]}
        />
    </Send>
);

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    chatContainer: {
        flex: 1,
        alignSelf: 'center',
        width: '100%',
        maxWidth: 900,
        paddingHorizontal: isWeb ? 24 : 0,
    },
    messages: {
        paddingTop: 12,
        paddingHorizontal: isWeb ? 12 : 0,
    },
    inputPrimary: {
        alignItems: 'center',
    },
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    surfaceDark: {
        backgroundColor: '#020617',
    },
    surfacePrimary: {
        backgroundColor: '#6366F1',
    },
    borderDefault: {
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#1E293B',
    },
    textInput: {
        color: '#E5E7EB',
        fontSize: isWeb ? 18 : 16,
        lineHeight: isWeb ? 22 : 20,
    },
    rightBubbleText: {
        color: '#FFFFFF',
        fontSize: isWeb ? 16 : 15,
        lineHeight: isWeb ? 24 : 22,
    },
    leftBubbleText: {
        color: '#E5E7EB',
        fontSize: isWeb ? 16 : 15,
        lineHeight: isWeb ? 24 : 22,
    },
    bubbleBase: {
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 6,
    },
    inputToolbar: {
        paddingHorizontal: isWeb ? 16 : 12,
        paddingVertical: isWeb ? 8 : 6,
    },
    sendIconBase: {
        borderRadius: 999,
        padding: isWeb ? 12 : 10,
        overflow: 'hidden',
    },
});