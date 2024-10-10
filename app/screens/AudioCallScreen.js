import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AudioCallScreen = ({ route, navigation }) => {
  const { doctorName, doctorImage } = route.params || {};

  useEffect(() => {
    if (!doctorName || !doctorImage) {
      Alert.alert('Error', 'Doctor information is missing.');
    }
  }, [doctorName, doctorImage]);

  const [isRinging, setIsRinging] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  useEffect(() => {
    let interval;
    if (!isRinging) {
      interval = setInterval(() => {
        setCallDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRinging]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRinging) {
        setIsRinging(false);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [isRinging]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDisconnectCall = () => {
    navigation.goBack();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSpeakerToggle = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{doctorName}</Text>
      </View>

      <View style={styles.mainContent}>
        {doctorImage && (
          <Image source={doctorImage} style={styles.image} />
        )}
        <Text style={styles.status}>
          {isRinging ? 'Ringing...' : formatDuration(callDuration)}
        </Text>
        <Text style={styles.muteStatus}>
          {isMuted ? 'Muted' : 'Unmuted'}
        </Text>
        <Text style={styles.speakerStatus}>
          {isSpeakerOn ? 'Speaker On' : 'Speaker Off'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isMuted ? '#d9534f' : '#ef5030' }]}
          onPress={handleMuteToggle}
        >
          <FontAwesome name={isMuted ? 'microphone-slash' : 'microphone'} size={30} color='#fff' />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isSpeakerOn ? '#d9534f' : '#ef5030' }]}
          onPress={handleSpeakerToggle}
        >
          <FontAwesome name={isSpeakerOn ? 'volume-up' : 'volume-off'} size={30} color='#fff' />
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
          onPress={() => navigation.navigate('VideoCallScreen', { doctorName, doctorImage })}
        >
          <FontAwesome name='video-camera' size={30} color='#fff' />
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
  muteStatus: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  speakerStatus: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
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

export default AudioCallScreen;
