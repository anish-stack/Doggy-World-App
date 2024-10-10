import React from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import consultationImg from '../../assets/consultation.png';
import groomingImg from '../../assets/grooming.png';
import prescriptionImg from '../../assets/prescription.png';
import medicineImg from '../../assets/medicine.png';

const brandData = [
    {
        image:consultationImg,
    },
    {
        image:groomingImg,
    },
    {
        image:prescriptionImg,
    },
    {
        image:medicineImg,
    },
    {
        image:consultationImg,
    },
    {
        image:groomingImg,
    },
]

const Brands = () => {
    return (
        <View>
            <View className="flex-row justify-between mx-3 mb-3">
                <Text className="font-bold text-lg tracking-wider">Brand</Text>
                <Text>
                    <FontAwesome name="arrow-right" size={23} color="#EF5030" />
                </Text>
            </View>
            <View className='flex-row justify-between flex-wrap px-2 gap-3'>
                {
                    brandData.map((item,index)=>{
                        return(
                            <Pressable className='w-[29%]' key={index}>
                                <View className="border border-slate-400 rounded-lg p-2">
                                    <Image source={item.image} className="w-full"/>
                                </View>
                            </Pressable>
                        )
                    })
                }
            </View>
        </View>
    )
}

export default Brands