import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Grooming from '../components/Membership/Grooming';
import Vaccination from '../components/Membership/Vaccination';
import MedicalCare from '../components/Membership/MedicalCare';


const Tab = createMaterialTopTabNavigator();

const Membership = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text className="text-center py-4 bg-white font-bold tracking-wider text-xl">Membership</Text>
      <View className="bg-[#ef5030] py-5">
        <Text className="text-center text-2xl font-semibold text-white">DW Membership</Text>
        <Text className="text-white text-center text-lg font-semibold">
          Exclusive Benefits, Save on Every Visit!
        </Text>
      </View>

      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#ef5030',
            tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
            tabBarIndicatorStyle: { backgroundColor: '#ef5030' },
          }}
        >
          <Tab.Screen name="Grooming" component={Grooming} />
          <Tab.Screen name="Vaccination" component={Vaccination} />
          <Tab.Screen name="Medical Care" component={MedicalCare} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Membership;
