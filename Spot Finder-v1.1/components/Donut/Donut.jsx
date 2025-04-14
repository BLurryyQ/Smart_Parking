import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Platform } from 'react-native';

const Donut = ({ progress, radius, strokeWidth, color }) => {
  const animated = useRef(new Animated.Value(0)).current;
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: progress,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
      <View style={{ width: radius * 2, height: radius * 2 }}>
        <Svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
        >
          <Circle
              stroke="#E6E7E8"
              cx="50%"
              cy="50%"
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
          />
          <AnimatedCircle
              stroke={color}
              cx="50%"
              cy="50%"
              r={radius}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference}, ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              fill="none"
              rotation="-90"
              originX="50%"
              originY="50%"
          />
        </Svg>
      </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export default Donut;
