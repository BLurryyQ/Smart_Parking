import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import Back from '../../assets/images/Back.svg';
import Dark_back from "../../assets/images/White_back.svg";
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { receipt_data, receipt_data2, receipt_data3 } from '../../Data/Data';
import Scan from "../../assets/images/scan_code.png";
import Dark_scan from "../../assets/images/dark_scan.png";
import Button from '../../components/Button/Button';
import ThemeContext from '../../theme/ThemeContext';
import { router, Link } from "expo-router";

const Receipt = () => {
  const { theme, darkMode } = useContext(ThemeContext);

  const back = () => {
    router.push('booking');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={back}>
          {darkMode ? <Dark_back /> : <Back />}
        </TouchableOpacity>
        <Text style={[styles.heading, { color: theme.color }]}>E-Receipt</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.column}>
          <View style={[styles.receipt, { backgroundColor: theme.cardbg }]}>
            <Text style={[styles.title, { color: theme.color }]}>Your Booking</Text>
            <View style={styles.review_container}>
              {receipt_data2.map((d) => (
                <View style={styles.review_row} key={d.id}>
                  <View style={styles.left_row}>
                    <Text style={[styles.text, { color: theme.color }]}>{d.text}</Text>
                  </View>
                  <Text style={[styles.value, { color: theme.color }]}>{d.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.hr}></View>
            <View style={styles.review_container}>
              {receipt_data.map((d) => (
                <View style={styles.review_row} key={d.id}>
                  <View style={styles.left_row}>
                    {d.icon}
                    <Text style={[styles.text, { color: theme.color }]}>{d.text}</Text>
                  </View>
                  <Text style={[styles.value, { color: theme.color }]}>{d.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.hr}></View>
            <Text style={[styles.title, { color: theme.color }]}>Price Details</Text>
            <View style={styles.review_container}>
              {receipt_data3.map((d) => (
                <View style={styles.review_row} key={d.id}>
                  <View style={styles.left_row}>
                    <Text style={[styles.text, { color: theme.color }]}>{d.text}</Text>
                  </View>
                  <Text style={[styles.value, { color: theme.color }]}>{d.value}</Text>
                </View>
              ))}
            </View>
            <View style={styles.review_row}>
              <Text style={[styles.value, { color: theme.color }]}>Total Price</Text>
              <Text style={[styles.value, { color: theme.color }]}>$64.50</Text>
            </View>
            <View style={styles.image_box}>
              {darkMode ? <Image source={Dark_scan} alt='image' style={styles.scan} /> : <Image source={Scan} alt='image' style={styles.scan} />}
            </View>
          </View>
          <View style={styles.button_box}>
            <Button buttonText="E-Ticket" onPress={back} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Receipt;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    lineHeight: 34,
    fontFamily: 'Montserrat_700Bold',
    color: '#121212',
    textTransform: 'capitalize',
    marginLeft: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
  },
  receipt: {
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F6F6F6',
  },
  title: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Montserrat_700Bold',
    color: '#000000',
    textTransform: 'capitalize',
  },
  review_container: {
    marginVertical: 16,
    gap: 16,
  },
  review_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left_row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Roboto_500Medium',
    color: '#757575',
    textTransform: 'capitalize',
  },
  value: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Roboto_700Bold',
    color: '#121212',
  },
  hr: {
    borderBottomColor: '#BABABA',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 16,
  },
  scan: {
    width: 280,
    height: 85,
  },
  image_box: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  button_box: {
    alignItems: 'center',
    marginBottom: '10%',
    marginTop: 30,
  },
});
