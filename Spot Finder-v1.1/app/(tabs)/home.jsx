import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, StatusBar, Platform } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Black from "../../assets/images/black_location.svg";
import Notification from "../../assets/images/Notification.svg";
import Mic from "../../assets/images/mic.svg";
import Search from "../../assets/images/search.svg";
import Star from "../../assets/images/Star.svg";
import Heart from "../../assets/images/empty_heart.svg";
import HeartFilled from "../../assets/images/filled_heart.svg";
import Car from "../../assets/images/car.svg";
import Clock from "../../assets/images/clock.svg";
import { router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import Dark_Locate from "../../assets/images/dark_locate2.svg";

// Random parking images
const parkingImages = [
    require('../../assets/images/parking1.png'),
    require('../../assets/images/parking2.png'),
    require('../../assets/images/parking3.png'),
    require('../../assets/images/parking4.png'),
    require('../../assets/images/parking5.png'),
];

const Home = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlist2, setWishlist2] = useState([]);
    const [userLocation, setUserLocation] = useState("Your Location");
    const [parkings, setParkings] = useState([]);
    const [imageMap, setImageMap] = useState({});

    useEffect(() => {
        const loadLocation = async () => {
            try {
                const storedLocation = await AsyncStorage.getItem("location");
                if (storedLocation) {
                    const parsed = JSON.parse(storedLocation);
                    setUserLocation(`${parsed.city || "Unknown City"}, ${parsed.country || "Unknown Country"}`);
                }
            } catch (err) {
                console.error("Error loading location:", err);
            }
        };

        const fetchParkings = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/parking_lots/");
                const data = await res.json();
                const imgMap = {};
                data.forEach(p => {
                    imgMap[p._id] = parkingImages[Math.floor(Math.random() * parkingImages.length)];
                });
                setImageMap(imgMap);
                setParkings(data);
            } catch (err) {
                console.error("Failed to fetch parkings:", err);
            }
        };

        loadLocation();
        fetchParkings();
    }, []);

    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleWishlist2 = (id) => {
        setWishlist2(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const details = (id) => {
        router.push({ pathname: '(screens)/parkingDetails', params: { parkingLotId: id } });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle={darkMode ? "light-content" : "dark-content"} />
            <View style={styles.header}>
                <View style={styles.header_content}>
                    <Text style={styles.location}>Location</Text>
                    <View style={styles.header_content_bottom}>
                        {darkMode ? <Dark_Locate /> : <Black />}
                        <Text style={[styles.heading, { color: theme.color }]}>{userLocation}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.notification}>
                    <Notification />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.input_container}>
                    <View style={styles.search}><Search /></View>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.cardbg, color: theme.color }]}
                        placeholderTextColor={darkMode ? "#f6f6f6" : "#505050"}
                        placeholder='Search'
                    />
                    <View style={styles.mic}><Mic /></View>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.row_heading, { color: theme.color }]}>Popular Parking</Text>
                    <Text style={styles.view}>See All</Text>
                </View>

                <ScrollView horizontal={true} style={styles.horizontal_scroll} showsHorizontalScrollIndicator={false}>
                    <View style={styles.popular_container}>
                        {parkings.map((p) => (
                            <TouchableOpacity key={p._id} style={[styles.popular_box, { backgroundColor: theme.cardbg }]} onPress={() => details(p._id)}>
                                <Image source={imageMap[p._id]} style={styles.image} />
                                <View style={styles.top_row}>
                                    <View style={styles.rating_row}>
                                        <Star />
                                        <Text style={styles.rating}>4.9</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => toggleWishlist(p._id)} style={styles.wishlist_container}>
                                        {wishlist.includes(p._id) ? <HeartFilled /> : <Heart />}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.card_body}>
                                    <Text style={styles.parking}>Car Parking</Text>
                                    <View style={styles.name_price}>
                                        <Text style={[styles.name, { color: theme.color }]}>{p.nom}</Text>
                                        <Text style={styles.price}>$5.00 <Text style={styles.time}>/hr</Text></Text>
                                    </View>
                                    <View style={styles.timing_car}>
                                        <View style={styles.timing_row}>
                                            <Clock />
                                            <Text style={[styles.timing, { color: theme.color }]}>{p.capaciteTotal} total</Text>
                                        </View>
                                        <View style={styles.car_row}>
                                            <Car />
                                            <Text style={[styles.car, { color: theme.color }]}>{p.placeDisponibles} spots</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.row}>
                    <Text style={[styles.row_heading, { color: theme.color }]}>Nearby Parking</Text>
                    <Text style={styles.view}>See All</Text>
                </View>

                <View style={styles.stack_container}>
                    {parkings.map((p) => (
                        <TouchableOpacity key={p._id} style={[styles.stack, { backgroundColor: theme.cardbg }]} onPress={() => details(p._id)}>
                            <View style={styles.imageContainer}>
                                <Image source={imageMap[p._id]} style={styles.stack_img} />
                                <TouchableOpacity onPress={() => toggleWishlist2(p._id)} style={styles.wishlist_container2}>
                                    {wishlist2.includes(p._id) ? <HeartFilled /> : <Heart />}
                                </TouchableOpacity>
                            </View>
                            <View style={styles.stack_body}>
                                <View style={styles.stack_body_row}>
                                    <Text style={styles.parking}>Car Parking</Text>
                                    <View style={styles.rating_row}>
                                        <Star />
                                        <Text style={styles.rating}>4.9</Text>
                                    </View>
                                </View>
                                <View style={styles.name_price2}>
                                    <Text style={[styles.name, { color: theme.color }]}>{p.nom}</Text>
                                    <Text style={styles.price}>$5.00 <Text style={styles.time}>/hr</Text></Text>
                                </View>
                                <View style={styles.timing_car2}>
                                    <View style={styles.timing_row}>
                                        <Clock />
                                        <Text style={[styles.timing, { color: theme.color }]}>{p.capaciteTotal} total</Text>
                                    </View>
                                    <View style={styles.car_row}>
                                        <Car />
                                        <Text style={[styles.car, { color: theme.color }]}>{p.placeDisponibles} spots</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'web' ? 20 : 50,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    location: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
        textTransform: 'capitalize',
    },
    heading: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Roboto_700Bold',
        color: '#121212',
    },
    notification: {
        borderRadius: 10,
        backgroundColor: '#FF95AE',
        padding: 10,
    },
    header_content: {
        gap: 5,
    },
    header_content_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input_container: {
        marginVertical: 16,
    },
    input: {
        borderRadius: 12,
        backgroundColor: '#F6F6F6',
        paddingVertical: 14,
        paddingHorizontal: 40,
        fontSize: 14,
    },
    search: {
        position: 'absolute',
        zIndex: 100,
        bottom: 18,
        left: 12,
    },
    mic: {
        position: 'absolute',
        bottom: 18,
        right: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 20,
    },
    row_heading: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
    },
    view: {
        fontSize: 13,
        fontFamily: 'Roboto_500Medium',
        color: '#FF95AE',
    },
    horizontal_scroll: {
        maxHeight: 300,
    },
    popular_container: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    popular_box: {
        width: Platform.OS === 'web' ? '35%' : 220,
        marginRight: 14,
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        padding: 10,
    },
    image: {
        width: '100%',
        height: 140,
        borderRadius: 10,
    },
    top_row: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rating_row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 2,
        paddingHorizontal: 6,
    },
    rating: {
        marginLeft: 4,
        fontSize: 12,
        color: '#121212',
    },
    wishlist_container: {
        padding: 4,
    },
    card_body: {
        marginTop: 12,
    },
    parking: {
        fontSize: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    name_price: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 4,
    },
    name_price2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 6,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#121212',
    },
    price: {
        fontSize: 14,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FF95AE',
    },
    time: {
        fontSize: 12,
        color: '#757575',
    },
    timing_car: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    timing_car2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 6,
    },
    timing_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    car_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    timing: {
        fontSize: 12,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
    },
    car: {
        fontSize: 12,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
    },
    stack_container: {
        gap: 12,
        paddingBottom: 60,
    },
    stack: {
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
    },
    imageContainer: {
        marginRight: 12,
    },
    stack_img: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    wishlist_container2: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    stack_body: {
        flex: 1,
        gap: 5,
    },
    stack_body_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
