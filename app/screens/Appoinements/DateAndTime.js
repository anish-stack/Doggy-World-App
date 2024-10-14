import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios'; // Ensure axios is imported

const screenWidth = Dimensions.get('window').width;
const dayWidth = screenWidth / 8;

const generateCalendarDates = (year, month) => {
    const dates = [];
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        dates.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(new Date(year, month, i));
    }

    return dates;
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
        start.setMinutes(start.getMinutes() + 30);
    }

    return timeSlots;
};

export default function DateAndTime() {
    const route = useRoute();
    const { type, doctor } = route.params;
    const { businessHours } = doctor;
    const navigation = useNavigation();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedtime] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [bookedTimes, setBookedTimes] = useState([]); // State to store booked times
    const calendarDates = generateCalendarDates(currentYear, currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isTimePassed = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const appointmentTime = new Date(selectedDate);
        appointmentTime.setHours(hours, minutes, 0, 0);
        return appointmentTime < new Date(); // Return true if the appointment time is in the past
    };

    const handleMonthChange = (direction) => {
        if (direction === 'next') {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        } else {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        }
    };

    const handleDateSelect = (date) => {
        console.log("i am ", date)
  
        const localDateString = date.toLocaleDateString('en-CA');
        const normalizedDate = new Date(localDateString);
        console.log(normalizedDate)
        setSelectedDate(date);
        if (normalizedDate >= today) {

            const dayName = normalizedDate.toLocaleString('default', { weekday: 'long' });
            const selectedDayBusinessHour = businessHours.find(bh => bh.day.includes(dayName));

            if (selectedDayBusinessHour) {
                const timeSlots = MakeATimeSteps(selectedDayBusinessHour.startTime, selectedDayBusinessHour.endTime);
                setAvailableTimes(timeSlots);
                fetchAlreadyBookedTimes(normalizedDate); // Fetch booked times for the normalized date
            } else {
                setAvailableTimes([]);
                setBookedTimes([]); // Reset booked times if no business hours
            }
        }
    };




    const handleTimeSelect = (time) => {
        setSelectedtime(prevTime => (prevTime === time ? null : time));
    };

    const fetchAlreadyBookedTimes = async (date) => {
        const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        try {
            const { data } = await axios.get(`https://www.doggy.adsdigitalmedia.com/api/v1/Doctors/get-doctor-booked/${doctor._id}?date=${formattedDate}`);
            console.log(data)
            if (data.success) {
                setBookedTimes(data.data || []);
            } else {
                setBookedTimes([]);
            }
        } catch (error) {
            console.error("Error fetching booked times: ", error);
            setBookedTimes([]); // Reset booked times in case of an error
        }
    };

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View className="p-4 bg-white rounded-lg shadow-md">
                {/* Month Navigation */}
                <View className="flex flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => handleMonthChange('prev')} className="bg-gray-300 p-2 rounded-full">
                        <Text className="text-lg text-gray-700">⬅</Text>
                    </TouchableOpacity>
                    <Text className="text-xl font-semibold text-gray-800">
                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Text>
                    <TouchableOpacity onPress={() => handleMonthChange('next')} className="bg-gray-300 p-2 rounded-full">
                        <Text className="text-lg text-gray-700">➡</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex flex-row justify-between mt-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} className="text-lg font-semibold text-gray-800">{day}</Text>
                    ))}
                </View>

                <View className="flex flex-wrap flex-row justify-between mt-2">
                    {calendarDates.map((date, index) => (
                        <TouchableOpacity
                            key={index}
                            disabled={!date || (date < today)}
                            style={{ width: dayWidth - 9, height: 50, margin: 3.59 }}
                            className={`h-8 m-1 items-center justify-center mx-1 rounded-lg 
                             ${date && selectedDate && date.getTime() === selectedDate.getTime() ? 'bg-blue-600' : 'bg-gray-100'} 
                            ${!date || (date < today) ? 'opacity-50 bg-red-300' : ''}`}
                            onPress={() => handleDateSelect(date)}
                        >
                            {date ? (
                                <Text className={`text-lg ${selectedDate && date.getTime() === selectedDate.getTime() ? 'text-white' : 'text-gray-800'}`}>
                                    {date.getDate()}
                                </Text>
                            ) : null}
                        </TouchableOpacity>

                    ))}
                </View>

                {selectedDate && (
                    <View className="mt-8">
                        <Text className="text-lg font-semibold text-gray-800 mb-3">Available Times</Text>
                        <View className="flex flex-wrap flex-row justify-between gap-2">
                            {availableTimes.length ? (
                                availableTimes.map((time, index) => {
                                    const passed = isTimePassed(time); // Check if the time has passed
                                    const isBooked = bookedTimes.includes(time); // Check if the time is booked
                                    return (
                                        <TouchableOpacity
                                            onPress={() => handleTimeSelect(time)}
                                            key={index}
                                            className={`w-28 h-10 rounded-full flex items-center justify-center ${passed || isBooked ? 'bg-gray-400' : 'bg-green-500'} ${selectedTime === time ? 'bg-white border text-gray-900' : ''}`}
                                            disabled={passed || isBooked} 
                                        >
                                            <Text className={`${selectedTime === time ? 'text-gray-900' : 'text-white'} text-md font-medium`}>
                                                {time}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })
                            ) : (
                                <Text className="text-red-500">No available times for this date.</Text>
                            )}
                        </View>
                    </View>
                )}
            </View>
            {selectedTime ? (
                <TouchableOpacity
                    className="bg-white shadow-sm rounded-full outline-dashed  bottom-4  hover:bg-gray-700 font-bold py-4 px-4 border mt-4"
                    onPress={() => {
                        if (selectedDate && selectedTime) {
                            navigation.navigate('Booking-step', {type, date:selectedDate, time:selectedTime, doctor });
                        }
                    }}
                >
                    <Text className="text-center text-gray-800">Continue</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    className="bg-gray-300 rounded-full bottom-4  font-bold py-4 px-4 border mt-4"
                    disabled
                >
                    <Text className="text-center text-gray-800">Continue</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}
