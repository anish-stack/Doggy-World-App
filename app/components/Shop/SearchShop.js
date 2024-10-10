import React from 'react';
import { View, Text, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SearchShop = () => {
  return (
    <View className="px-[11px] pt-3 pb-5 drop-shadow-lg bg-white">
      <View className="flex-row justify-between mb-3">
        <View className="flex-row align-middle space-x-2">
          <Text className="font-bold tracking-wider text-[15px]">Add Address</Text>
          <FontAwesome name="plus-circle" size={23} color="#EF5030"/>
        </View>
        <View className="flex-row align-middle space-x-8">
          <FontAwesome name="cart-plus" size={23} color="#EF5030"/>
          <FontAwesome name="user" size={23} color="#EF5030"/>
        </View>
      </View>

      <View className="flex-row items-center border border-slate-500 rounded-lg px-2 py-2 bg-white">
        <TextInput
          className="flex-1"
          placeholder="Search for Accessories, Food, Treats..."
          autoFocus={true}
        />
        <FontAwesome name="search" size={20} color="#EF5030" />
      </View>
    </View>
  )
}

export default SearchShop;
