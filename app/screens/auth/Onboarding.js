import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import slideOne from './SCREEN -2.png';
import slideTwo from './SCREEN -1.png';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen() {
    const navigation = useNavigation();
    const [login, setLogin] = useState(false)

    const getData = async () => {
        try {
            const saveData = await AsyncStorage.getItem('AccessToken');
           
            if (saveData) { 
                setLogin(true)
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (login) {
            navigation.navigate('home');
        }
    }, [login, navigation]);

    return (
        <View className="flex-1 dark:bg-dark bg-[#F6F7F8]">
            <Onboarding
                pages={[
                    {
                        backgroundColor: '#F6F7F8',
                        image: <LottieView
                            source={require('./Animation2.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />,
                        title: (
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' }}>
                                Welcome to <Text className='text-green-500'>Pet Care</Text>
                            </Text>
                        ),
                        subtitle: (
                            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
                                A world of  love and care for your pet awaits!
                            </Text>
                        ),
                    },
                    {
                        backgroundColor: '#F6F7F8',
                        image: <Image source={slideTwo} style={{ width: 250, height: 250, alignSelf: 'center' }} resizeMode="contain" />,
                        title: (
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' }}>
                                All Care Of <Text className='text-green-500'>Pet in One <Text className='text-red-400'>Place</Text></Text>
                            </Text>
                        ),
                        subtitle: (
                            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
                                Begin the journey to happier, healthier pets today.
                            </Text>
                        ),
                    },
                    {
                        backgroundColor: '#F6F7F8',
                        image: (
                            <LottieView
                                source={require('./Animation - 1726994771853.json')}
                                autoPlay
                                loop
                                style={{ width: 200, height: 200 }}
                            />
                        ),
                        title: (
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' }}>
                                Your Pet’s  <Text className='text-green-500'>Health</Text>, Our Priority
                            </Text>
                        ),
                        subtitle: (
                            <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8 }}>
                                Sign up now for the best pet services.
                            </Text>
                        ),
                    },
                ]}
                SkipButtonComponent={(props) => (
                    <TouchableOpacity   {...props} onPress={() => navigation.navigate('PetRegister')} style={{ paddingHorizontal: 32, paddingVertical: 8, backgroundColor: '#D1D5DB', borderRadius: 9999 }}>
                        <Text style={{ color: '#374151', fontWeight: '600' }}>Skip</Text>
                    </TouchableOpacity>
                )}
                NextButtonComponent={(props) => (
                    <TouchableOpacity {...props} style={{ paddingHorizontal: 32, paddingVertical: 8, backgroundColor: '#16A34A', borderRadius: 9999 }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Next</Text>
                    </TouchableOpacity>
                )}
                DoneButtonComponent={(props) => (
                    <TouchableOpacity {...props} onPress={() => navigation.navigate('PetType')} style={{ paddingHorizontal: 32, paddingVertical: 8, backgroundColor: '#3B82F6', borderRadius: 9999 }}>
                        <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Register Now</Text>
                    </TouchableOpacity>
                )}
                transitionAnimationDuration={100}
                bottomBarHighlight={false}
                showSkip={true}
                showDone={true}
                containerStyles={{ paddingVertical: 16 }}
            />
        </View>
    );
}
