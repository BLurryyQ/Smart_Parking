import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Pagination = ({ activePageIndex, totalPages }) => {
  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            activePageIndex === index && styles.activeDot
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 20,
    backgroundColor: '#BABABA',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF95AE', 
    width: 40,
    height: 8,
  },
});

export default Pagination;
