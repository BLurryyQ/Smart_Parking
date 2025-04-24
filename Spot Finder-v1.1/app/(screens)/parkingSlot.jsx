import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Button from '../../components/Button/Button';
import { useLocalSearchParams, router } from "expo-router";
import Left from "../../assets/images/slot_left.png";
import Dark_Left from "../../assets/images/dark_slot_left.png";
import Car from "../../assets/images/car8.png";
import Divider from "../../assets/images/slot_divider.svg";
import ThemeContext from '../../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ParkingSlot = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [spaces, setSpaces] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const info = await AsyncStorage.getItem('reservationInfo');
            const { parkingLotId } = JSON.parse(info);
            const res = await fetch(`http://127.0.0.1:8000/api/parking_spaces/${parkingLotId}/`);
            const data = await res.json();
            setSpaces(data);
        };
        fetchData();
    }, []);

    const handleSlotPress = (id, status) => {
        if (status !== 'occupe') {
            setSelectedSlot(prev => (prev === id ? null : id));
        }
    };

    const back = () => router.back();

    const review = async () => {
        if (!selectedSlot) return alert("Select a slot");

        const reservationInfo = await AsyncStorage.getItem('reservationInfo');
        const parsed = JSON.parse(reservationInfo);

        await AsyncStorage.setItem('reservationInfo', JSON.stringify({
            ...parsed,
            spaceId: selectedSlot
        }));

        router.push({
            pathname: '(screens)/review',
            params: {
                ...parsed,
                spaceId: selectedSlot
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={back}>
                    {darkMode ? <Dark_back /> : <Back />}
                </TouchableOpacity>
                <Text style={[styles.heading, { color: theme.color }]}>Select Parking Slot</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
                <View style={styles.column}>
                    <View style={styles.parking_slot}>
                        <Image source={darkMode ? Dark_Left : Left} style={styles.slot_left} />
                        <View style={styles.slots}>
                            <View style={styles.row1}>
                                <View style={styles.column1}>
                                    {spaces.filter((_, i) => i % 2 === 0).map(space => (
                                        <TouchableOpacity
                                            key={space.id}
                                            style={[
                                                styles.park,
                                                {
                                                    backgroundColor: theme.cardbg,
                                                    ...(selectedSlot === space.id && styles.activePark),
                                                }
                                            ]}
                                            onPress={() => handleSlotPress(space.id, space.status)}
                                            disabled={space.status === 'occupe'}
                                        >
                                            {space.status === 'occupe'
                                                ? <Image source={Car} style={styles.car} />
                                                : <Text style={[styles.parkingText, selectedSlot === space.id && styles.activeParkingText]}>{space.numero}</Text>
                                            }
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.column2}>
                                    {spaces.filter((_, i) => i % 2 !== 0).map(space => (
                                        <TouchableOpacity
                                            key={space.id}
                                            style={[
                                                styles.park2,
                                                {
                                                    backgroundColor: theme.cardbg,
                                                    ...(selectedSlot === space.id && styles.activePark),
                                                }
                                            ]}
                                            onPress={() => handleSlotPress(space.id, space.status)}
                                            disabled={space.status === 'occupe'}
                                        >
                                            {space.status === 'occupe'
                                                ? <Image source={Car} style={styles.car} />
                                                : <Text style={[styles.parkingText, selectedSlot === space.id && styles.activeParkingText]}>{space.numero}</Text>
                                            }
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.divider}><Divider /></View>
                        </View>
                    </View>
                    <View style={styles.button_box}>
                        <Button buttonText="Continue" onPress={review} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ParkingSlot;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'web' ? 20 : 50,
        paddingHorizontal: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    heading: {
        fontSize: 24,
        lineHeight: 34,
        fontFamily: 'Montserrat_700Bold',
        textTransform: 'capitalize',
    },
    scrolls: {
        flexGrow: 1,
        flex: 1,
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
    },
    parking_slot: {
        position: 'relative',
        marginBottom: 30,
        width: '100%',
    },
    slot_left: {
        width: '28%',
        height: 600,
        resizeMode: 'contain',
    },
    slots: {
        position: 'absolute',
        right: -10,
        top: 70,
        width: '69%',
    },
    button_box: {
        marginBottom: '8%',
        marginTop: 20,
    },
    row1: {
        flexDirection: 'row',
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    column1: {
        flex: 1,
    },
    column2: {
        flex: 1,
    },
    park: {
        marginVertical: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
        minHeight: 65,
        maxHeight: 65,
        borderTopColor: '#757575',
        borderTopWidth: 1,
        borderBottomColor: '#757575',
        borderBottomWidth: 1,
    },
    park2: {
        marginVertical: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
        minHeight: 65,
        maxHeight: 65,
        borderTopColor: '#757575',
        borderTopWidth: 1,
        borderBottomColor: '#757575',
        borderBottomWidth: 1,
        borderLeftColor: '#757575',
        borderLeftWidth: 1,
    },
    activePark: {
        backgroundColor: '#FF85A2',
    },
    parkingText: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Montserrat_700Bold',
        color: '#000',
    },
    activeParkingText: {
        color: '#ffffff',
    },
    car: {
    },
    divider: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 25,
        maxWidth: '70%',
    },
});