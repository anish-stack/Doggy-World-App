import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const MedicalCare = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const navigation = useNavigation();

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleBookNow = () => {
        navigation.navigate('Shop', {
            screen: 'Shop',
        });
    };

    const handleInterested = () => {
        setPopupMessage(
            <View className="flex-1 justify-center items-center">
                <View className="bg-green-600 rounded-full w-6 h-6 flex justify-center items-center"> 
                    <FontAwesome name="check" size={12} color={'#fff'} />
                </View>
                <Text className="text-lg font-semibold tracking-wider">
                    Interest Received
                </Text>
            </View>
        );
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    return (
        <View className="flex-1 p-4">
            <View>
                <View className="rounded-lg bg-slate-300 px-2 py-3 space-y-2 z-10">
                    <View className="flex flex-row justify-between">
                        <Text className="text-md font-semibold tracking-wide">
                            Pet Care Consultation Package
                        </Text>
                        <Text className="font-bold">999/year</Text>
                    </View>
                    <View className="flex flex-row justify-between align-middle">
                        <Text className="text-sm text-green-600 tracking-wide">
                            Save more than Rs. 3000
                        </Text>
                        <TouchableOpacity onPress={toggleAccordion}>
                            <Text className="font-semibold">
                                View Benefits&nbsp;
                                <FontAwesome name="caret-down" size={15} />
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isExpanded && (
                    <View className="mt-[-10] p-2 pt-4 bg-slate-200 rounded-lg space-y-4 drop-shadow-lg">
                        <Text className="text-[13px] font-medium">More Benefits</Text>
                        <Text className="font-medium mx-3">Any Grooming Service @10% Off</Text>
                        <Text className="font-medium mx-3">All Vaccinations @ 10% Off</Text>
                        <Text className="font-medium mx-3">Food & Accessories up to 15% Off</Text>
                        <Text className="font-medium mx-3">Medical Treatment @ 5% Off</Text>
                        <Text className="font-medium mx-3">
                            Unlimited Doctor Consultation @ Rs.299 vs 6
                        </Text>
                        <Text className="font-medium mx-3">
                            Above package valid for Delhi NCR only
                        </Text>
                        <View className="flex-row justify-between mb-3 pt-4">
                            <TouchableOpacity onPress={handleBookNow}>
                                <Text className="px-4 py-2 bg-[#ef5030] text-white rounded-lg font-bold tracking-wide">
                                    Book Now
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleInterested}>
                                <Text className="px-4 py-2 bg-orange-400 text-white rounded-lg font-bold tracking-wider">
                                    Interested
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity>
                                <Text className="text-xs text-slate-400 text-center mb-1">
                                    T&C and Other Benefits
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>

            {/* Popup for showing interest message */}
            <Modal visible={isPopupVisible} transparent={true} animationType="fade">
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-4 rounded-lg shadow-lg">
                        <Text className="text-center text-lg font-bold mb-4">{popupMessage}</Text>
                        <TouchableOpacity onPress={closePopup}>
                            <Text className="text-center text-blue-500">Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MedicalCare;
