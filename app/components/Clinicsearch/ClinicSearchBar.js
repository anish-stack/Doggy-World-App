import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ClinicSearchBar = ({ onSearch }) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    const handleSearch = (text) => {
        setSearchText(text);
        onSearch(text);
    };

    return (
        <View style={styles.container}>
            {!searchVisible && (
                <>
                    <Text style={styles.title}>Select Clinic</Text>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <FontAwesome name="search" size={20} color="#232323" style={styles.icon} />
                    </TouchableOpacity>
                </>
            )}
            {searchVisible && (
                <>
                    <TouchableOpacity onPress={() => {
                        setSearchVisible(false);
                        setSearchText('');
                        onSearch(''); 
                    }}>
                        <FontAwesome name="angle-left" size={30} color="black" style={styles.icon} />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Search Clinic, Service and Food"
                        value={searchText}
                        onChangeText={handleSearch}
                        autoFocus={true}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
        height: 55,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
});

export default ClinicSearchBar;
