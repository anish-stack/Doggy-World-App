import { View, Text, Image, Dimensions } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import discountPng from './discount.png'
const SCREEN_HEIGHT = Dimensions.get('window').height
import { useNavigation } from '@react-navigation/native'
export default function ServiceCard({ item }) {
    const navigation = useNavigation()
    return (
        <View style={{ elevation: 2 }} className=" bg-white rounded-lg shadow-lg mb-4 px-1">
            <View className="flex-row  pb-2 border-gray-300 items-start justify-between">
                <View className="w-2/3 pr-2">
                    <Text className="text-lg font-semibold">{item?.ServiceName}</Text>
                    <Text className="text-gray-600  whitespace-nowrap truncate">
                        {item?.Para ? item.Para.substring(0, 50) + (item.Para.length > 50 ? '...' : '') : ''}
                    </Text>

                    <View className="flex-row items-center mt-2">
                        <Text className="text-xl font-bold text-green-600"> ₹{item?.DiscountPrice}</Text>
                        <Text className="text-gray-500 ml-2 line-through">₹{item?.Price}</Text>
                    </View>
                    <View className="flex-row w-20 bg-red-200 py-1 px-3 justify-center rounded-2xl items-center mt-1">
                        <Image source={discountPng} style={{ width: 12, height: 12 }} resizeMode='contain' />
                        <Text className="ml-1 text-red-500">{item.DiscountPercentage}%</Text>
                    </View>
                </View>
                <View className="w-1/3  flex items-center">
                    <Image
                        source={{ uri: item?.Images?.[0]?.url }}
                        style={{ width: 120, height: 120 }}

                        resizeMode='cover'
                        className="rounded-lg  relative"
                    />
                    <TouchableOpacity onPress={() => navigation.navigate('Branch', { item: item._id })} className="bg-green-500 absolute bottom-[-20px] mt-2 px-4 py-2 rounded-full">
                        <Text className="text-white font-semibold">Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}