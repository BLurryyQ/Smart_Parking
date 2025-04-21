import {View, Text, TextInput, StyleSheet, Platform, TouchableOpacity, ScrollView, Alert} from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import Back from '../../assets/images/Back.svg';
import Dark_back from '../../assets/images/White_back.svg';

const AddVehicle = () => {
    const { theme, darkMode } = useContext(ThemeContext);

    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        brand: '',
        model: '',
        plateNumber: '',
        type: '',
    });

    const [open, setOpen] = useState(false);
    const [vehicleTypes, setVehicleTypes] = useState([
        { label: 'SUV', value: 'SUV' },
        { label: 'Sedan', value: 'Sedan' },
        { label: 'Coupe', value: 'Coupe' },
        { label: 'Hatchback', value: 'Hatchback' },
        { label: 'Convertible', value: 'Convertible' },
        { label: 'Van', value: 'Van' },
        { label: 'Pickup Truck', value: 'Pickup Truck' },
    ]);

    useEffect(() => {
        AsyncStorage.getItem('userId').then(id => {
            if (id) setUserId(id);
        });
    }, []);

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!form.brand || !form.model || !form.plateNumber || !form.type) {
            setError('Please fill all fields.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/vehicles/add/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, userId }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Alert.alert('Success', 'Vehicle added successfully.');
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.push('(screens)/vehicle');
                }
            } else {
                setError(data.error || 'Failed to add vehicle.');
            }
        } catch (error) {
            setError('Something went wrong. Please try again.');
        }
    };

    const goBack = () => {
        if (router.canGoBack()) router.back();
        else router.push('(screens)/vehicle');
    };

    const recognizePlate = async (imageUri) => {
        try {
            const filename = imageUri.split('/').pop();
            const ext = filename.split('.').pop().toLowerCase();
            const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;

            const formData = new FormData();

            if (Platform.OS === 'web') {
                const res = await fetch(imageUri);
                const blob = await res.blob();
                formData.append('image', new File([blob], filename, { type: mimeType }));
            } else {
                formData.append('image', {
                    uri: imageUri,
                    name: filename,
                    type: mimeType,
                });
            }

            const response = await fetch('http://127.0.0.1:8000/api/recognize-plate/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success && data.plate) {
                const { number, letter, region } = data.plate;
                setForm(prev => ({ ...prev, plateNumber: `${number}-${letter}-${region}` }));
            } else {
                alert("Could not extract plate number");
            }
        } catch (error) {
            alert("Failed to recognize plate. Check server or image format.");
        }
    };

    const handleTakePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) return;

        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, mediaTypes: ImagePicker.MediaTypeOptions.All });
        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            await recognizePlate(uri);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.backWrapper}>
                <TouchableOpacity onPress={goBack}>
                    {darkMode ? <Dark_back /> : <Back />}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollView}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: theme.color }]}>Add Vehicle</Text>
                    <Text style={[styles.subtitle, { color: theme.color }]}>Add your vehicle to continue booking and enjoy personalized features.</Text>
                </View>

                <View style={styles.form_container}>
                    <TextInput
                        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
                        placeholder="Brand"
                        placeholderTextColor="#999"
                        value={form.brand}
                        onChangeText={(text) => handleChange('brand', text)}
                    />
                    <TextInput
                        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
                        placeholder="Model"
                        placeholderTextColor="#999"
                        value={form.model}
                        onChangeText={(text) => handleChange('model', text)}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <TextInput
                            style={[styles.input, { flex: 1, color: theme.color, borderColor: theme.color }]}
                            placeholder="Plate Number"
                            placeholderTextColor="#999"
                            value={form.plateNumber}
                            onChangeText={(text) => handleChange('plateNumber', text)}
                        />
                        <TouchableOpacity onPress={handleTakePhoto}>
                            <Ionicons name="camera-outline" size={28} color={theme.color} />
                        </TouchableOpacity>
                    </View>

                    <DropDownPicker
                        open={open}
                        value={form.type}
                        items={vehicleTypes}
                        setOpen={setOpen}
                        setValue={(cb) => handleChange('type', cb())}
                        setItems={setVehicleTypes}
                        placeholder="Select Type"
                        style={[styles.dropdown, { borderColor: theme.color }]}
                        dropDownContainerStyle={{ borderColor: theme.color }}
                        textStyle={{
                            color: theme.color,
                            fontFamily: 'Montserrat_400Regular',
                            fontSize: 16,
                        }}
                    />

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    <View style={styles.button_box}>
                        <Button buttonText="Add Vehicle" onPress={handleSubmit} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default AddVehicle;

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Platform.OS === 'web' ? 20 : 50, paddingHorizontal: 20 },
    form_container: { marginTop: 30, marginBottom: 20 },
    input: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16, fontFamily: 'Montserrat_400Regular' },
    dropdown: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, marginBottom: 15, fontSize: 16, minHeight: 50 },
    errorText: { color: '#FF3B30', fontSize: 14, fontFamily: 'Montserrat_400Regular', textAlign: 'center', marginBottom: 10 },
    button_box: { marginTop: 10, marginBottom: '10%' },
    backWrapper: { position: 'absolute', top: Platform.OS === 'web' ? 20 : 50, left: 20, zIndex: 10 },
    scrollView: { flexGrow: 1, justifyContent: 'flex-start', paddingTop: Platform.OS === 'web' ? 120 : 100, paddingHorizontal: 20, paddingBottom: 30 },
    titleContainer: { alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
    title: { fontSize: 28, fontFamily: 'Montserrat_700Bold', marginBottom: 8 },
    subtitle: { fontSize: 14, textAlign: 'center', fontFamily: 'Montserrat_400Regular', color: '#999' },
});