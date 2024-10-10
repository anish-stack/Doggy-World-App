import React, { useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styled } from 'nativewind';
import slideOne from './SCREEN -2.png'
import slideTwo from './SCREEN -1.png'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    image: slideOne,
    title: 'Welcome to Pet Care',
    description: 'A world of love and care for your pet awaits!',
  },
  {
    id: 2,
    image: slideTwo,
    title: 'All Care Of Pet in One Place',
    description: 'Begin the journey to happier, healthier pets today.',
  },
  {
    id: 3,
    image: slideTwo,
    title: 'All Care Of Pet in One Place',
    description: 'Begin the journey to happier, healthier pets today.',
  },
];

const OnboardingSlide = styled(View);



const ShowSliders = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const handleNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      translateX.value = withSpring((currentIndex + 1) * -SCREEN_WIDTH);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      translateX.value = withSpring((currentIndex - 1) * -SCREEN_WIDTH);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onGestureEvent = (event) => {
    if (event.nativeEvent.translationX < -20) {
      // Swiped left
      runOnJS(handleNextSlide)();
    } else if (event.nativeEvent.translationX > 20) {
      // Swiped right
      runOnJS(handleSwipeRight)();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-[#F6F7F8]">
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View className="w-full flex-row" style={[{ width: SCREEN_WIDTH / 3 * slides.length }, animatedStyle]}>
              {slides.map((item) => (
                <View key={item.id} className="w-full px-4 py-6" style={{ width: SCREEN_WIDTH }}>
                  <Image source={item.image} className="w-[300px] h-[300px] mx-auto" resizeMode="contain" />
                  <Text className="text-2xl text-gray-900 font-bold text-center mt-4">{item.title}</Text>
                  <Text className="text-center text-gray-500 mt-2">{item.description}</Text>
                </View>
              ))}
            </Animated.View>
          </PanGestureHandler>

          {/* Dots Indicator */}
          <View className="flex-row justify-center mt-6">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${currentIndex === index ? 'bg-green-500' : 'bg-gray-300'}`}
              />
            ))}
          </View>

          {/* Button for next slide */}
          <TouchableOpacity
            onPress={handleNextSlide}
            className="bg-green-600 rounded-full px-6 w-52 text-clip text-center py-2 mt-6"
          >
            <Text className="text-white text-center text-lg">
              {currentIndex === slides.length - 1 ? 'Register Now' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default ShowSliders;
