import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';

const UniversalSelector = ({ options, value, onChange, label, placeholder }) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option);
        setModalVisible(false);
        setSearchTerm(''); 
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={styles.selector}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.selectedValue}>
                    {value ? value : placeholder}
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        />
                        <ScrollView>
                            {filteredOptions.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.option}
                                    onPress={() => handleSelect(option)}
                                >
                                    <Text style={styles.optionText}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    label: {
        marginBottom: 8,
        color: '#4B5563', // gray-700
    },
    selector: {
        borderWidth: 1,
        borderColor: '#9CA3AF',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#F9FAFB', // gray-100
    },
    selectedValue: {
        color: '#6B7280', // gray-600
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 5,
        maxHeight: '80%', // Limit modal height
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB', // gray-300
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#F9FAFB', // gray-100
    },
    option: {
        paddingVertical: 12,
    },
    optionText: {
        textTransform: 'capitalize',
        fontWeight: '500',
        color: '#4B5563', // gray-700
    },
    closeButton: {
        marginTop: 16,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#D1D5DB', // gray-300
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#000',
    },
});

export default UniversalSelector;
