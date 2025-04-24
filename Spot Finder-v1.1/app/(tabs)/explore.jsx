import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeContext from '../../theme/ThemeContext';
import Star from "../../assets/images/Star.svg";
import Heart from "../../assets/images/empty_heart.svg";
import HeartFilled from "../../assets/images/filled_heart.svg";
import Car from "../../assets/images/car.svg";
import Cars from "../../assets/images/Cars.svg";

const parkingImages = [
  require('../../assets/images/parking1.png'),
  require('../../assets/images/parking2.png'),
  require('../../assets/images/parking3.png'),
  require('../../assets/images/parking4.png'),
  require('../../assets/images/parking5.png'),
];

const FAVORITES_KEY = 'favorite_parkings';

const Explore = () => {
  const { theme } = useContext(ThemeContext);
  const [userCoords, setUserCoords] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);

  const GOOGLE_MAPS_KEY = 'AIzaSyAiebjuQH71Q4hynDLG69UgMkbNYabtPAQ';

  useEffect(() => {
    const loadData = async () => {
      const loc = await AsyncStorage.getItem("location");
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      if (loc) {
        const parsed = JSON.parse(loc);
        setUserCoords({ lat: parsed.latitude, lng: parsed.longitude });
      }

      if (storedFavorites) {
        setWishlist(JSON.parse(storedFavorites));
      }

      const res = await fetch("http://127.0.0.1:8000/api/parking_lots/");
      const data = await res.json();

      const shuffledImages = [...parkingImages].sort(() => 0.5 - Math.random());
      let index = 0;

      const formatted = data.map(p => {
        const image = shuffledImages[index % shuffledImages.length];
        index++;
        return {
          id: p._id,
          name: p.nom,
          coords: {
            lat: p.localisation.coordinates[0],
            lng: p.localisation.coordinates[1],
          },
          price: "5.00 MAD",
          timing: "/hr",
          timing2: `${p.capaciteTotal} total`,
          vehicle: `${p.placeDisponibles} spots`,
          image,
          rating: "4.9"
        };
      });

      setParkings(formatted);
    };

    loadData();
  }, []);

  const toggleWishlist = async (id) => {
    const updated = wishlist.includes(id)
        ? wishlist.filter(i => i !== id)
        : [...wishlist, id];

    setWishlist(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const getGoogleMapUrl = () => {
    if (!userCoords) return '';
    const center = `${userCoords.lat},${userCoords.lng}`;
    const destination = selectedParking ? `${selectedParking.lat},${selectedParking.lng}` : null;

    if (destination) {
      return `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_KEY}&origin=${center}&destination=${destination}&mode=driving`;
    }

    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${center}&zoom=14`;
  };

  return (
      <View style={styles.container}>
        {userCoords ? (
            <View style={styles.mapContainer}>
              {/* Web-based approach with an iframe */}
              <iframe
                  title="Google Map"
                  src={getGoogleMapUrl()}
                  style={styles.map}
                  allowFullScreen
                  loading="lazy"
              />
            </View>
        ) : (
            <Text style={{ textAlign: 'center' }}>Loading map...</Text>
        )}

        <View style={styles.overlay}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
            {parkings.map(p => (
                <TouchableOpacity
                    key={p.id}
                    style={[styles.card, { backgroundColor: theme.cardbg }]}
                    onPress={() => setSelectedParking(p.coords)}
                >
                  <View style={styles.imageWrap}>
                    <Image source={p.image} style={styles.image} resizeMode="cover" />
                    <TouchableOpacity onPress={() => toggleWishlist(p.id)} style={styles.heart}>
                      {wishlist.includes(p.id)
                          ? <HeartFilled width={20} height={20} fill="#FF3B30" />
                          : <Heart width={20} height={20} />}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.body}>
                    <View style={styles.ratingRow}>
                      <Star />
                      <Text style={styles.rating}>{p.rating}</Text>
                    </View>
                    <Text style={styles.parking}>Car Parking</Text>
                    <View style={styles.name_price}>
                      <Text style={[styles.name, { color: theme.color }]}>{p.name}</Text>
                      <Text style={styles.price}>{p.price}<Text style={styles.time}>{p.timing}</Text></Text>
                    </View>
                    <View style={styles.timing_car}>
                      <View style={styles.timing_row}>
                        <Cars />
                        <Text style={[styles.timing, { color: theme.color }]}>{p.timing2}</Text>
                      </View>
                      <View style={styles.car_row}>
                        <Car />
                        <Text style={[styles.car, { color: theme.color }]}>{p.vehicle}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  map: {
    width: '100%',
    height: '100%',
    border: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingLeft: 10,
  },
  scroll: {
    paddingBottom: 10,
  },
  card: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    padding: 10,
  },
  imageWrap: {
    position: 'relative',
    height: 130,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  body: {
    marginTop: 10,
    gap: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
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
  },
  name_price: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
  },
  price: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FF95AE',
  },
  time: {
    fontSize: 12,
    color: '#757575',
  },
  timing_car: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timing_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  car_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timing: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
  car: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
});

