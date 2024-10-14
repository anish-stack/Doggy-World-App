import { View, Text, StyleSheet, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Lottie from 'lottie-react-native';

// Import your Lottie animation file
const successAnimation = require('./success.json');

export default function SuccessPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const { info } = route.params;



    const [animationStarted, setAnimationStarted] = useState(false);


    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStarted(true);
        }, 1000);


        return () => clearTimeout(timer);
    }, []);


    const currentDateTime = new Date().toLocaleString();

    return (
        <View style={styles.container}>
            {animationStarted && (
                <Lottie
                    source={successAnimation}
                    autoPlay
                    loop
                    speed={0.5}
                    style={styles.animation}
                />
            )}
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.message}>
                "🎉 Congratulations!
                Your appointment is confirmed.
                Thank you for being with us! 🌟"
            </Text>


            <Text style={styles.dateTime}>Completed on: {currentDateTime}</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('home')}
                color="#28a745"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff', 
        padding: 20,
    },
    animation: {
        width: 250,
        height: 250, 
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: 10, 
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333', 
        marginBottom: 10, 
    },
    dateTime: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666', // Gray color for date and time
        marginBottom: 20, // Space below the date/time
    },
});
