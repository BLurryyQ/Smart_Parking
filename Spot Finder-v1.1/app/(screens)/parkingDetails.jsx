import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Back from "../../assets/images/White_back.svg";
import Star from "../../assets/images/Star.svg";
import Car from "../../assets/images/car.svg";
import Clock from "../../assets/images/clock.svg";
import Share from "../../assets/images/Locate.svg";
import Profiles from "../../assets/images/profile_img.png";
import Comment from "../../assets/images/comment.svg";
import Call from "../../assets/images/call.svg";
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import { tab_heading } from '../../Data/Data';

const ParkingDetails = () => {
    const { parkingLotId } = useLocalSearchParams();
    const { theme, darkMode } = useContext(ThemeContext);
    const [activeHeading, setActiveHeading] = useState(tab_heading[0].id);
    const [parkingLot, setParkingLot] = useState(null);
    const [loading, setLoading] = useState(true);

    const click = (id) => setActiveHeading(id);
    const slot = () => router.push('(screens)/bookSlot');
    const back = () => router.canGoBack?.() ? router.back() : router.push('home');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/parking_lots/${parkingLotId}/`);
                const data = await res.json();
                setParkingLot(data);
            } catch (error) {
                console.error("Failed to fetch parking lot details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [parkingLotId]);

    if (loading) {
        return (
            <View style={[styles.details_page, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!parkingLot) {
        return (
            <View style={[styles.details_page, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.color }}>Parking Lot not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.details_page}>
            <Image source={require('../../assets/images/parking1.png')} style={styles.image} />
            <TouchableOpacity onPress={back} style={styles.header}>
                <Back />
            </TouchableOpacity>

            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.column}>
                        <View style={styles.review_row}>
                            <Text style={styles.parking}>Car Parking</Text>
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

                        <View style={styles.heading_container}>
                            {tab_heading.map((d) => (
                                <TouchableOpacity
                                    key={d.id}
                                    style={[
                                        styles.heading_box,
                                        activeHeading === d.id && styles.active_heading_box,
                                    ]}
                                    onPress={() => click(d.id)}
                                >
                                    <Text
                                        style={[
                                            styles.head_text,
                                            activeHeading === d.id && styles.active_head_text,
                                        ]}
                                    >
                                        {d.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.timing_car}>
                            <View style={styles.timing_row}>
                                <Clock />
                                <Text style={[styles.timing, { color: theme.color }]}>1 hour</Text>
                            </View>
                            <View style={styles.car_row}>
                                <Car />
                                <Text style={[styles.car, { color: theme.color }]}>
                                    {parkingLot.placeDisponibles} Spots
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.description, { color: theme.color }]}>Description</Text>
                        <Text style={styles.description_text}>
                            Welcome to {parkingLot.nom}, the ultimate destination for secure, convenient, and affordable car parking.
                            Whether you need a spot for a short or long stay,
                            <Text style={styles.read}> Read more..</Text>
                        </Text>

                        <Text style={[styles.description, { color: theme.color }]}>Operated By</Text>
                        <View style={styles.profile_row}>
                            <View style={styles.profile_left}>
                                <Image style={styles.profile} source={Profiles} />
                                <View style={styles.name_role}>
                                    <Text style={[styles.name, { color: theme.color }]}>{parkingLot.owner || "John Mac"}</Text>
                                    <Text style={styles.role}>Operator</Text>
                                </View>
                            </View>
                            <View style={styles.icons_row}>
                                <Comment />
                                <Call />
                            </View>
                        </View>

                        <View style={styles.price_row}>
                            <View>
                                <Text style={[styles.price_title, { color: theme.color }]}>Total Price</Text>
                                <Text style={styles.price}>$5.00 <Text style={styles.hour}>/hr</Text></Text>
                            </View>
                            <Button buttonText="Book Slot" onPress={slot} />
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default ParkingDetails;

const styles = StyleSheet.create({
    details_page: {
        flex: 1,
    },
    scrollViewContent: {
        flex: 1,
        flexGrow: 1,
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
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
        paddingHorizontal: 20,
        paddingTop: 25,
        flex: 1,
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
    heading_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        width: '100%',
        paddingHorizontal: 20,
    },
    heading_box: {
        borderBottomColor: '#474747',
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: '38%',
    },
    active_heading_box: {
        borderBottomColor: '#007BFF',
        borderBottomWidth: 5,
        marginBottom: 3,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    head_text: {
        fontSize: 14,
        lineHeight: 24,
        color: '#474747',
        fontFamily: 'Montserrat_700Bold',
        paddingHorizontal: 25,
        paddingBottom: 10,
    },
    active_head_text: {
        color: '#007BFF',
    },
    timing_car: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8,
    },
    timing_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    car_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    timing: {
        fontSize: 12,
        lineHeight: 22,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
    },
    car: {
        fontSize: 12,
        lineHeight: 22,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
    },
    description: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#121212',
        textTransform: 'capitalize',
        marginTop: 26,
        marginBottom: 16,
    },
    description_text: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
    },
    read: {
        color: '#FF95AE',
    },
    profile_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profile_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    name_role: {
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#121212',
    },
    role: {
        fontSize: 12,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
    },
    icons_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    price_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8%',
        marginTop: 30,
    },
    price_content: {

    },
    price_title: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    price: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Roboto_700Bold',
        color: '#007BFF',
    },
    hour: {
        color: '#757575',
    }
});
