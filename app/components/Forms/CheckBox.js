import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CustomCheckbox = ({ checked, onChange, label }) => {
    return (
        <TouchableOpacity onPress={onChange} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, checked ? styles.checked : styles.unchecked]}>
                {checked && <View  >
                    <Text>✅</Text></View>}
            </View>
            {label && <Text style={styles.label}>{label}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#D9FDD3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checked: {
        backgroundColor: '#D9FDD3',
    },
    unchecked: {
        backgroundColor: 'transparent',
    },
    checkmark: {
        width: 12,
        height: 12,
        backgroundColor: 'white',
    },
    label: {
        fontSize: 16,
    },
});

export default CustomCheckbox;
