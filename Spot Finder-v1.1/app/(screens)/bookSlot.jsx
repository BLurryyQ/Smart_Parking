import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Back from "../../assets/images/White_back.svg";
import Star from "../../assets/images/Star.svg";
import Share from "../../assets/images/Locate.svg";
import Dark_back from "../../assets/images/White_back.svg";
import CustomCalendar from '../../components/CustomCalendar/CustomCalendar';
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();

    // Round up to the next half hour
    const minutes = now.getMinutes();
    if (minutes > 0 && minutes <= 30) {
        now.setMinutes(30);
    } else {
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
    }
    now.setSeconds(0);
    now.setMilliseconds(0);

    for (let i = 0; i < 10; i++) {
        const slot = new Date(now.getTime() + i * 30 * 60 * 1000);
        const hour = slot.getHours();
        const minute = slot.getMinutes();
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const formatted = `${formattedHour}:${formattedMinute} ${period}`;
        slots.push({ id: i, time: formatted, full: slot });
    }

    return slots;
};

const BookSlot = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const { userId, parkingLotId } = useLocalSearchParams();
    const timeSlots = generateTimeSlots();
    const [activetab, setActivetab] = useState(timeSlots[0].id);
    const [activetab2, setActivetab2] = useState(timeSlots[1]?.id ?? timeSlots[0].id);
    const [selectedDate, setSelectedDate] = useState(null);
    const [parkingLot, setParkingLot] = useState(null);
    const [loading, setLoading] = useState(true);

    const set_tab = (id) => setActivetab(id);
    const set_tab2 = (id) => setActivetab2(id);

    const arrivalTime = timeSlots.find(t => t.id === activetab)?.time || '';
    const exitTime = timeSlots.find(t => t.id === activetab2)?.time || '';

    const dateDebut = new Date(`${selectedDate}T${arrivalTime.split(' ')[0]}:00`);
    const dateFin = new Date(`${selectedDate}T${exitTime.split(' ')[0]}:00`);

    const vehicle = async () => {
        const now = new Date();

        // fallback to today if not selected
        const formattedDate = selectedDate || now.toISOString().split('T')[0];

        // handle default fallback times
        const defaultStart = new Date(now);
        const defaultEnd = new Date(now.getTime() + 30 * 60 * 1000);

        const arrivalTimeRaw = timeSlots.find(t => t.id === activetab)?.time;
        const exitTimeRaw = timeSlots.find(t => t.id === activetab2)?.time;

        const arrivalTime = arrivalTimeRaw ? arrivalTimeRaw.split(" ")[0] : defaultStart.toTimeString().slice(0, 5); // "HH:MM"
        const exitTime = exitTimeRaw ? exitTimeRaw.split(" ")[0] : defaultEnd.toTimeString().slice(0, 5); // "HH:MM"

        const dateDebut = new Date(`${formattedDate}T${arrivalTime}:00`);
        const dateFin = new Date(`${formattedDate}T${exitTime}:00`);

        if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) {
            alert("Invalid date or time. Please try again.");
            return;
        }

        const userData = await AsyncStorage.getItem('user');
        const userId = JSON.parse(userData)._id;

        const payload = {
            userId,
            parkingLotId,
            dateDebut: dateDebut.toISOString(),
            dateFin: dateFin.toISOString(),
        };

        await AsyncStorage.setItem('reservationInfo', JSON.stringify(payload));
        router.push({ pathname: '(screens)/vehicle' });
    };

    const back = () => {
        router.canGoBack?.() ? router.back() : router.push('home');
    };

    useEffect(() => {
        const fetchParkingLot = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/parking_lots/${parkingLotId}/`);
                const data = await res.json();
                setParkingLot(data);
            } catch (err) {
                console.error("Failed to fetch parking lot details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchParkingLot();
    }, [parkingLotId]);

    if (loading) {
        return (
            <View style={[styles.details_page, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={styles.details_page}>
            <Image source={require('../../assets/images/parking1.png')} alt="image" style={styles.image} />
            <View style={styles.header}>
                <TouchableOpacity onPress={back}>
                    {darkMode ? <Dark_back /> : <Back />}
                </TouchableOpacity>
            </View>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.review_row}>
                        <Text style={styles.parking}>car parking</Text>
                        <View style={styles.rating_row}>
                            <Star />
                            <Text style={styles.review}>4.9 (300 reviews)</Text>
                        </View>
                    </View>

                    <View style={styles.title_row}>
                        <Text style={[styles.title, { color: theme.color }]}>{parkingLot.nom}</Text>
                        <Share />
                    </View>
                    <Text style={styles.title_text}>
                        {parkingLot.localisation?.rue}, {parkingLot.localisation?.ville}, {parkingLot.localisation?.pays}
                    </Text>

                    <Text style={styles.book_title}>Book A Slot</Text>
                    <Text style={[styles.content_heading, { color: theme.color }]}>Day</Text>
                    <CustomCalendar onDateChange={(date) => setSelectedDate(date)} />

                    <Text style={[styles.content_heading, { color: theme.color }]}>Arriving Time</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.time_container}>
                            {timeSlots.map((d) => (
                                <TouchableOpacity
                                    key={d.id}
                                    style={[styles.tab, activetab === d.id && styles.activetab]}
                                    onPress={() => set_tab(d.id)}
                                >
                                    <Text style={[styles.time, activetab === d.id && styles.activetime]}>{d.time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text style={[styles.content_heading, { color: theme.color }]}>Exit Time</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.time_container}>
                            {timeSlots.map((d) => (
                                <TouchableOpacity
                                    key={d.id}
                                    style={[styles.tab, activetab2 === d.id && styles.activetab]}
                                    onPress={() => set_tab2(d.id)}
                                >
                                    <Text style={[styles.time, activetab2 === d.id && styles.activetime]}>{d.time}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.button_box}>
                        <Button buttonText="Continue" onPress={vehicle} />
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default BookSlot;

const styles = StyleSheet.create({
    details_page: {
        flex: 1,
    },
    image: {
        width: '100%',
        borderRadius: 10,
        height:Platform.OS === 'web'? 250 : 300,
    },
    header: {
        position: 'absolute',
        left: 20,
        top: 50,
    },
    container: {
        flex: 1,
        paddingTop: 24,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 50,
    },
    review_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    parking: {
        fontSize: 10,
        lineHeight: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#007BFF',
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxWidth: 85,
        marginVertical: 8,
    },
    rating_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    review: {
        fontSize: 14,
        lineHeight: 17,
        fontFamily: 'Roboto_400Regular',
        color: '#BABABA',
    },
    title_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 5,
    },
    title: {
        fontSize: 22,
        lineHeight: 32,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        textTransform: 'capitalize',
    },
    title_text: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
    },
    book_title: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Montserrat_500Medium',
        color: '#757575',
        marginTop: 24,
        paddingBottom: 16,
    },
    content_heading: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    time_container: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
        marginBottom: 20,
    },
    tab: {
        borderColor: '#BABABA',
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 4,
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activetab: {
        backgroundColor: '#FF95AE',
    },
    time: {
        fontSize: 12,
        lineHeight: 24,
        fontFamily: 'Montserrat_500Medium',
        color: '#757575',
    },
    activetime: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Montserrat_700Bold',
        color: '#ffffff',
    },
    button_box: {
        paddingTop: 20,
    }
});