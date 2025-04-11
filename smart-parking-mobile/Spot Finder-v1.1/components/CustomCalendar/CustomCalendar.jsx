import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


const CustomCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getCurrentMonthDates = () => {
    let currentDate = new Date();
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    let dates = [];

    for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
      let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      dates.push(newDate);
    }

    return dates;
  };

  const formatDay = (date) => {
    const options = { weekday: 'short' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDatePress = (date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const monthDates = getCurrentMonthDates();

  const currentMonth = monthDates[0].toLocaleDateString('en-US', { month: 'long' });
  const currentYear = monthDates[0].getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.monthContainer} showsHorizontalScrollIndicator={false}>
        {monthDates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayContainer,
              selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDayContainer,
            ]}
            onPress={() => handleDatePress(date)}
          >
            
            <View
              style={[
                styles.dateButton,
                selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDateButton,
              ]}
            >
              <Text style={[
                styles.dateText,
                selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDateText,
              ]}>{date.getDate()}</Text>

              <Text style={[
              styles.dayText,
              selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDayText,
            ]}>{formatDay(date)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },

  monthContainer: {
    flexDirection: 'row',
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    borderColor: '#757575',
    borderWidth: 1,
  },
  selectedDayContainer: {
    backgroundColor: '#FF95AE',
    borderColor: '#FF95AE',
  },
  dayText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#757575',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dateButton: {
    marginTop: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateButton: {},
  dateText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Montserrat_700Bold',
    color: '#757575',
  },
  selectedDateText: {
    color: '#ffffff',
  },
});

export default CustomCalendar;
