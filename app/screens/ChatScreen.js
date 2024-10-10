import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ChatScreen = ({ route }) => {
    const navigation = useNavigation();
    const { doctorName, doctorImage } = route.params;
    const [messages, setMessages] = useState([
        { sender: 'doctor', text: 'Greeting of the day, how can I help you today?' },
    ]);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            setMessages([...messages, { sender: 'user', text: inputText }]);
            setInputText('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('DoctorProfile', {
                                doctorName,
                                doctorImage,
                                doctorSpecialist: 'Specialist Name',
                                rating: '4.9 (5,380)',
                                experience: '4+ Years'
                            })
                        }
                    >
                        <Image source={doctorImage} style={styles.profileImage} resizeMode='cover' />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{doctorName}</Text>
                </View>
                <View style={styles.icons}>
                    <TouchableOpacity onPress={() => navigation.navigate('AudioCallScreen')}>
                        <FontAwesome name="phone" size={20} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('VideoCallScreen')}>
                        <FontAwesome name="video-camera" size={20} color="#fff" style={styles.icon} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.message,
                            msg.sender === 'user' ? styles.userMessage : styles.doctorMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <FontAwesome name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ef5030',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerText: {
        fontSize: 18,
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
    },
    icons: { flexDirection: 'row' },
    icon: { marginLeft: 10 },
    messagesContainer: { flex: 1, padding: 10 },
    message: { padding: 10, borderRadius: 10, marginVertical: 5 },
    userMessage: { alignSelf: 'flex-end', backgroundColor: '#ef5030' },
    doctorMessage: { alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
    messageText: { color: '#fff' },
    sendButton: { backgroundColor: '#ef5030', borderRadius: 20, padding: 10 },
});

export default ChatScreen;
