import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const catMessages = [
    "Cats bring joy with their playful antics.",
    "A cat's purr can soothe the soul.",
    "Cats are curious creatures that keep you entertained.",
    "With a cat, every day is a new adventure.",
    "Cats may be independent, but they love their humans deeply.",
    "A cat's cuddle is the best kind of comfort.",
    "Cats are the ultimate companions for relaxation.",
    "Their quirky personalities make them unforgettable.",
    "Cats are experts in finding the sunniest spots.",
    "Every cat has a unique charm that wins hearts."
];

const dogMessages = [
    "Dogs are loyal companions who always greet you with love.",
    "A dog's wagging tail is a sign of pure happiness.",
    "Dogs have an unmatched ability to make you smile.",
    "A dog's love is unconditional and everlasting.",
    "Every walk with a dog is an adventure waiting to happen.",
    "Dogs are always up for playtime and fun.",
    "A dog's bark can make the world feel safer.",
    "Dogs have a special way of knowing when you need comfort.",
    "Their goofy behavior can brighten the darkest days.",
    "A dog is a friend that will never let you down."
];

export default function PetType() {
    const navigation = useNavigation();
    const [selected, setSelected] = useState('dog');
    const [catMessage, setCatMessage] = useState('');
    const [dogMessage, setDogMessage] = useState('');

    const handleSelect = (petType) => {
        setSelected(petType);
    };

    const handleNext = () => {
        if (!selected) {
            Toast.show({
                type: 'error',
                text1: 'Oops! 🐾 No Pet Selected',
                text2: 'Please choose your furry friend to continue! 😺🐶',
            });
        } else {
            navigation.navigate('PetRegister', { petType: selected });
        }
    };

    useEffect(() => {
        setCatMessage(catMessages[Math.floor(Math.random() * catMessages.length)]);
        setDogMessage(dogMessages[Math.floor(Math.random() * dogMessages.length)]);
    }, []);

    return (
        <View className="flex-1 items-center justify-center  p-4 bg-white dark:bg-gray-800">
            <Text className="text-xl font-bold border-b  border-gray-300 text-gray-800 dark:text-white text-center">
                What is Your <Text className="text-green-500">Pet Type</Text>?
            </Text>
            <View className="flex-col items-center w-full justify-center mt-6">
                <TouchableOpacity
                    onPress={() => handleSelect('dog')}
                    className={`border-2 ${selected === 'dog' ? 'border-green-500' : 'border-transparent'} shadow-xl p-4 rounded-lg mb-4 flex items-center`}
                    style={{ width: SCREEN_WIDTH * 0.9 }}
                >
                    <Text className="text-center text-base mb-2 text-gray-800 dark:text-white">{dogMessage}</Text>
                    <LottieView
                        source={require('./dog.json')}
                        autoPlay
                        loop
                        style={{ width: SCREEN_WIDTH * 0.25, height: SCREEN_WIDTH * 0.25 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleSelect('cat')}
                    className={`border-2 ${selected === 'cat' ? 'border-green-500' : 'border-transparent'} shadow-xl p-4 rounded-lg mb-4 flex items-center`}
                    style={{ width: SCREEN_WIDTH * 0.9 }}
                >
                    <Text className="text-center  text-base mb-2 text-gray-800 dark:text-white">{catMessage}</Text>
                    <LottieView
                        source={require('./cat.json')}
                        autoPlay
                        loop
                        style={{ width: SCREEN_WIDTH * 0.25, height: SCREEN_WIDTH * 0.25 }}
                    />
                </TouchableOpacity>

                <View className='flex-row gap-2'>
                    <TouchableOpacity
                        className="border border-green-500 flex-row items-center justify-center px-4 rounded-full"
                        onPress={() => navigation.navigate('onboard')}
                    >
                        <Text className="text-gray-900 font-semibold mr-2">Back</Text>
                        <LottieView
                            source={require('./paw.json')}
                            autoPlay
                            loop
                            style={{ width: 40, height: 40 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="border flex-row items-center justify-center px-4 rounded-full"
                        onPress={handleNext}
                    >
                        <Text className="text-gray-900 font-semibold mr-2">Next</Text>
                        <LottieView
                            source={require('./paw.json')}
                            autoPlay
                            loop
                            style={{ width: 40, height: 40 }}
                        />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}
