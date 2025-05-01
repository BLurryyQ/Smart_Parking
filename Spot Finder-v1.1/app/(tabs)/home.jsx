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
import Cars from '../../assets/images/Cars.svg';
import { router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import Dark_Locate from "../../assets/images/dark_locate2.svg";
import HomeSkeleton from '../../components/Skeleton/HomeSkeleton';

const parkingImages = [
    require('../../assets/images/parking1.png'),
    require('../../assets/images/parking2.png'),
    require('../../assets/images/parking3.png'),
    require('../../assets/images/parking4.png'),
    require('../../assets/images/parking5.png'),
];

const FAVORITES_KEY = 'favorite_parkings';

const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


const Home = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [wishlist, setWishlist] = useState([]);
    const [userLocation, setUserLocation] = useState("Your Location");
    const [parkings, setParkings] = useState([]);
    const [imageMap, setImageMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [userCoords, setUserCoords] = useState(null);


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const storedLocation = await AsyncStorage.getItem("location");
                if (storedLocation) {
                    const parsed = JSON.parse(storedLocation);
                    setUserLocation(`${parsed.city || "Unknown City"}, ${parsed.country || "Unknown Country"}`);
                    setUserCoords({ lat: parsed.latitude, lon: parsed.longitude });
                }

                const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
                if (storedFavorites) {
                    setWishlist(JSON.parse(storedFavorites));
                }
            } catch (err) {
                console.error("Initialization error:", err);
            }

            try {
                setLoading(true);
                const res = await fetch("http://127.0.0.1:8000/api/parking_lots/");
                const data = await res.json();

                const shuffledImages = [...parkingImages].sort(() => 0.5 - Math.random());
                const imgMap = {};
                let imageIndex = 0;

                data.forEach((p) => {
                    imgMap[p._id] = shuffledImages[imageIndex];
                    imageIndex = (imageIndex + 1) % shuffledImages.length;
                });

                setImageMap(imgMap);
                setParkings(data);
            } catch (err) {
                console.error("Failed to fetch parkings:", err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const toggleWishlist = async (id) => {
        const updated = wishlist.includes(id)
            ? wishlist.filter(i => i !== id)
            : [...wishlist, id];

        setWishlist(updated);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
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

            {loading ? <HomeSkeleton count={3} /> : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.input_container}>
                        <View style={styles.search}>
                            <Search width={20} height={20} />
                        </View>
                        <TextInput
                            style={[styles.input, { backgroundColor: 'transparent', color: theme.color }]}
                            placeholderTextColor={darkMode ? "#ccc" : "#757575"}
                            placeholder='Search'
                        />
                        <View style={styles.mic}>
                            <Mic width={20} height={20} />
                        </View>
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
                                            <Text style={styles.price}>5.00 MAD <Text style={styles.time}>/hr</Text></Text>
                                        </View>
                                        <View style={styles.timing_car}>
                                            <View style={styles.timing_row}>
                                                <Cars />
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
                        {[...parkings]
                            .filter(p => p.localisation?.coordinates)
                            .sort((a, b) => {
                                if (!userCoords) return 0;
                                const [lonA, latA] = a.localisation.coordinates;
                                const [lonB, latB] = b.localisation.coordinates;
                                const distA = haversine(userCoords.lat, userCoords.lon, latA, lonA);
                                const distB = haversine(userCoords.lat, userCoords.lon, latB, lonB);
                                return distA - distB;
                            })
                            .map((p) => (
                                <TouchableOpacity key={p._id} style={[styles.stack, { backgroundColor: theme.cardbg }]} onPress={() => details(p._id)}>
                                    <View style={styles.imageContainer}>
                                        <Image source={imageMap[p._id]} style={styles.stack_img} />
                                        <TouchableOpacity onPress={() => toggleWishlist(p._id)} style={styles.wishlist_container2}>
                                            {wishlist.includes(p._id) ? <HeartFilled /> : <Heart />}
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
                                            <Text style={styles.price}>5.00 MAD <Text style={styles.time}>/hr</Text></Text>
                                        </View>
                                        <View style={styles.timing_car2}>
                                            <View style={styles.timing_row}>
                                                <Cars />
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
            )}
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'web' ? 10 : 14,
        marginVertical: 16,
    },

    input: {
        flex: 1,
        fontSize: 14,
        paddingLeft: 8,
        color: '#121212',
    },

    search: {
        marginRight: 8,
    },

    mic: {
        marginLeft: 8,
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
        flexGrow: 0,
    },
    popular_container: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    popular_box: {
        width: 240,
        marginRight: 14,
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        padding: 10,
        flexShrink: 0,
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
