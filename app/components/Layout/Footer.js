import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRoute, useNavigation } from '@react-navigation/native';

const Footer = () => {

  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View className="flex-row justify-between px-2.5 bg-white shadow">
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("home")}
      >
        <FontAwesome name="home" size={25} color={"#000"} />
        <Text className="text-black text-[10px]">Home</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("clinic")}
      >
        <FontAwesome name="stethoscope" size={25} color={"#000"} />
        <Text className="text-black text-[10px]">Clinic</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("membership")}
      >
        <FontAwesome name="user-plus" size={25} color={"#000"} />
        <Text className="text-black text-[10px]">Member</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("chatlist")}
      >
        <FontAwesome name="comment" size={25} color={"#000"} />
        <Text className="text-black text-[10px]">Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => navigation.navigate("shop")}
      >
        <FontAwesome name="shopping-bag" size={24} color={"#000"} />
        <Text className="text-black text-[10px]">Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity className="items-center justify-center"
        onPress={() => alert("Pet Profile Page")}
      >
        <FontAwesome name="paw" size={25} color={"#000"} />
        <Text className="text-black text-[10px]">Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Footer