import { View, Text, ScrollView, TouchableOpacity, Dimensions, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;

const dayWidth = screenWidth / 8;

// Utility to generate dates for current and next month in calendar format
const generateCalendarDates = (year, month) => {
    const dates = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week the month starts on
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the current month

    // Fill the blank spaces for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        dates.push(null);
    }

    // Fill the calendar with the actual dates of the month
    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
    }

    return dates;
};

const formatDate = (date, formatType) => {
    const day = date.getDate().toString().padStart(2, '0');
    const monthShort = date.toLocaleString('default', { month: 'short' }); // 'Oct', 'Nov', etc.
    const monthNum = (date.getMonth() + 1).toString().padStart(2, '0'); // '01', '02', etc.
    const year = date.getFullYear();

    if (formatType === 'short') {
        return `${day} ${monthShort}`;
    } else if (formatType === 'long') {
        return `${year}-${monthNum}-${day}`;
    } else {
        return `${day} ${monthShort}`;
    }
};

const timeStringToDate = (timeString) => {
    const date = new Date();
    const [hours, minutes] = timeString.split(':');
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date;
};

const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const MakeATimeSteps = (startTime, endTime) => {
    const start = timeStringToDate(startTime);
    const end = timeStringToDate(endTime);
    const timeSlots = [];

    while (start <= end) {
        timeSlots.push(formatTime(start));
        start.setMinutes(start.getMinutes() + 30); // Increment by 30 minutes
    }

    return timeSlots;
};

export default function ChooseDate() {
    const route = useRoute();
    const { serviceId, ClinicId } = route.params;
    const navigation = useNavigation();

    const [clinic, setClinic] = useState({});
    const [timeGaps, setTimeGaps] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null); 
    const [selectedTime, setSelectedTime] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date()); 

    // Generate calendar dates for current month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const calendarDates = generateCalendarDates(currentYear, currentMonth);

    const fetchClinic = async () => {
        try {
            const { data } = await axios.get(`http://192.168.1.7:7000/api/v1/Doctors/Get-Single-Branch/${ClinicId}`);
            if (data.data) {
                setClinic(data.data);
            } else {
                setClinic({});
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinic();
    }, []);
    const matchedService = clinic.Services?.find(service => service._id === serviceId);

    const extractOpenTime = clinic?.OpensTime || '09:00';
    const extractCloseTime = clinic?.CloseTime || '12:00';

    useEffect(() => {
        const gaps = MakeATimeSteps(extractOpenTime, extractCloseTime);
        setTimeGaps(gaps);
    }, [extractOpenTime, extractCloseTime]);

    return (
        <ScrollView className="bg-gray-100">
            <View className="px-4 py-6">
                <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                    Choose Your Suitable Time
                </Text>
                <Text className="text-md text-gray-600 text-center mb-6">
                    For Your Buddy And Pet 🐶🐕
                </Text>

                {/* Calendar Section */}
                <View className="mb-6">
                    <View style={{ padding: 12, backgroundColor: '#fff', borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 }}>
                        {/* Weekday labels */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                <Text key={index} style={{ width: dayWidth, textAlign: 'center', fontWeight: 'bold', color: '#4a5568' }}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        {/* Render the dates */}
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {calendarDates.map((date, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        width: dayWidth - 9,
                                        paddingVertical: 8,
                                        paddingHorizontal: 4,
                                        margin: 3.59,
                                        borderRadius: 8,
                                        borderWidth: selectedIndex === index ? 2 : 0,
                                        borderColor: selectedIndex === index ? '#00aaa9' : 'transparent',
                                        opacity: date ? 1 : 0.4,
                                        backgroundColor: selectedDate === date ? '#00aaa9' : '#fff', // Change background color if selected
                                    }}
                                    onPress={() => {
                                        if (date) {
                                            setSelectedDate(date);
                                            setSelectedIndex(index); // Update selected index
                                            setSelectedTime(null); // Reset selected time when date changes
                                        }
                                    }}
                                    disabled={!date} // Disable empty cells
                                >
                                    <Text style={{ textAlign: 'center', color: selectedDate === date ? '#fff' : '#4a5568', fontWeight: '500' }}>
                                        {date ? date.getDate() : ''}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Show available time slots if a date is selected */}
                {selectedDate && (
                    <View className="mt-6">
                        <Text className="text-lg font-semibold text-white mb-2 p-4 bg-blue-500 rounded-lg shadow-md">
                            Available times for {formatDate(selectedDate)}:
                        </Text>

                        <View className="flex flex-row flex-wrap justify-center items-start gap-4">
                            {timeGaps.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        backgroundColor: selectedTime === item ? '#00A36C' : '#50C878',
                                        padding: 10,
                                        borderRadius: 10,
                                        width: 100,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => setSelectedTime(item)} // Set selected time
                                >
                                    <Text className="text-lg font-medium text-gray-100">{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Show Book Now button after selecting time */}
                        {selectedTime && (
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('Payment', {
                                        date: `${formatDate(selectedDate)} ${selectedTime}`,
                                        ServiceId: serviceId,
                                        match:matchedService,
                                        ClinicId: clinic
                                    });
                                }}
                                className="bg-red-600 fixed bottom-0 right-0 text-white py-3 px-6 rounded-md shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out mt-4 flex items-center justify-center"
                            >

                                <Text className="text-lg text-white font-semibold">Book Now 📅</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
