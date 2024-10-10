import { View, TextInput } from 'react-native'
import React from 'react'

const InputBox = ({ placeholder, autoFocus,value, setValue, secureTextEntry = false, keyboardType = 'default', autoComplete = 'off', autoCorrect = true, maxLength }) => {
    return (
        <View className="justify-center items-center">
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                autoCorrect={autoCorrect}
                maxLength={maxLength}
                className="border border-gray-400 w-full p-3 bg-white rounded-lg dark:bg-gray-700 dark:text-white"
            />
        </View>
    )
}

export default InputBox
