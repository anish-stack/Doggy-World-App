import { View, Text, ImageBackground, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styled } from 'nativewind';
import InputBox from '../../components/Forms/InputBox';
import UniversalSelector from '../../components/Forms/Select';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import image from './pet back.jpg'
import LottieView from 'lottie-react-native';
export default function PetRegister() {
    const route = useRoute();
    const navigation = useNavigation();
    const { petType } = route.params || {};

    const [formData, setFormData] = useState({
        PetName: '',
        PetType: petType,
        PetDob: '',
        PetAge: '',
        PetBreed: ''
    });
    const [breeds, setBreeds] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [error, setError] = useState({});

    const handleChange = (name, value) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setError(prevError => ({ ...prevError, [name]: '' })); // Clear error on change
    };

    const ageCalculate = (dob) => {
        const birthDate = new Date(dob);
        const ageDiff = Date.now() - birthDate.getTime();
        const age = new Date(ageDiff).getUTCFullYear() - 1970;
        setFormData(prevData => ({ ...prevData, PetAge: age.toString() }));
    };

    const handleFetchBreed = async () => {
        try {
            let response;
            if (petType === 'Cat') {
                response = await fetch('https://api.thecatapi.com/v1/breeds');
            } else {
                response = await fetch('https://dog.ceo/api/breeds/list/all');
            }

            const data = await response.json();
            const breedList = petType === 'Cat' ? data : Object.keys(data.message);
            setBreeds(breedList);
        } catch (error) {
            console.log(error);
        }
    };

    const handleNext = async () => {
        const newError = {};
        if (!formData.PetName) newError.PetName = 'Pet Name is required';
        if (!formData.PetType) newError.PetType = 'Pet Type is required';
        if (!formData.PetBreed) newError.PetBreed = 'Pet Breed is required';
        if (!formData.PetDob) newError.PetDob = 'Pet DOB is required';

        setError(newError); // Update errors once

        if (Object.keys(newError).length === 0) {
            try {
                await AsyncStorage.setItem('petData', JSON.stringify(formData));
                navigation.navigate('Verification'); // Change 'NextScreen' to your desired next screen
            } catch (error) {
                console.log('Error saving data to AsyncStorage:', error);
            }
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const dob = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            handleChange('PetDob', dob);
            ageCalculate(dob);
        }
    };

    useEffect(() => {
        handleFetchBreed();
    }, [petType]);

    const petTypes = ['Dog', 'Cat'];
    const StyledView = styled(View);
    const StyledText = styled(Text);
    const StyledTouchableOpacity = styled(TouchableOpacity);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView className="flex-1  bg-white dark:bg-gray-900 ">
                <ImageBackground source={image} resizeMode="cover" className='opacity-90' >
                    <View className='bg-gray-200 px-4 w-full'>
                        <TouchableOpacity onPress={() => navigation.navigate('PetType')}>
                            <Text className='fixed top-5'>
                                <FontAwesome name="arrow-circle-left" size={35} className='text-xs text-red-500' color="#3B44F6" />

                            </Text>
                        </TouchableOpacity>
                        <StyledView className="flex items-start justify-center my-2">
                            <StyledText className="text-2xl capitalize font-bold mt-10 text-gray-800 dark:text-white">
                                Welcome to the Family, <Text className='text-green-500'>{petType || formData.PetType} Lover!</Text>
                            </StyledText>
                        </StyledView>
                        <StyledView className="my-2">
                            <UniversalSelector
                                options={petTypes}
                                value={formData.PetType}
                                onChange={(selectedValue) => handleChange('PetType', selectedValue)}
                                label="What is your pet type? 🐕‍🦺"
                                placeholder="Select a breed"
                            />
                        </StyledView>
                        {/* Pet Name Input */}
                        <InputBox
                            placeholder='What’s your pet’s name? 🐾'
                            value={formData.PetName}
                            setValue={(value) => handleChange('PetName', value)}
                            autoCorrect={false}
                        />
                        {error.PetName && <Text className="text-xs text-red-500">{error.PetName}</Text>}

                        {/* Date of Birth */}
                        <StyledView className="mb-1 mt-2">
                            <StyledText className="text-base font-semibold text-gray-800 dark:text-gray-300 mb-2">When was your <Text className='text-green-500'>{formData.PetName || 'furry friend'}</Text> born? 🎂</StyledText>
                            <StyledTouchableOpacity onPress={() => setShowDatePicker(true)} className="mb-4 bg-white">
                                <StyledText className="border border-gray-400 rounded p-3 text-start text-gray-700 dark:text-white">
                                    {formData.PetDob ? ` ${formData.PetDob}` : 'Tap here to select your pet’s birthday! 🎉'}
                                </StyledText>
                            </StyledTouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                            {error.PetDob && <Text className="text-xs text-red-500">{error.PetDob}</Text>}
                        </StyledView>

                        {/* Pet Age Input */}
                        <StyledView className="mb-1">
                            <StyledText className="text-base font-semibold text-gray-800 dark:text-gray-300 mb-2">How old is your beloved pet? 🌟</StyledText>
                            <InputBox
                                placeholder='Enter Pet Age (in years) 🐶'
                                value={formData.PetAge}
                                setValue={(value) => handleChange('PetAge', value)}
                                editable={false} // Disable editing for age
                            />
                            {error.PetAge && <Text className="text-xs text-red-500">{error.PetAge}</Text>}
                        </StyledView>

                        <StyledView className="my-4">
                            <UniversalSelector
                                options={breeds}
                                value={formData.PetBreed}
                                onChange={(selectedValue) => handleChange('PetBreed', selectedValue)}
                                label="What breed is your pet? 🐕‍🦺"
                                placeholder="Select a breed"
                            />
                            {error.PetBreed && <Text className="text-xs text-red-500">{error.PetBreed}</Text>}
                        </StyledView>

                        {/* Next Button */}
                        <TouchableOpacity
                            className=" border  border-blue-600 flex-row items-center justify-center px-4 rounded-full"
                            onPress={handleNext}
                        >
                            <Text className=" text-gray-900 font-semibold mr-2">One Step  Away!</Text>

                            <LottieView
                                source={require('./paw.json')}
                                autoPlay
                                loop
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('petLogin')}>
                            <Text className="text-gray-700 underline mb-9 mt-2 font-semibold mr-2">
                                Already a proud pet parent? 🐾🐶🐱
                            </Text>
                        </TouchableOpacity>

                    </View>

                </ImageBackground>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
