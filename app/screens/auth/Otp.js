import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import loginLogo from '../../assets/login.png';
import InputBox from '../../components/Forms/InputBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import Toast from 'react-native-toast-message'; 

const Otp = ({ navigation }) => {
    const [contactNumber, setContactNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(10); 
    const [isResendEnabled, setIsResendEnabled] = useState(false);

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('contactNumber');
            // const valueoken = await AsyncStorage.getItem('doogy-token');

            if (value !== null) {
                console.log(value)
                setContactNumber(value);
            }
            // console.log(valueoken)
        } catch (e) {
            console.error(e);
        }
    };

    const handleVerify = async () => {
        try {
            const res = await axios.post('https://www.doggy.adsdigitalmedia.com/api/v1/auth/verify-Otp', {
                Contact: contactNumber,
                otp: otp
            });
            Toast.show({
                type: 'success',
                text1: 'Verification Success',
                text2: res.data?.message || 'OTP Verified Successfully'
            });
            console.log(res.data);
            await AsyncStorage.setItem('doogy-token', res.data?.token);
            // navigation.navigate('home');
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error.response?.data?.message || 'An error occurred during verification'
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await axios.post('https://www.doggy.adsdigitalmedia.com/api/v1/auth/resend-Otp', {
                Contact: contactNumber
            });
            Toast.show({
                type: 'success',
                text1: 'OTP Resent',
                text2: res.data?.message || 'OTP has been resend successfully'
            });
            console.log(res.data);
            setTimer(120); // Reset timer to 2 minutes
            setIsResendEnabled(false);
        } catch (error) {
            console.error(error);
            Toast.show({
                type: 'error',
                text1: 'Resend Failed',
                text2: error.response?.data?.message || 'An error occurred while resending OTP'
            });
        }
    };

    useEffect(() => {
        getData();

        // Start the timer
        let countdown;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(countdown);
                        setIsResendEnabled(true); // Enable resend button when timer ends
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        } else {
            clearInterval(countdown);
        }

        return () => clearInterval(countdown); // Cleanup on unmount
    }, [timer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleLogin = () => {
        handleVerify();
    };

    return (
        <View className="justify-center h-[80%]">
            <Image source={loginLogo} className="h-24 w-24 mb-6 mx-auto" resizeMode='contain' />
            <InputBox 
                placeholder={'Type OTP Here'} 
                value={otp} 
                setValue={setOtp} 
               
                maxLength={6} 
            />
            <TouchableOpacity 
                className="bg-black w-10/12 mx-auto items-center py-2 mt-1 rounded-lg" 
                onPress={handleLogin}
            >
                <Text className="text-white text-base font-semibold text-widest">Submit OTP</Text>
            </TouchableOpacity>

            <View className="items-center mt-4">
                <Text className="text-sm text-gray-600">
                    {isResendEnabled ? (
                        <TouchableOpacity onPress={handleResendOtp}>
                            <Text className="text-blue-500">Resend OTP</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text>Resend OTP in {formatTime(timer)}</Text>
                    )}
                </Text>
            </View>

            <TouchableOpacity 
                onPress={() => navigation.navigate("home")} 
                className="flex-row mx-auto mt-5 items-center justify-center"
            >
                <Text className="text-sm tracking-widest font-medium text-gray-600">Skip for now </Text>
                <FontAwesome name="arrow-right" size={10} color={"#4b5563"} />
            </TouchableOpacity>
        </View>
    );
};

export default Otp;
