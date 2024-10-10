import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';



// PaymentInfo component to display payment details
const PaymentInfo = ({ label, value }) => (
  <View className="bg-gray-100 w-[80%] rounded-lg p-4 mb-4 shadow-lg border border-gray-200">
    <Text className="text-gray-600 font-semibold">{label}:</Text>
    <Text className="text-gray-800 font-medium">{value}</Text>
  </View>
);

export default function PaymentSuccessPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { details } = route.params;



  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', opacity: fadeAnim }}>
      <Text className="text-3xl font-bold text-green-600 mb-6">Payment Successful!</Text>
      <Text className="text-lg px-3 text-gray-700 text-center mb-8">
        Thank you for your payment! Your transaction was successful.
      </Text>

      {details && (
        <>
          <PaymentInfo label="Transaction ID" value={details._id} />
          {details.ServiceAndAppointmentTimeAndDate ? (

            <PaymentInfo label="Service and Appointment Date/Time" value={details.ServiceAndAppointmentTimeAndDate} />
          ) : null}
          <PaymentInfo label="Amount" value={`₹${details.PaymentInfo.PaymentAmount}`} />
        </>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('home')}
        className="bg-blue-600 py-4 px-8 rounded-lg shadow-lg mt-6"
      >
        <Text className="text-white font-semibold text-lg text-center">Go to Home</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
