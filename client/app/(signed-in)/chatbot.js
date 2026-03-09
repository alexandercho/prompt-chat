import { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    Platform
} from 'react-native';
import { GiftedChat, InputToolbar, Bubble, Send, Composer } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setApiPrompt, sendMessage } from '@/util/api';
import SignOutButton from '@/components/SignOutButton';

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
                    user: prompt ? HUMAN_USER : BOT_USER
                }
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
                    user: BOT_USER
                }
            ])
        );
    }, []);

    return (
        <LinearGradient
            colors={['#020617', '#0F172A']}
            style={styles.flex1}
        >
            <SafeAreaView style={styles.flex1}>
                <View style={styles.pageContainer}>
                    <View style={styles.chatCard}>
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
                            messagesContainerStyle={[styles.messages, isWeb && styles.hideScrollbar]}
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
                                            : undefined
                                    }}
                                />
                            )}
                        />
                    </View>
                </View>
                <SignOutButton />
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
            styles.borderTop
        ]}
        primaryStyle={styles.inputPrimary}
    />
);

const renderBubble = props => (
    <Bubble
        {...props}
        textStyle={{
            right: styles.rightBubbleText,
            left: styles.leftBubbleText
        }}
        wrapperStyle={{
            right: [
                styles.bubbleBase,
                styles.surfacePrimary,
                styles.sendBubble
            ],
            left: [
                styles.bubbleBase,
                styles.surfaceDark,
                styles.borderDefault,
                styles.replyBubble
            ]
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
                styles.surfacePrimary
            ]}
        />
    </Send>
);

const styles = StyleSheet.create({
    /* Layout */
    flex1: {
        flex: 1
    },
    pageContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: isWeb ? 24 : 0,
        paddingTop: isWeb ? 32 : 0,
        paddingBottom: isWeb ? 32 : 0
    },
    chatCard: {
        flex: 1,
        width: '100%',
        maxWidth: 900,
        backgroundColor: '#0B1220',
        borderRadius: isWeb ? 24 : 0,
        overflow: 'hidden',
        borderWidth: isWeb ? 1 : 0,
        borderColor: '#1E293B'
    },

    /* Message List */
    messages: {
        paddingTop: 16,
        paddingHorizontal: 0
    },
    hideScrollbar: {
        // Firefox
        scrollbarWidth: 'none',
        // IE 10+
        msOverflowStyle: 'none',
        // Webkit (Chrome, Safari, Edge)
        '::-webkit-scrollbar': {
            display: 'none'
        }
    },

    /* Surfaces */
    surfaceDark: {
        backgroundColor: '#020617'
    },
    surfacePrimary: {
        backgroundColor: '#6366F1'
    },
    borderDefault: {
        borderWidth: 1,
        borderColor: '#1E293B'
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#1E293B'
    },

    /* Typography */
    textInput: {
        color: '#E5E7EB',
        fontSize: isWeb ? 17 : 16,
        lineHeight: isWeb ? 24 : 22,
        paddingTop: 10
    },
    rightBubbleText: {
        color: '#FFFFFF',
        fontSize: isWeb ? 16 : 15,
        lineHeight: 22
    },
    leftBubbleText: {
        color: '#E5E7EB',
        fontSize: isWeb ? 16 : 15,
        lineHeight: 22
    },

    /* Bubbles */
    bubbleBase: {
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 10,
        flexShrink: 1,
        flexWrap: 'wrap'
    },
    sendBubble: {
        alignSelf: 'flex-end',
        marginRight: 10
    },
    replyBubble: {
        alignSelf: 'flex-start',
        marginLeft: 10,
        maxWidth: '15%'
    },

    /* Input Toolbar */
    inputToolbar: {
        paddingHorizontal: isWeb ? 20 : 12,
        paddingVertical: isWeb ? 14 : 8
    },
    inputPrimary: {
        alignItems: 'center'
    },

    /* Send Button */
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6
    },
    sendIconBase: {
        borderRadius: 999,
        padding: isWeb ? 14 : 11,
        overflow: 'hidden'
    }
});