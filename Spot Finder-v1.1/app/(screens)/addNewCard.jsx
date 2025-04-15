import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import React, { useContext } from 'react';
import Back from "../../assets/images/Back.svg";
import Dark_back from "../../assets/images/White_back.svg";
import Card from "../../assets/images/card_icon.svg";
import Person from "../../assets/images/person.svg";
import Lock from "../../assets/images/lock.svg";
import Calendar from "../../assets/images/calendar2.svg";
import Button from '../../components/Button/Button';
import { router } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import Input from '../../components/Input/Input';

const AddNew = () => {
    const { theme, darkMode, toggleTheme } = useContext(ThemeContext);
    const add_card = () => {
        router.push('(screens)/payment');
    };

    const back = () => {
        if (router.canGoBack?.()) {
            router.back();
        } else {
            router.push('(screens)/payment');
        }
    };


    return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
        <View style={styles.header}>
        <TouchableOpacity onPress={back}>
        {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
            <Text style={[styles.heading, {color:theme.color}]}>Add New Card</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrolls}>
            <View style={styles.column}>
        <View style={styles.input_container}>
        <Input label='Card Holder' placeholder='Minato Namikaze' Icon={Person} />
            <Input label='Card Number' placeholder='Card Number' Icon={Card} />
            <Input label='Expired' placeholder='MM/YY' Icon={Calendar} />
           <Input label='CVV' placeholder="CVV" Icon={Lock} textTransform='none' />
        </View>
        <View style={styles.button_box}>
            <Button buttonText="Save" onPress={add_card} />
        </View>
        </View>
        </ScrollView>
    </View>
  )
}

export default AddNew;

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    heading: {
        fontSize: 24,
        lineHeight: 34,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    scrolls: {
        flex: 1,
        flexGrow: 1,
    },
    column: {
        flex: 1,
        justifyContent: 'space-between',
    },
    input_container: {
        gap: 10,
        marginTop: 30,
    },
    button_box: {
      marginBottom:Platform.OS === 'web'? 10 : '10%',
    }
})