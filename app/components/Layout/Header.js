import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const Header = () => {
  const [searchText, setSearchText] = useState("");

  //Function for Search
  const handleSearch = () => {
    console.log(searchText);
    setSearchText("");
  }

  return (
    <View className="h-16 bg-[#4FAD65]">
      <View className="flex flex-1 flex-row items-center px-3">
        <TextInput value={searchText} onChangeText={(text) => setSearchText(text)}
         className="border-[0.4px] border-[#121611] w-full rounded px-1 text-sm text-[#888] bg-white p-2"
         placeholder="Search Clinics, Service and Food" placeholderTextColor="#888"
        />
        <TouchableOpacity className="absolute right-5" onPress={handleSearch}>
          <FontAwesome name="search" size={20} color={'#888'}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header