import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Person from "../../assets/images/person.svg";
import Mail from "../../assets/images/mail.svg";
import Lock from "../../assets/images/lock.svg";
import Button from '../../components/Button/Button';
import { log_methods } from '../../Data/Data';
import { router, Link } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import Input from '../../components/Input/Input';
import Password from '../../components/Password/Password';

const CreateAccount = () => {
    const { theme, darkMode } = useContext(ThemeContext);
    const [Passwordvisible, setPasswordvisible] = useState(false);

    const verify = () => {
        router.push('verification');
    };

    return (
        <View style={[styles.container, {backgroundColor:theme.background}]}>
              <StatusBar 
        translucent
        backgroundColor="transparent"
        barStyle={darkMode ? "light-content" : "dark-content"} 
      />
            <Text style={[styles.heading, {color:theme.color}]}>Create Account</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.column}>
                    <View>
            <Text style={styles.headingText}>Create your account to unlock a personalized music experience tailored to your taste.</Text>
            <View style={styles.inputContainer}>
                <Input label='Username' placeholder='Minato Namikaze' Icon={Person} />
                <Input label="Email Or Phone Number" placeholder='minatonamikaze@gmail.com' Icon={Mail} />
                <Password label='Password' Icon={Lock} placeholder='Password' passwordVisible={Passwordvisible} setPasswordVisible={setPasswordvisible} />
            </View>
            <Button buttonText="Create Account" onPress={verify} />
            <Text style={styles.or}>Or Using other Method</Text>
            <View style={styles.tab_container}>
            {
                log_methods.map((d) => (
                    <TouchableOpacity style={[styles.tab]} key={d.id}>
                        {darkMode? d.dark_image : d.image}
                        <Text style={[styles.tab_text, {color:theme.color}]}>{d.text}</Text>
                    </TouchableOpacity>
                ))
            }
        </View>
        </View>
        <Text style={[styles.bottom_text, {color:theme.color}]}>Already have an account?<Link href='/login' style={styles.link} > Login</Link></Text>
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
