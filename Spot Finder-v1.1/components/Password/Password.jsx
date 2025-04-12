import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext } from 'react';
import Open from "../../assets/images/eye-open.svg";
import Dark_open from "../../assets/images/dark-eye-open.svg";
import Close from "../../assets/images/eye-close.svg";
import Dark_close from "../../assets/images/dark-eye-close.svg";
import ThemeContext from '../../theme/ThemeContext';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const Password = ({ label, passwordVisible, setPasswordVisible, placeholder, keyboardType, Icon, value, onChangeText }) => {
    const { theme, darkMode } = useContext(ThemeContext);
    const placeholderColor = darkMode ? '#f6f6f6' : '#505050';
    const togglePasswordVisible = () => setPasswordVisible(!passwordVisible);

    return (
        <View style={styles.inputBox}>
            {label && <Text style={[styles.label, { color: theme.color }]}>{label}</Text>}
            <View style={styles.inputWrapper}>
                {Icon && <Icon style={styles.icon} />}
                <TextInput
                    style={[styles.passwordInput, { color: theme.color, backgroundColor: theme.card2, borderColor: 'rgba(255, 255, 255, 0.08)' }]}
                    placeholderTextColor={placeholderColor}
                    placeholder={placeholder}
                    secureTextEntry={!passwordVisible}
                    keyboardType={keyboardType}
                    value={value}
                    onChangeText={onChangeText}
                />
                <TouchableOpacity style={styles.box} onPress={togglePasswordVisible}>
                    {passwordVisible ? (darkMode ? <Dark_open /> : <Open />) : (darkMode ? <Dark_close /> : <Close />)}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Password;

const styles = StyleSheet.create({
    inputBox: { gap: 10 },
    label: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Montserrat_700Bold',
    },
    inputWrapper: { position: "relative" },
    passwordInput: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        paddingLeft: 40,
        paddingRight: 45,
        borderRadius: 6,
        backgroundColor: '#f6f6f6',
        borderColor: 'transparent',
        borderWidth: 1,
    },
    box: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        height: '100%',
        width: '17%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        position: 'absolute',
        left: 10,
        bottom: 15,
        zIndex: 100,
    },
});