import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const Donut = ({ progress, radius, strokeWidth, color }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: radius * 2, height: radius * 2, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[
          styles.circle,
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            borderWidth: strokeWidth,
            borderColor: color,
            transform: [{ rotate: '-90deg' }],
            position: 'absolute',
          },
        ]} 
      >
        <Animated.View
          style={[
            styles.mask,
            {
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              borderWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: '90deg' }],
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    padding: 10,
  },
  mask: {
    position: 'absolute',
    backgroundColor: 'transparent',
    padding: 10,
  },
});

export default Donut;
