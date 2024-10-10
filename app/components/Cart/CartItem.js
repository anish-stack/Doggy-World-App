import { View, Text, Image } from 'react-native'
import React from 'react'

const CartItem = ({item}) => {
  return (
    <View className="m-2.5 bg-white rounded-md flex-row justify-evenly items-center">
      <Image source={{uri: item?.imageUrl}} className="h-12 w-12"/>
      <Text className="text-sm">{item?.name}</Text>
      <Text className="text-sm">{item?.price}</Text>
    </View>
  )
}

export default CartItem