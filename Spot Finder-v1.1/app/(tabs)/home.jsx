import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, StatusBar, Platform  } from 'react-native';
import React, { useContext, useState } from 'react';
import Black from "../../assets/images/black_location.svg";
import Notification from "../../assets/images/Notification.svg";
import Mic from "../../assets/images/mic.svg";
import Search from "../../assets/images/search.svg";
import { popular } from '../../Data/Data';
import Star from "../../assets/images/Star.svg";
import Heart from "../../assets/images/empty_heart.svg"; 
import HeartFilled from "../../assets/images/filled_heart.svg";
import Car from "../../assets/images/car.svg";
import Clock from "../../assets/images/clock.svg";
import { router, Link } from "expo-router";
import ThemeContext from '../../theme/ThemeContext';
import Dark_Locate from "../../assets/images/dark_locate2.svg";

const Home = () => {
  const { theme, darkMode, toggleTheme } = useContext(ThemeContext);
  const [wishlist, setWishlist] = useState([]);
  const [wishlist2, setWishlist2] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };
 const toggleWishlist2 = (id) => {
    if (wishlist2.includes(id)) {
      setWishlist2(wishlist2.filter(item => item !== id));
    } else {
      setWishlist2([...wishlist2, id]);
    }
  };
  
  console.log(popular);
