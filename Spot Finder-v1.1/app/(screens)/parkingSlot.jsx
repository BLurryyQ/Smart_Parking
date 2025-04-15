import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useContext, useState } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Button from '../../components/Button/Button';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { router } from "expo-router";
import Left from "../../assets/images/slot_left.png";
import Dark_Left from "../../assets/images/dark_slot_left.png";
import { parking_slot_data, parking_slot_data2, parking_slot_data3, parking_slot_data4 } from '../../Data/Data';
import Divider from "../../assets/images/slot_divider.svg";
import ThemeContext from '../../theme/ThemeContext';

const ParkingSlot = () => {
    const { theme, darkMode, toggleTheme } = useContext(ThemeContext);
    const [activeSlot, setActiveSlot] = useState(null);
    const [activeSlot2, setActiveSlot2] = useState(null);
    const [activeSlot3, setActiveSlot3] = useState(null);
    const [activeSlot4, setActiveSlot4] = useState(null);

    const review = () => {
        router.push('(screens)/review');
    };

    const handleSlotPress = (id) => {
        setActiveSlot(prevId => prevId === id ? null : id);
    };

    const handleSlotPress2 = (id) => {
        setActiveSlot2(prevId => prevId === id ? null : id);
    };

    const handleSlotPress3 = (id) => {
        setActiveSlot3(prevId => prevId === id ? null : id);
    };

    const handleSlotPress4 = (id) => {
        setActiveSlot4(prevId => prevId === id ? null : id);
    };

    const back = () => {
        if (router.canGoBack?.()) {
            router.back();
        } else {
            router.push('(screens)/vehicle');
        }
    };

    return (
        <View style={[styles.container, {backgroundColor:theme.background}]}>
            <View style={styles.header}>
            <TouchableOpacity onPress={back}>
       {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
                <Text style={[styles.heading, {color:theme.color}]}>Select Parking Slot</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
               <View style={styles.column}>
                <View style={styles.parking_slot}>
                  { darkMode? <Image source={Dark_Left} style={styles.slot_left} alt='image' /> :  <Image source={Left} style={styles.slot_left} alt='image' />}
                    <View style={styles.slots}>
                        <View style={styles.row1}>
                            <View style={styles.column1}>
                                {parking_slot_data.map((d) => (
                                    <TouchableOpacity
                                        style={[
                                            [styles.park, {backgroundColor:theme.cardbg}],
                                            typeof d.parking === 'string' && d.id === activeSlot && styles.activePark
                                        ]}
                                        key={d.id}
                                        onPress={() => handleSlotPress(d.id)}
                                    >
                                        {typeof d.parking === 'string' ? (
                                            <Text style={[
                                                styles.parkingText,
                                                d.id === activeSlot && styles.activeParkingText
                                            ]}>
                                                {d.parking}
                                            </Text>
                                        ) : (
                                            <Image source={d.parking} style={styles.car} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.column2}>
                                {parking_slot_data2.map((d) => (
                                    <TouchableOpacity
                                        style={[
                                            [styles.park2, {backgroundColor:theme.cardbg}],
                                            typeof d.parking === 'string' && d.id === activeSlot2 && styles.activePark
                                        ]}
                                        key={d.id}
                                        onPress={() => handleSlotPress2(d.id)}
                                    >
                                        {typeof d.parking === 'string' ? (
                                            <Text style={[
                                                styles.parkingText,
                                                d.id === activeSlot2 && styles.activeParkingText
                                            ]}>
                                                {d.parking}
                                            </Text>
                                        ) : (
                                            <Image source={d.parking} style={styles.car} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.divider}>
                            <Divider />
                        </View>
                        <View style={styles.row1}>
                            <View style={styles.column1}>
                                {parking_slot_data3.map((d) => (
                                    <TouchableOpacity
                                        style={[
                                           [ styles.park, {backgroundColor:theme.cardbg}],
                                            typeof d.parking === 'string' && d.id === activeSlot3 && styles.activePark
                                        ]}
                                        key={d.id}
                                        onPress={() => handleSlotPress3(d.id)}
                                    >
                                        {typeof d.parking === 'string' ? (
                                            <Text style={[
                                                styles.parkingText,
                                                d.id === activeSlot3 && styles.activeParkingText
                                            ]}>
                                                {d.parking}
                                            </Text>
                                        ) : (
                                            <Image source={d.parking} style={styles.car} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <View style={styles.column2}>
                                {parking_slot_data4.map((d) => (
                                    <TouchableOpacity
                                        style={[
                                          [  styles.park2, {backgroundColor:theme.cardbg}],
                                            typeof d.parking === 'string' && d.id === activeSlot4 && styles.activePark
                                        ]}
                                        key={d.id}
                                        onPress={() => handleSlotPress4(d.id)}
                                    >
                                        {typeof d.parking === 'string' ? (
                                            <Text style={[
                                                styles.parkingText,
                                                d.id === activeSlot4 && styles.activeParkingText
                                            ]}>
                                                {d.parking}
                                            </Text>
                                        ) : (
                                            <Image source={d.parking} style={styles.car} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
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
        paddingTop:Platform.OS === 'web'? 20 : 50,
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
        color: '#121212',
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
