import { StyleSheet, Text, View, Image, Platform, Alert } from 'react-native';
import React, { useContext, useEffect } from 'react';
import Locations from "../../assets/images/location.png";
import Button from '../../components/Button/Button';
import { router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Location = () => {
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const checkStoredLocation = async () => {
            const stored = await AsyncStorage.getItem('location');
            if (stored) {
                router.replace('home');
            }
        };
        checkStoredLocation();
    }, []);

    const handleSuccess = async (locationData) => {
        try {
            await AsyncStorage.setItem('location', JSON.stringify(locationData));
            console.log("Saved location info:", locationData);
            router.replace('home');
        } catch (err) {
            console.error("Error saving location:", err);
        }
    };

    const getLocationByIP = async () => {
        try {
            const response = await fetch('https://ipinfo.io/json?token=d93124316ec401');
            const data = await response.json();
            const [lat, lon] = data.loc.split(',');

            const locationData = {
                city: data.city,
                country: data.country,
                region: data.region,
                ip: data.ip,
                org: data.org,
                timezone: data.timezone,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
            };

            handleSuccess(locationData);
        } catch (err) {
            console.error("IP Location error:", err);
            Alert.alert("Location Error", "Could not determine your location automatically.");
        }
    };

    const handleAllowLocation = () => {
        if (!navigator.geolocation) {
            console.warn("Geolocation not supported, using IP fallback");
            getLocationByIP();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Currently using IP API for full location data
                getLocationByIP();
            },
            (error) => {
                console.warn("Geolocation error:", error);
                getLocationByIP();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 1000,
            }
        );
    };

    const manual = () => {
        router.push('manualLocation');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <Image source={Locations} alt='location' style={styles.image} />
                <Text style={[styles.content_heading, { color: theme.color }]}>What is Your Location</Text>
                <Text style={styles.content_text}>We need to know your location to suggest nearby services.</Text>
            </View>
            <View style={styles.button_container}>
                <Button buttonText="Allow Location Access" onPress={handleAllowLocation} />
                <Button
                    buttonText="Enter Location Manually"
                    textColor="#FF95AE"
                    borderColor="#FF95AE"
                    backgroundColor="transparent"
                    onPress={manual}
                />
            </View>
        </View>
    );
};

export default Location;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        gap: 30,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 130,
        height: 130,
    },
    content_heading: {
        fontSize: 26,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
        textAlign: 'center',
        marginTop: 50,
    },
    content_text: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
    },
    button_container: {
        gap: 15,
        marginBottom: Platform.OS === 'web' ? 10 : '10%',
    },
});