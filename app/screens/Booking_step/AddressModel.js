import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CustomCheckbox from '../../components/Forms/CheckBox';
import Toast from 'react-native-toast-message';
export default function AddressModel({ isOpen, onClose, type,onSelectAddress  }) {
    const [addressData, setAddressData] = useState({
        StreetAddress: '',
        City: '',
        Landmark: '',
        Pincode: '',
        state: '',
        AddressType: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const [address, setAllAddress] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState(null);

    const handleInputChange = (field, value) => {
        setAddressData((prevState) => ({ ...prevState, [field]: value }));
        setIsEditing(true);
    };

    const handleGetAddress = async () => {
        setLoading(true);
        console.log(token)
        try {
            const { data } = await axios.get('http://192.168.1.5:7000/api/v1/pet/get-address', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Address",data)
            if (data) {
                setAllAddress(data);
            }

        } catch (error) {
            console.error(error);
            setLoading(false);
            setError('Error fetching address');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetAddress();
    }, [isOpen]);

    const handleAddAddress = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post('http://192.168.1.5:7000/api/v1/pet/add-address', addressData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoading(false);
            Toast.show({
                type: 'success',

                text2: 'Address added successfully!'
            });
            setSuccess('Address added successfully!');
            onClose();

        } catch (error) {
            console.error(error);
            setLoading(false);
            Toast.show({

                type: 'error',
                text2: error?.response?.data?.message
            });
            setError('Error adding address');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveAddress = async (id) => {
        try {
            const { data } = await axios.delete(`http://192.168.1.5:7000/api/v1/pet/remove-address/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Toast.show({

                type: 'success',
                text2: 'Address Removed Successfull'
            });
            console.log(data)
            handleGetAddress()
        } catch (error) {
            console.log(error)
        }
    }
    const handleCheckboxToggle = (id) => {
        setSelectedAddresses(selectedAddresses === id ? null : id);
        onSelectAddress(id)
        onClose()
    };

    const handleSubmit = () => {
        handleAddAddress();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isOpen}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        <Text style={styles.modalHeader}>
                            {type === 'edit' ? 'Edit Address' : 'Add New Address'}
                        </Text>

                        {success && <Text style={styles.successText}>{success}</Text>}

                        {address.length > 0 && address.map((item) => (
                            <View className="flex flex-row justify-between items-center">
                                <CustomCheckbox
                                    key={item._id}
                                    label={`${item.streetAddress}, ${item.city}, ${item.pincode}, ${item.state}`}
                                    checked={selectedAddresses === item._id} // Check if the current item is the selected one
                                    onChange={() => handleCheckboxToggle(item._id)}
                                />
                                <TouchableOpacity onPress={() => handleRemoveAddress(item._id)}>
                                    <Text>❌</Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <TextInput
                            style={styles.input}
                            placeholder="Street Address"
                            value={addressData.StreetAddress}
                            onChangeText={(value) => handleInputChange('StreetAddress', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={addressData.City}
                            onChangeText={(value) => handleInputChange('City', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Landmark"
                            value={addressData.Landmark}
                            onChangeText={(value) => handleInputChange('Landmark', value)}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Pincode"
                            value={addressData.Pincode}
                            onChangeText={(value) => handleInputChange('Pincode', value)}
                            keyboardType="numeric"
                            maxLength={6}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="State"
                            value={addressData.state}
                            onChangeText={(value) => handleInputChange('state', value)}
                        />

                        <View style={styles.addressTypeContainer}>
                            <Text style={styles.addressTypeLabel}>Address Type:</Text>
                            <TouchableOpacity onPress={() => handleInputChange('AddressType', 'Home')}>
                                <Text style={styles.addressTypeOption}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleInputChange('AddressType', 'Office')}>
                                <Text style={styles.addressTypeOption}>Office</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleInputChange('AddressType', 'Other')}>
                                <Text style={styles.addressTypeOption}>Other</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
                            <Text style={styles.buttonText}>
                                {loading ? 'Please Wait' : 'Add Address'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#6B7280',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    successText: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
    addressTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    addressTypeLabel: {
        fontWeight: 'bold',
    },
    addressTypeOption: {
        padding: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 5,
    },
});

