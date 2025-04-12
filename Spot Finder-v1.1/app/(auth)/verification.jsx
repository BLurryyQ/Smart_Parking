import { StyleSheet, Text, View, Image, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import React, { useContext, useRef, useState, useEffect } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Verify from "../../assets/images/Verify.png";
import Button from '../../components/Button/Button';
import { router } from "expo-router";
import Tick from "../../assets/images/Tick.png";
import ThemeContext from '../../theme/ThemeContext';
import Otp from '../../components/OTP/Otp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Verification = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const otpRef = useRef(null);

    useEffect(() => {
        const loadEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('email');
            if (storedEmail) setEmail(storedEmail);
        };
        loadEmail();
    }, []);

    const continues = async () => {
        const code = otpRef.current.getCode();

        if (code.length !== 4) {
            Alert.alert("Error", "Please enter the 4-digit verification code.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/mobile-auth/verify-email/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });

            const data = await res.json();

            if (data.success) {
                setIsModalVisible(true);
            } else {
                Alert.alert("Verification Failed", data.error || "Invalid code.");
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong. Try again.");
        }
    };

    const resendCode = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/api/mobile-auth/resend-code/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (data.success) {
                setResendMessage("A new code has been sent to your email.");
            } else {
                setResendMessage("Failed to resend code.");
            }
        } catch (err) {
            setResendMessage("Error occurred.");
        }

        setTimeout(() => setResendMessage(''), 3000);
    };

    const location = () => {
        setIsModalVisible(false);
        router.push('login');
    };

    const back = () => {
        router.push('createAccount');
    };

    const maskedEmail = email ? email.replace(/(?<=.{3}).(?=.*@)/g, '*') : '';

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={back}>
                    {darkMode ? <Dark_back /> : <Back />}
                </TouchableOpacity>
                <Text style={[styles.heading, { color: theme.color }]}>Verification</Text>
            </View>

            <View style={styles.column}>
                <View style={styles.content}>
                    <Image source={Verify} alt='image' style={styles.image} />
                    <Text style={[styles.content_heading, { color: theme.color }]}>Verification Code</Text>
                    <Text style={styles.content_text}>We have sent the verification code to</Text>
                    <Text style={[styles.mail, { color: theme.color }]}>{maskedEmail}</Text>

                    <Otp ref={otpRef} />

                    {resendMessage !== '' && (
                        <Text style={styles.resendMessage}>{resendMessage}</Text>
                    )}
                </View>

                <View>
                    <Button buttonText="Continue" onPress={continues} />
                    <View style={styles.resendContainer}>
                        <Text style={[styles.bottom_text, { color: theme.color }]}>Didn’t receive the code? </Text>
                        <TouchableOpacity onPress={resendCode}>
                            <Text style={styles.link}>Resend</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

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
                        <View style={styles.image_box2}>
                            <Image source={Tick} alt='image' style={styles.Tick} />
                        </View>
                        <Text style={[styles.modal_heading, { color: theme.color }]}>Register Success</Text>
                        <Text style={styles.modal_description}>
                            Congratulations! Your account has been verified. Please login to continue.
                        </Text>
                        <Button buttonText="Continue" onPress={location} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Verification;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'web' ? 20 : 50,
        paddingHorizontal: 20,
        flex: 1,
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    heading: {
        fontSize: 26,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
        textTransform: 'capitalize',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    image: {
        width: 130,
        height: 130,
    },
    content_heading: {
        fontSize: 26,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
        marginTop: 30,
        textTransform: 'capitalize',
    },
    content_text: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
        marginTop: 24,
    },
    mail: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_500Medium',
        marginTop: 4,
    },
    resendMessage: {
        marginTop: 15,
        fontSize: 14,
        color: 'green',
        fontFamily: 'Roboto_500Medium',
        textAlign: 'center',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    bottom_text: {
        fontSize: 14,
        fontFamily: 'Roboto_400Regular',
    },
    link: {
        fontSize: 14,
        fontFamily: 'Roboto_500Medium',
        color: '#FF95AE',
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
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modal_header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 25,
    },
    image_box2: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal_heading: {
        fontSize: 26,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
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
    Tick: {
        width: 130,
        height: 130,
    },
});