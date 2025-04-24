import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Back from "../../assets/images/Back.svg";
import Star from "../../assets/images/Star.svg";
import Heart from "../../assets/images/empty_heart.svg";
import HeartFilled from "../../assets/images/filled_heart.svg";
import Car from "../../assets/images/car.svg";
import Cars from '../../assets/images/Cars.svg';
import Locate from "../../assets/images/locate2.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Dark_Locate from "../../assets/images/dark_locate2.svg";
import ThemeContext from '../../theme/ThemeContext';
import { router, useFocusEffect } from "expo-router";

const FAVORITES_KEY = 'favorite_parkings';

const parkingImages = [
    require('../../assets/images/parking1.png'),
    require('../../assets/images/parking2.png'),
    require('../../assets/images/parking3.png'),
    require('../../assets/images/parking4.png'),
    require('../../assets/images/parking5.png'),
];

const Favourite = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [wishlist, setWishlist] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [imageMap, setImageMap] = useState({});

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const favIds = JSON.parse(await AsyncStorage.getItem(FAVORITES_KEY)) || [];
                setWishlist(favIds);

                const res = await fetch('http://127.0.0.1:8000/api/parking_lots/');
                const data = await res.json();

                const filtered = data.filter(p => favIds.includes(p._id));
                setFavorites(filtered);

                const shuffled = [...parkingImages].sort(() => 0.5 - Math.random());
                const imgMap = {};
                let i = 0;
                filtered.forEach(p => {
                    imgMap[p._id] = shuffled[i];
                    i = (i + 1) % shuffled.length;
                });
                setImageMap(imgMap);
            };

            loadData();
        }, [])
    );

    const toggleWishlist = async (id) => {
        const updated = wishlist.includes(id)
            ? wishlist.filter(i => i !== id)
            : [...wishlist, id];

        setWishlist(updated);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
        setFavorites(favorites.filter(p => updated.includes(p._id)));
    };

    const back = () => {
        router.canGoBack?.() ? router.back() : router.push('home');
    };

    const details = (id) => {
        router.push({ pathname: '(screens)/parkingDetails', params: { parkingLotId: id } });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={back}>
                    {darkMode ? <Dark_back /> : <Back />}
                </TouchableOpacity>
                <Text style={[styles.heading, { color: theme.color }]}>Favourite</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.stack_container}>
                    {favorites.map((p) => (
                        <TouchableOpacity key={p._id} style={[styles.stack, { backgroundColor: theme.cardbg }]} onPress={() => details(p._id)}>
                            <View style={styles.stack_inner}>
                                <View style={styles.image_wrap}>
                                    <Image source={imageMap[p._id]} style={styles.stack_img} />
                                    <TouchableOpacity onPress={() => toggleWishlist(p._id)} style={styles.wishlist_container}>
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
                                        <Text style={styles.price}>5.00 MAD<Text style={styles.time}>/hr</Text></Text>
                                    </View>
                                    <View style={styles.location_row}>
                                        {darkMode ? <Dark_Locate /> : <Locate />}
                                        <Text style={styles.location_text}>{p.localisation?.ville}, {p.localisation?.pays}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.hr}></View>
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
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Favourite;

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
        gap: 60,
        paddingBottom: 20,
    },
    heading: {
        fontSize: 24,
        lineHeight: 34,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    stack_container: {
        gap: 10,
        paddingBottom: 10,
    },
    stack: {
        backgroundColor: '#F6F6F6',
        borderRadius: 12,
        padding: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    stack_inner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    image_wrap: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 12,
    },
    stack_img: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    wishlist_container: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    stack_body: {
        flex: 1,
        gap: 5,
    },
    stack_body_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    rating_row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
        gap: 4,
    },
    rating: {
        fontSize: 12,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
    },
    parking: {
        fontSize: 10,
        lineHeight: 11,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        maxWidth: 85,
        marginVertical: 8,
    },
    name_price2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 4,
    },
    name: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#121212',
    },
    price: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#FF95AE',
    },
    time: {
        color: '#757575',
    },
    location_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    location_text: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_500Medium',
        color: '#757575',
    },
    hr: {
        borderBottomColor: '#BABABA',
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        marginVertical: 16,
    },
    timing_car2: {
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
});