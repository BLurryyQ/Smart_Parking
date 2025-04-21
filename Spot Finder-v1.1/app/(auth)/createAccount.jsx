import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import Person from "../../assets/images/person.svg";
import Mail from "../../assets/images/mail.svg";
import Lock from "../../assets/images/lock.svg";
import Phone from "../../assets/images/phone.svg";
import Button from '../../components/Button/Button';
import { router, Link } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import Input from '../../components/Input/Input';
import Password from '../../components/Password/Password';
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreateAccount = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [Passwordvisible, setPasswordvisible] = useState(false);

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;

    const verify = async () => {
        if (!prenom || !nom || !username || !email || !telephone || !password) {
            setErrorMsg("Please fill in all fields.");
            return;
        }

        if (!usernameRegex.test(username)) {
            setErrorMsg("Username can only contain letters, numbers, _, -, and .");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch("http://127.0.0.1:8000/api/mobile-auth/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    nom,
                    prenom,
                    email,
                    telephone,
                    password
                })
            });

            const data = await res.json();
            if (data.success) {
                await AsyncStorage.setItem('email', email); // Save email for verification screen
                router.push('verification');
            } else {
                setErrorMsg(data.error || "Failed to register.");
            }
        } catch (err) {
            setErrorMsg("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={darkMode ? "light-content" : "dark-content"}
            />
            <Text style={[styles.heading, { color: theme.color }]}>Create Account</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.column}>
                    <View>
                        <Text style={styles.headingText}>Create your account to unlock a personalized experience.</Text>

                        <View style={styles.inputContainer}>
                            <Input label='First Name' placeholder='Enter your first name' Icon={Person} value={prenom} onChangeText={setPrenom} />
                            <Input label='Last Name' placeholder='Enter your last name' Icon={Person} value={nom} onChangeText={setNom} />
                            <Input label='Email' placeholder='Enter your email address' Icon={Mail} value={email} onChangeText={setEmail} />
                            <Input label='Phone Number' placeholder='Enter your phone number' Icon={Phone} value={telephone} onChangeText={setTelephone} />
                            <Input label='Username' placeholder='Enter your username' Icon={Person} value={username} onChangeText={setUsername} />
                            <Password label='Password' Icon={Lock} placeholder='Enter your password' passwordVisible={Passwordvisible} setPasswordVisible={setPasswordvisible} value={password} onChangeText={setPassword} />
                        </View>

                        {errorMsg !== '' && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMsg}</Text>}

                        {loading ? (
                            <ActivityIndicator color="#007BFF" />
                        ) : (
                            <Button buttonText="Create Account" onPress={verify} />
                        )}

                    </View>

                    <Text style={[styles.bottom_text, { color: theme.color }]}>
                        Already have an account?<Link href='/login' style={styles.link}> Login</Link>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

export default CreateAccount;


const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
        flex: 1,
    },
    scroll: {
        flex: 1,
        flexGrow: 1,
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
    },
    heading: {
        fontSize: 28,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    headingText: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
        marginVertical: 10,
    },
    inputContainer: {
        gap: 16,
        marginBottom: 26,
    },
    or: {
        textAlign: 'center',
        marginVertical: 28,
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
    },
    tab_container: {
        gap: 20,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        borderWidth: 1,
        borderColor: '#757575',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: 'transparent',
    },
    tab_text: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Montserrat_500Medium',
        color: '#121212',
    },
    bottom_text: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#121212',
        textAlign: 'center',
        marginBottom: '5%',
        marginTop: 20,
    },
    link: {
        color: '#FF95AE',
    }
});