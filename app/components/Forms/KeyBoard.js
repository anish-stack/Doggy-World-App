// CustomKeyboard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const CustomKeyboard = ({ onKeyPress, onDelete, onSubmit }) => {
    const keys = [
        '1', '2', '3',
        '4', '5', '6',
        '7', '8', '9',
        '0', 'Submit'
    ];

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10 }}>
            {keys.map(key => (
                <TouchableOpacity
                    key={key}
                    onPress={() => {
                        if (key === 'Submit') {
                            onSubmit();
                        } else if (key === 'Delete') {
                            onDelete();
                        } else {
                            onKeyPress(key);
                        }
                    }}
                    style={{
                        backgroundColor: '#007BFF',
                        borderRadius: 5,
                        padding: 15,
                        margin: 5,
                        width: 60,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 20 }}>{key}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
                onPress={onDelete}
                style={{
                    backgroundColor: '#FF4D4D',
                    borderRadius: 5,
                    padding: 15,
                    margin: 5,
                    width: 60,
                    alignItems: 'center'
                }}
            >
                <Text style={{ color: '#FFFFFF', fontSize: 20 }}>Delete</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CustomKeyboard;
