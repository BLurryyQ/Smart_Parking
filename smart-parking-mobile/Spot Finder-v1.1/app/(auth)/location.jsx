import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import React, { useContext } from 'react';
import Locations from "../../assets/images/location.png";
import Button from '../../components/Button/Button';
import { router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';

const Location = () => {
    const { theme } = useContext(ThemeContext);
    const home = () => {
        router.push('home');
    };

    const manual = () => {
        router.push('manualLocation');
    }
   
  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
        <View style={styles.content}>
            <Image source={Locations} alt='location' style={styles.image} />
            <Text style={[styles.content_heading, {color:theme.color}]}>What is Your Location</Text>
            <Text style={styles.content_text}>We need to know location in order to suggest near by  services.</Text>
        </View>
        <View style={styles.button_container}>
            <Button buttonText="Allow Location Access" onPress={home} />
            <Button buttonText="Enter Location Manually" textColor="#FF95AE" borderColor="#FF95AE" backgroundColor="transparent" onPress={manual} />
        </View>
    </View>
  )
}

export default Location;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        justifyContent: 'center',
        gap: 30,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 130,
        height: 130,
    },
    content_heading: {
        fontSize: 26,
        lineHeight: 36,
        fontFamily: 'Montserrat_700Bold',
        textAlign: 'center',
        marginTop: 50,
    },
    content_text: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
    },
    button_container: {
        gap: 15,
        marginBottom:Platform.OS === 'web'? 10 : '10%',
    }
})