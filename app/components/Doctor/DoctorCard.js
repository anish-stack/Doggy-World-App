import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


const DoctorCard = ({ d }) => {

    const navigation = useNavigation();

    //More Details Button
    const handleMoreButton = (id, name, image) => {
        navigation.navigate('chat', { doctorName: name, doctorImage: image });
    };

    return (
        <View>
            <View style={styles.shadow} className="w-40 rounded justify-center mb-4">
                <Image source={d?.imageUrl} className="w-full h-40 items-center rounded-t" resizeMode='contain' />
                <View className="p-2">
                    <Text className="text-base font-medium tracking-wider mt-1">{d?.name}</Text>
                    <Text className="text-sm text-gray-400">{d?.degree}</Text>
                    <View className="flex-row justify-between align-middle my-1.5">
                        <View className="flex-row">
                            <View className="mt-1">
                                <FontAwesome name='star' size={12} color={"#FDBE00"} />
                            </View>
                            <Text className="ml-1 text-xs">{d?.rating}</Text>
                        </View>
                        <View>
                            <View className="flex-row">
                                <View className="mt-1">
                                    <FontAwesome name='star' size={12} color={"#FDBE00"} />
                                </View>
                                <Text className="ml-1 text-xs">{d?.exprince}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="flex-row">
                        <Text className="text-lg font-semibold">₹{d?.fee} </Text>
                        {/* <Text className="text-lg font-semibold text-gray-400">Inc.VAT</Text> */}
                    </View>
                    <View className="flex-row justify-between items-center mt-2">
                        <TouchableOpacity onPress={() => handleMoreButton(d._id, d.name, d.imageUrl)}
                            className="flex-row bg-[#ef5030] items-center rounded px-2 py-3 w-full justify-between"
                        >
                            <Text className="text-white text-xs">CHAT WITH DOCTOR </Text>
                            <FontAwesome name='comments-o' size={14} color={"#fff"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        elevation: 5,
        shadowRadius: 6,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        backgroundColor: '#fff',
        shadowOffset: { width: 0, height: 0 },
    },
})

export default DoctorCard;