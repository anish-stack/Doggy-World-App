import { View, Text, ImageBackground, Dimensions, ScrollView, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import Paw from './Paw.png'
import axios from 'axios'
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import Loader from '../../components/Loader/Loader'
import { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height
export default function Branch() {
    const [activeTab, setActiveTab] = useState('Near You');
    const locations = ['Near You', 'Delhi', 'Rohini', 'Noida', 'Gurugram'];
    const route = useRoute()
    const { item } = route.params;
    const navigation = useNavigation()

    const [data, setData] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const FetchData = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`http://192.168.1.5:7000/api/v1/Doctors/Get-Branch-Service?servicesId=${item}`);
            if (data.data.length > 0) {
                setData(data.data)
            } else {
                setData([])
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setError(error.response?.data?.message)

        }
    }

    useEffect(() => {
        FetchData()
    }, [item])
    if (loading) {
        return <Loader />
    }
    return (

        <ImageBackground
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            source={Paw}
            className="object-cover flex-1"
        >
            <View className="flex-1">
                {/* Location Tabs */}
                <View className="h-14 mt-4 px-2">
                    <ScrollView
                        horizontal
                        showsVerticalScrollIndicator={false}

                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', gap: 10, height: 30 }}
                    >
                        {locations.map((location, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setActiveTab(location)}
                                className={`px-4 py-1 rounded-2xl ${activeTab === location ? 'bg-green-600' : 'bg-red-400'}`}
                            >
                                <Text className="text-white font-medium">{location}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Branch Cards */}
                <ScrollView className="px-2">
                    {data && data.map((info, index) => (
                        <View key={index} className="bg-white relative rounded-lg shadow-lg mb-5 p-2">
                            {/* Image Slider */}
                            <ScrollView showsVerticalScrollIndicator={false} horizontal={true} showsHorizontalScrollIndicator={false}>
                                <View className="flex flex-row space-x-2 mb-4">
                                    {info.Images && info.Images.map((image, idx) => (
                                        <Image
                                            key={idx}
                                            source={{ uri: image.url }}
                                            resizeMode='cover'
                                            style={{ height: 150, width: SCREEN_WIDTH / 2.2 }}
                                            className="rounded-lg object-cover"
                                        />
                                    ))}
                                </View>
                            </ScrollView>


                            {/* Text and Info Section */}
                            <View className="mb-4">
                                <TouchableOpacity onPress={() => navigation.navigate('details', { itemId: info._id, serviceId: item })} >
                                    <Text className="text-lg px-2 font-semibold text-gray-800">
                                        Doggy World, {info?.Landmark || "N/A"}
                                    </Text>
                                    <Text className="text-sm px-2 text-gray-500">
                                        Opens At: {info?.OpensTime || "N/A"} AM - {info?.CloseTime} ⏲️
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex  flex-row justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                                <View className="flex flex-col items-center">
                                    {/* Doctors Section */}
                                    {/* <Text className="text-sm text-gray-500">Doctors Available</Text> */}
                                    <Text className="text-2xl font-bold text-green-600">
                                        {info.Doctors.length || 0} +
                                    </Text>
                                    <Text className="text-xs text-gray-400">Expert Professionals</Text>
                                </View>

                                {/* <View className="border-l-2 border-gray-300 h-full mx-4"></View> Divider */}

                                <View className="flex flex-col items-center">
                                    {/* Services Section */}
                                    {/* <Text className="text-sm text-gray-500">Services Offered</Text> */}
                                    <Text className="text-2xl font-bold text-blue-600">
                                        {info.Services.length || 0} +
                                    </Text>
                                    <Text className="text-xs text-gray-400">Premium Care</Text>
                                </View>
                            </View>


                            {/* Ratings */}
                            <Text className="text-white right-0 py-1 px-4 rounded-2xl bg-green-500 absolute font-bold">
                                Rating: {info.Ratings || "No rating"}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ImageBackground>

    )
}