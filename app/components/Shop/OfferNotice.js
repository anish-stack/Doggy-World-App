import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import offerImage from '../../assets/saleoffer1.png';

const OfferNotice = () => {
    const screenWidth = Dimensions.get('window').width;
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: screenWidth,
                duration: 3000, 
                useNativeDriver: true,
            })
        ).start();
    }, [animatedValue, screenWidth]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, screenWidth],
        outputRange: [-screenWidth, screenWidth],
    });

    return (
        <View>
            <View className="mx-4 my-6 px-2 py-4 rounded-xl bg-[#ef5030] flex-row align-top space-x-2">
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 2.5,
                        transform: [{ translateX }],
                        opacity: 0.8,
                        zIndex: 1,
                    }}
                />
                <Text className="mt-1 pe-3">
                    <FontAwesome name="cart-arrow-down" size={23} color="#fff" />
                </Text>
                <Text className="text-white text-lg font-semibold">
                    Delivery in just 3 hrs, Upto 40% Off
                </Text>
            </View>
            <View className="mx-4">
                <Image source={offerImage} className="w-full h-40 rounded-2xl"/>
            </View>
        </View>
    );
};

export default OfferNotice;

