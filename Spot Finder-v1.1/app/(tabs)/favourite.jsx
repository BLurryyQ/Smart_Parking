import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import React, { useContext, useState } from 'react';
import Back from "../../assets/images/Back.svg";
import { Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { popular } from '../../Data/Data';
import Star from "../../assets/images/Star.svg";
import Heart from "../../assets/images/empty_heart.svg"; 
import HeartFilled from "../../assets/images/filled_heart.svg";
import Car from "../../assets/images/car.svg";
import Clock from "../../assets/images/clock.svg";
import { router, Link } from "expo-router";
import Dark_back from "../../assets/images/White_back.svg";
import ThemeContext from '../../theme/ThemeContext';
import Locate from "../../assets/images/locate2.svg";
import Dark_Locate from "../../assets/images/dark_locate2.svg";


const Favourite = () => {

  const { theme, darkMode, toggleTheme } = useContext(ThemeContext);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const back = () => {
      if (router.canGoBack?.()) {
          router.back();
      } else {
          router.push('home');
      }
  };

  const details = () => {
    router.push('(screens)/parkingDetails');
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={back}>
       {darkMode? <Dark_back /> :  <Back />}
       </TouchableOpacity>
        <Text style={[styles.heading, {color: theme.color}]}>Favourite</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.stack_container}>
        {
          popular.map((d) =>(
            <TouchableOpacity style={[styles.stack, {backgroundColor: theme.cardbg}]} key={d.id} onPress={details}>
              <View style={styles.stack_inner}>
              <Image source={d.image} style={styles.stack_img} alt='image' />
              <TouchableOpacity onPress={() => toggleWishlist(d.id)} style={styles.wishlist_container}>
                  {wishlist.includes(d.id) ? <HeartFilled /> : <Heart />}
                </TouchableOpacity>
              <View style={styles.stack_body}>
                <View style={styles.stack_body_row}>
                <Text style={styles.parking}>{d.parking}</Text>
                <View style={styles.rating_row}>
                  <Star />
                  <Text style={styles.rating}>{d.rating}</Text>
                </View>
                </View>
                <View style={styles.name_price2}>
                  <Text style={[styles.name, {color: theme.color}]}>{d.name}</Text>
                  <Text style={styles.price}>{d.price}<Text style={styles.time}>{d.timing}</Text></Text>
                </View>
                <View style={styles.location_row}>
                  {darkMode ?  <Dark_Locate /> : <Locate />}
                  <Text style={styles.location_text}>New York, USA</Text>
                </View>
               
              </View>
              </View>
              <View style={styles.hr}></View>
              <View style={styles.timing_car2}>
                  <View style={styles.timing_row}>
                    <Clock />
                    <Text style={[styles.timing, {color:theme.color}]}>{d.timing2}</Text>
                  </View>
                  <View style={styles.car_row}>
                    <Car />
                    <Text style={[styles.car, {color: theme.color}]}>{d.vehicle}</Text>
                  </View>
                </View>
            </TouchableOpacity>
          ))
        }
      </View>
      </ScrollView>
    </View>
  )
}

export default Favourite;

const styles = StyleSheet.create({
  container: {
    paddingTop:Platform.OS === 'web'? 20 : 50,
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
  top_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    position: 'absolute',
    left: 10,
    top: 10,
    width: '100%',
    paddingHorizontal: 10,
},
rating_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    backgroundColor:'#FFFFFF',
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
},
rating: {
    marginLeft: 5,
    fontSize: 12,
    lineHeight: 24,
    fontFamily: 'Roboto_400Regular',
    color: '#121212',
},
card_body: {

},
parking: {
    fontSize: 10,
    lineHeight: 11,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#007BFF',
    backgroundColor: "rgba(0, 123, 255, 0.2)",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    maxWidth: 85,
    marginVertical: 8,
},
name_price: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: 6,
  borderBottomWidth: 1,
  borderBottomColor: '#BABABA',
},
name_price2: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: 6,
  width: '80%',
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
timing_car: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 8,
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
stack_container: {
  gap: 10,
  paddingBottom: 10,
},
stack: {
  backgroundColor: '#F6F6F6',
  borderRadius: 10, 
  padding: 12,
  
},
stack_inner: {
  flexDirection: 'row',
},
stack_img: {
  width: 100,
  height: 100,
  borderRadius: 10,
  position: 'relative',
},
wishlist_container: {
  position: 'absolute',
  padding: 5,
  top: 10,
  left: 70,
},
stack_body: {
  paddingLeft: 10,
  gap: 5,
  width:Platform.OS === 'web'? '100%' : null,
},
stack_body_row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent:'space-between',
  width: '80%',
},
location_row: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
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
})