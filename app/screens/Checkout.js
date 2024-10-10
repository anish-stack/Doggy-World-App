import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Layout from '../components/Layout/Layout'

const Checkout = ({navigation}) => {

    const handleCOD = () => {
        alert("Your Order Has Been Placed Successfully")
    }

    const handleOnline = () => {
        alert("Your Redirecting to Payment Gateway");
        navigation.navigate("payment")
    }

    return (
        <Layout>
            <View className="items-center justify-center mt-5">
                <Text className="text-2xl font-semibold my-5">Payment Options</Text>
                <Text className="text-xl font-semibold mb-2.5 text-gray-700">Total Amount : 101$</Text>
                <View className="bg-white w-[90%] rounded-lg p-6 my-2.5">
                    <Text className="text-gray-800 font-semibold text-base mb-2.5">Select Your Payment Mode</Text>
                    <TouchableOpacity className="bg-black h-10 rounded-lg justify-center my-2.5"
                     onPress={handleCOD}
                    >
                        <Text className="text-center text-white">Cash On Delivery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-black h-10 rounded-lg justify-center my-2.5"
                     onPress={handleOnline}
                    >
                        <Text className="text-center text-white">Online (CREDIT | DEBIT CARD)</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Layout>
    )
}

export default Checkout