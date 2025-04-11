import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, Platform } from 'react-native';
import React, { useContext, useState } from 'react';
import Map from "../../assets/images/map.png";
import { popular } from '../../Data/Data';
import Star from "../../assets/images/Star.svg";
import Heart from "../../assets/images/empty_heart.svg"; 
import HeartFilled from "../../assets/images/filled_heart.svg";
import Car from "../../assets/images/car.svg";
import Clock from "../../assets/images/clock.svg";
import ThemeContext from '../../theme/ThemeContext';
import { router } from "expo-router";

const Explore = () => {
  const { theme } = useContext(ThemeContext);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const details = () => {
    router.push('(screens)/parkingDetails');
  };

  return (
    <View style={styles.explore_page}>
      <Image source={Map} style={styles.image} />
      <ScrollView horizontal={true} style={styles.horizontal_scroll} showsHorizontalScrollIndicator={false} >
        <View style={styles.popular_container}>
          {popular.map((d) => (
            <TouchableOpacity style={[styles.popular_box, {backgroundColor: theme.cardbg}]} key={d.id} onPress={details}>
              <Image source={d.image} style={styles.images} />
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
                  <Text style={[styles.name, {color: theme.color}]}>{d.name}</Text>
                  <Text style={styles.price}>{d.price}<Text style={styles.time}>{d.timing}</Text></Text>
                </View>
                <View style={styles.timing_car}>
                  <View style={styles.timing_row}>
                    <Clock />
                    <Text style={[styles.timing, {color: theme.color}]}>{d.timing2}</Text>
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
    </View>
  );
}

export default Explore;

const styles = StyleSheet.create({
  explore_page: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
  },
  horizontal_scroll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  popular_container: {
    marginVertical: 10,
    flexDirection: 'row',
    maxHeight: 290,
    height: 290,
  },
  popular_box: {
    marginBottom: 20,
    width: 200,
    marginRight: 10, 
    padding: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
  },
  images: {
    width: 180,
    height: 130,
    borderRadius: 10,
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
  card_body: {},
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
});