const details = () => {
  router.push('(screens)/parkingDetails');
};
  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
        <StatusBar 
        translucent
        backgroundColor="transparent"
        barStyle={darkMode ? "light-content" : "dark-content"} 
      />
      <View style={styles.header}>
        <View style={styles.header_content}>
            <Text style={styles.location}>location</Text>
            <View style={styles.header_content_bottom}>
               { darkMode? <Dark_Locate /> : <Black />}
                <Text style={[styles.heading, {color: theme.color}]}>New York,  <Text style={[styles.heading, {color: theme.color}]}>USA</Text></Text>
            </View>
        </View>
        <TouchableOpacity style={styles.notification}>
            <Notification />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.input_container}>
        <View style={styles.search}>
          <Search  />
        </View>
        <TextInput style={[styles.input, {backgroundColor: theme.cardbg, color: theme.color}]} placeholderTextColor={darkMode ? "#f6f6f6" : "#505050"} placeholder='Search' />
        <View style={styles.mic}>
            <Mic />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={[styles.row_heading, {color:theme.color}]}>Popular Parking</Text>
        <Text style={styles.view}>see all</Text>
      </View>
      <ScrollView horizontal={true} style={styles.horizontal_scroll} showsHorizontalScrollIndicator={false} >
        <View style={styles.popular_container}>
          {popular.map((d) => (
            <TouchableOpacity style={[styles.popular_box, {backgroundColor:theme.cardbg}]} key={d.id} onPress={details}>
              <Image source={d.image} alt='image' style={styles.image} />
              <View style={styles.top_row}>
                <View style={styles.rating_row}>
                  <Star />
                  <Text style={styles.rating}>{d.rating}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleWishlist(d.id)} style={styles.wishlist_container}>
                  {wishlist.includes(d.id) ? <HeartFilled /> : <Heart />}
                </TouchableOpacity>
              </View>
              <View style={styles.card_body}>
                <Text style={styles.parking}>{d.parking}</Text>
                <View style={styles.name_price}>
                  <Text style={[styles.name, {color:theme.color}]}>{d.name}</Text>
                  <Text style={styles.price}>{d.price}<Text style={styles.time}>{d.timing}</Text></Text>
                </View>
                <View style={styles.timing_car}>
                  <View style={styles.timing_row}>
                    <Clock />
                    <Text style={[styles.timing, {color:theme.color}]}>{d.timing2}</Text>
                  </View>
                  <View style={styles.car_row}>
                    <Car />
                    <Text style={[styles.car, {color:theme.color}]}>{d.vehicle}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.row}>
        <Text style={[styles.row_heading, {color:theme.color}]}>Nearby Parking</Text>
        <Text style={styles.view}>see all</Text>
      </View>
      <View style={styles.stack_container}>
        {
          popular.map((d) =>(
            <TouchableOpacity style={[styles.stack, {backgroundColor:theme.cardbg}]} key={d.id} onPress={details}>
              <View style={styles.imageContainer}>
              <Image source={d.image} style={styles.stack_img} alt='image' />
              <TouchableOpacity onPress={() => toggleWishlist2(d.id)} style={styles.wishlist_container2}>
                  {wishlist2.includes(d.id) ? <HeartFilled /> : <Heart />}
                </TouchableOpacity>
                </View>
              <View style={styles.stack_body}>
                <View style={styles.stack_body_row}>
                <Text style={styles.parking}>{d.parking}</Text>
                <View style={styles.rating_row}>
                  <Star />
                  <Text style={styles.rating}>{d.rating}</Text>
                </View>
                </View>
                <View style={styles.name_price2}>
                  <Text style={[styles.name, {color:theme.color}]}>{d.name}</Text>
                  <Text style={styles.price}>{d.price}<Text style={styles.time}>{d.timing}</Text></Text>
                </View>
                <View style={styles.timing_car2}>
                  <View style={styles.timing_row}>
                    <Clock />
                    <Text style={[styles.timing, {color:theme.color}]}>{d.timing2}</Text>
                  </View>
                  <View style={styles.car_row}>
                    <Car />
                    <Text style={[styles.car, {color:theme.color}]}>{d.vehicle}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        }
      </View>
      </ScrollView>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        paddingTop:Platform.OS === 'web'? 20 :  50,
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    location: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Roboto_400Regular',
        color: '#757575',
        textTransform: 'capitalize',
    },
    heading:{
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Roboto_700Bold',
        color: '#121212',
    },
    notification: {
        borderRadius: 8,
        backgroundColor: '#FF95AE',
        padding: 10,
    },
    header_content: {
        gap: 5,
    },
    header_content_bottom: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input_container: {
        marginVertical: 16,
    },
    input: {
        borderRadius: 10,
        backgroundColor: '#F6F6F6',
        paddingVertical: 16,
        paddingHorizontal: 40,
        position: 'relative',
    },
    search: {
        position: 'absolute',
        zIndex: 100,
        bottom: 18,
        left: 10,
    },
    mic: {
        position: 'absolute',
        bottom: 18,
        right: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 10,
    },
    row_heading: {
        fontSize: 16,
        lineHeight: 26,
        fontFamily: 'Montserrat_700Bold',
        color: '#121212',
        textTransform: 'capitalize',
    },
    view: {
        fontSize: 14,
        lineHeight: 24,
        fontFamily: 'Roboto_500Medium',
        color: '#FF95AE',
        textTransform: 'capitalize',
    },
    horizontal_scroll: {
      maxHeight: 290,
      height: 290,
    },
    popular_container: {
        marginVertical: 10,
        flexDirection: 'row',
        maxHeight: 290,
        height: 290,
    },
    popular_box: {
        marginBottom: 20,
        width:Platform.OS === 'web'? '35%' : '28%',
        marginRight: 10, 
        padding: 10,
        backgroundColor: '#F6F6F6',
        maxHeight: 280,
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        position: 'relative',
    },
    top_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        position: 'absolute',
        left: 10,
        top: 10,
        width:Platform.OS === 'web'? '90%' : '100%',
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
    wishlist_container: {
        padding: 5,
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
      width: '80%',
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
      paddingBottom: 50,
    },
    stack: {
      backgroundColor: '#F6F6F6',
      borderRadius: 10, 
      padding: 12,
      flexDirection: 'row',
      width: '100%',
    },
    imageContainer: {
      width:Platform.OS === 'web'? '10%' : null,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stack_img: {
      width: 100,
      height: 100,
      borderRadius: 10,
      position:'relative',
    },
    wishlist_container2: {
      position: 'absolute',
      top: 15,
      right: Platform.OS === 'web'? 20 : 5,
    },
    stack_body: {
      paddingLeft: 10,
      gap: 5,
      width:Platform.OS === 'web'? '100%' : '80%',
    },
    stack_body_row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:'space-between',
      width: '80%',
    }
});
