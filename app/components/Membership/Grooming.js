import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

// Reusable Accordion Item Component
const AccordionItem = ({ title, price, savings, benefits, isExpanded, toggleAccordion, onBookNow, onInterested }) => (
    <View className="mb-4">
        <View className="rounded-lg bg-slate-300 px-2 py-3 space-y-2">
            <View className="flex flex-row justify-between">
                <Text className="text-md font-semibold tracking-wide">{title}</Text>
                <Text className="font-bold">{price}</Text>
            </View>
            <View className="flex flex-row justify-between align-middle">
                <Text className="text-sm text-green-600 tracking-wide">{savings}</Text>
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
                {benefits.map((benefit, index) => (
                    <Text key={index} className="font-medium mx-3">{benefit}</Text>
                ))}
                <View className="flex-row justify-between mb-3 pt-4">
                    <TouchableOpacity onPress={onBookNow}>
                        <Text className="px-4 py-2 bg-[#ef5030] text-white rounded-lg font-bold tracking-wide">Book Now</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onInterested}>
                        <Text className="px-4 py-2 bg-orange-400 text-white rounded-lg font-bold tracking-wider">Interested</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Text className="text-xs text-slate-400 text-center mb-1">T&C and Other Benefits</Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);

const Grooming = () => {
    const [expandedItems, setExpandedItems] = useState({
        grooming: false,
        vaccination: false,
        medicalCare: false,
    });

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const navigation = useNavigation();

    const toggleAccordion = (type) => {
        setExpandedItems((prevState) => ({
            ...prevState,
            [type]: !prevState[type],
        }));
    };

    const handleBookNow = () => {
        navigation.navigate('Shop', { screen: 'Shop' });
    };

    const handleInterested = () => {
        setPopupMessage(
            <View className="flex-1 justify-center items-center">
                <View className="bg-green-600 rounded-full w-6 h-6 flex justify-center items-center">
                    <FontAwesome name="check" size={12} color={'#fff'} />
                </View>
                <Text className="text-lg font-semibold tracking-wider">Interest Received</Text>
            </View>
        );
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    return (
        <ScrollView className="flex-1 p-4 space-y-4">
            <AccordionItem
                title="Grooming Standard Membership"
                price="3499/year"
                savings="Save more than Rs. 4000"
                benefits={[
                    "Any Grooming Service @10% Off",
                    "All Vaccinations @ 10% Off",
                    "Food & Accessories up to 15% Off",
                    "Medical Treatment @ 5% Off",
                    "Unlimited Doctor Consultation @ Rs.299 vs 6",
                    "Above package valid for Delhi NCR only",
                ]}
                isExpanded={expandedItems.grooming}
                toggleAccordion={() => toggleAccordion('grooming')}
                onBookNow={handleBookNow}
                onInterested={handleInterested}
            />

            <AccordionItem
                title="Grooming Delux Membership"
                price="6499/year"
                savings="Save more than Rs. 5500"
                benefits={[
                    "Unlimited Doctor Consultation @ Rs. 199",
                    "All Vaccinations @ 10% Off",
                    "Food &  Accessories upto 15% Off",
                    "Medical Treatment @ 5% Off",
                    "Above package valid for Delhi NCR only",
                ]}
                isExpanded={expandedItems.vaccination}
                toggleAccordion={() => toggleAccordion('vaccination')}
                onBookNow={handleBookNow}
                onInterested={handleInterested}
            />

            <AccordionItem
                title="Grooming Advanced Membership"
                price="4899/year"
                savings="Save more than Rs. 5400"
                benefits={[
                    "Unlimited Doctor Consultation @ Rs. 199",
                    "All Vaccinations @ 10% Off",
                    "Food &  Accessories upto 15% Off",
                    "Medical Treatment @ 5% Off",
                    "Above package valid for Delhi NCR only",
                ]}
                isExpanded={expandedItems.medicalCare}
                toggleAccordion={() => toggleAccordion('medicalCare')}
                onBookNow={handleBookNow}
                onInterested={handleInterested}
            />

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
        </ScrollView>
    );
};

export default Grooming;
