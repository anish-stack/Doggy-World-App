import React from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const doctors = [
  { id: '1', name: 'Dr. Mahbuba Islam', message: 'I am a cardio patient. I need your help', image: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Dr. Pankaj', message: 'I am a cardio patient. I need your help', image: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Dr. Mohan', message: 'I am a cardio patient. I need your help', image: 'https://via.placeholder.com/50' },
  { id: '4', name: 'Dr. Riya', message: 'I am a cardio patient. I need your help', image: 'https://via.placeholder.com/50' },
  { id: '5', name: 'Dr. Kawsar Ahmed', message: 'I am a cardio patient. I need your help', image: 'https://via.placeholder.com/50' },
];

const ChatList = () => {
  const renderDoctor = ({ item }) => (
    <View className="flex-row items-center p-4 border-b border-gray-200">
      <Image source={{ uri: item.image }} className="w-12 h-12 rounded-full mr-4" />
      <View>
        <Text className="font-bold text-black">{item.name}</Text>
        <Text className="text-gray-600">{item.message}</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#2C3E74] p-4 flex-row items-center justify-between">
        <Text className="text-white text-lg font-bold">Message</Text>
        <View className="flex-row space-x-4">
          <FontAwesome name="pencil" size={20} color="#fff" />
          <FontAwesome name="search" size={20} color="#fff" />
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white p-2 shadow-md">
        <TextInput
          placeholder="Search Chat"
          className="flex-1 bg-gray-100 p-2 rounded-md"
        />
        <FontAwesome name="sliders" size={20} color="#000" className="ml-2" />
      </View>

      {/* Chat List */}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctor}
        className="mt-2"
      />
    </View>
  );
};

export default ChatList;
