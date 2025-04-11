import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const Button = ({ buttonText, onPress, backgroundColor, textColor, borderColor, minWidth }) => {
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          minWidth: minWidth || 150,

          backgroundColor: backgroundColor || '#007BFF',
        
          borderColor: borderColor || 'transparent', 
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor || '#ffffff' }]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    minWidth: 150,
  },
  buttonText: {
    textTransform: 'capitalize',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
  },
});

export default Button;
