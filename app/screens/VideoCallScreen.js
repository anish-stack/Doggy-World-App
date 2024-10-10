import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RNCamera } from 'react-native-camera';

const VideoCallScreen = ({ route, navigation }) => {
    const { doctorName, doctorImage } = route.params || {};

    if (!doctorName || !doctorImage) {
        Alert.alert('Error', 'Doctor information is missing.');
    }

    const [isCameraOn, setIsCameraOn] = useState(true);
    const cameraRef = useRef(null);

    const handleToggleCamera = () => {
        setIsCameraOn(prevState => !prevState);
    };

    const handleDisconnectCall = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.name}>{doctorName}</Text>
            </View>

            <View style={styles.mainContent}>
                {isCameraOn ? (
                    <RNCamera
                        ref={cameraRef}
                        style={styles.camera}
                        type={RNCamera.Constants.Type.front}
                        autoFocus={RNCamera.Constants.AutoFocus.on}
                    />
                ) : (
                    <Image source={doctorImage} style={styles.image} />
                )}
                <Text style={styles.status}>
                    {isCameraOn ? 'Camera On' : 'Camera Off'}
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isCameraOn ? '#d9534f' : '#ef5030' }]}
                    onPress={handleToggleCamera}
                >
                    <FontAwesome name={isCameraOn ? 'video-camera' : 'video-camera-slash'} size={30} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.endCallButton}
                    onPress={handleDisconnectCall}
                >
                    <FontAwesome name='phone' size={30} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('chat', { doctorName, doctorImage })}
                >
                    <FontAwesome name='comment' size={30} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('AudioCallScreen', { doctorName, doctorImage })}
                >
                    <FontAwesome name='phone' size={30} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c1c1e',
    },
    header: {
        position: 'absolute',
        top: 40,
        right: 20,
        alignItems: 'flex-end',
    },
    name: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 5,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '100%',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    status: {
        fontSize: 24,
        color: '#fff',
        marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    button: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#ef5030',
        borderRadius: 50,
    },
    endCallButton: {
        backgroundColor: '#d9534f',
        padding: 15,
        borderRadius: 50,
        alignItems: 'center',
    },
});

export default VideoCallScreen;
