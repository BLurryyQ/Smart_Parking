import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator, Modal } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Stripe from "../../assets/images/Stripe.svg";
import CheckCircle from '../../components/CheckCircle/CheckCircle';
import { router, useLocalSearchParams } from "expo-router";
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import Tick from "../../assets/images/payment_success.svg";

const extend_data = [
    { id: 1, time: '30 Mins', minutes: 30 },
    { id: 2, time: '1 Hour', minutes: 60 },
    { id: 3, time: '2 Hour', minutes: 120 },
    { id: 4, time: '3 Hour', minutes: 180 },
    { id: 5, time: '4 Hour', minutes: 240 },
    { id: 6, time: '5 Hour', minutes: 300 },
];

const Extend = () => {
    const { reservationId, userId, dateFin } = useLocalSearchParams();
    const { theme, darkMode } = useContext(ThemeContext);
    const [activetab2, setActivetab2] = useState(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const selectedDuration = extend_data.find(d => d.id === activetab2)?.minutes || 0;
    const selectedPrice = selectedDuration * (25 / 30);

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/mobile-auth/user/${userId}/`);
                const data = await res.json();
                setEmail(data.email);
            } catch (e) {
                console.error("Failed to fetch user email", e);
            }
        };
        fetchUserEmail();
    }, []);

    const startStripePayment = async () => {
        if (!email) return;

        setLoading(true);
        try {
            const currentUrl = window.location.href;
            const response = await fetch("http://127.0.0.1:8000/api/payments/create-checkout-session/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    montant: selectedPrice,
                    devise: "MAD",
                    email: email,
                    success_base_url: currentUrl
                })
            });

            const result = await response.json();
            if (result.checkout_url) {
                localStorage.setItem("extend_duration", selectedDuration);
                window.location.href = result.checkout_url;
            } else {
                Alert.alert("Error", "Failed to create Stripe session");
            }
        } catch (error) {
            console.error("Stripe error:", error);
            Alert.alert("Error", "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const url = new URL(window.location.href);
        const success = url.searchParams.get("success");

        if (success === "true" && reservationId && dateFin) {
            const storedMinutes = parseInt(localStorage.getItem("extend_duration")) || selectedDuration;

            const fetchAndExtend = async () => {
                try {
                    const originalDate = new Date(dateFin);
                    const newDate = new Date(originalDate.getTime() + storedMinutes * 60000);

                    const patchRes = await fetch(`http://127.0.0.1:8000/api/reservations/extend/${reservationId}/`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            dateFin: newDate.toISOString()
                        })
                    });

                    if (patchRes.ok) {
                        setIsModalVisible(true);
                    } else {
                        Alert.alert("Error", "Failed to update reservation.");
                    }
                } catch (err) {
                    console.error("Extension error:", err);
                    Alert.alert("Error", "Something went wrong.");
                } finally {
                    localStorage.removeItem("extend_duration");
                }
            };

            fetchAndExtend();
        }
    }, [reservationId, dateFin]);

    const back = () => {
        if (router.canGoBack?.()) {
            router.back();
        } else {
            router.push('(screens)/timer');
        }
    };
    const goHome = () => {
        setIsModalVisible(false);
        router.push('home');
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={back}>
                    {darkMode ? <Dark_back /> : <Back />}
                </TouchableOpacity>
                <Text style={[styles.heading, { color: theme.color }]}>Extend Parking Time</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
                <View style={styles.column}>
                    <View>
                        <Text style={[styles.time_heading, { color: theme.color }]}>Extend Time</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.time_container}>
                                {extend_data.map((d) => (
                                    <TouchableOpacity
                                        key={d.id}
                                        style={[styles.time_tab, activetab2 === d.id && styles.activetab]}
                                        onPress={() => setActivetab2(d.id)}
                                    >
                                        <Text style={[styles.time, activetab2 === d.id && styles.activetime]}>{d.time}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={[styles.title, { color: theme.color }]}>More Payment Option</Text>
                        <View style={styles.pay_tab_container}>
                            <TouchableOpacity style={[styles.tab, { backgroundColor: theme.cardbg }]} onPress={startStripePayment}>
                                <View style={styles.tab_left}>
                                    <Stripe />
                                    <Text style={styles.tab_text}>Stripe</Text>
                                </View>
                                <CheckCircle size={24} color="#007BFF" checked={true} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.button_box}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#007BFF" />
                        ) : (
                            <Button buttonText={`Pay ${selectedPrice} MAD`} onPress={startStripePayment} />
                        )}
                    </View>
                </View>
            </ScrollView>

            <Modal
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={[styles.modalOverlay, { backgroundColor: theme.overlay }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modal_header}>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                {darkMode ? <Dark_back /> : <Back />}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.image_box}>
                            <Tick />
                        </View>
                        <Text style={[styles.modal_heading, { color: theme.color }]}>Payment Success</Text>
                        <Text style={styles.modal_description}>Parking extension was successful. Thank you!</Text>
                        <Button buttonText="Go To Homepage" onPress={goHome} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Extend;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'web' ? 10 : 50,
        paddingHorizontal: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    heading: {
        fontSize: 22,
        lineHeight: 32,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    scrolls: {
        flexGrow: 1,
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
    },
    time_heading: {
        fontSize: 20,
        lineHeight: 30,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        textTransform: 'capitalize',
        marginTop: 25,
        marginBottom: 16,
    },
    time_container: {
        flexDirection: 'row',
        gap: 10,
    },
    time_tab: {
        borderColor: 'transparent',
        borderRadius: 10,
        borderWidth: 1,
        height: 46,
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
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
    title: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Montserrat_600SemiBold',
        color: '#000000',
        marginTop: 30
    },
    pay_tab_container: {
        gap: 18,
        marginTop: 24,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 10,
        borderColor: '#F6F6F6',
        backgroundColor: '#F6F6F6',
    },
    tab_left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    tab_text: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
        textTransform: 'capitalize',
    },
    button_box: {
        marginBottom: Platform.OS === 'web' ? 20 : '10%',
        marginTop: Platform.OS === 'web' ? 30 : null,
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modal_header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 25,
    },
    image_box: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal_heading: {
        fontSize: 26,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textAlign: 'center',
        marginTop: 25,
    },
    modal_description: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        color: '#757575',
        marginTop: 16,
        marginBottom: 50,
    },
});