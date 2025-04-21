import React from 'react';
import { View, StyleSheet } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const VehicleSkeleton = () => (
    <View style={styles.wrapper}>
        <ContentLoader
            speed={1.5}
            width="100%"
            height={100}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {/* Car icon */}
            <Rect x="20" y="30" rx="8" ry="8" width="50" height="50" />

            {/* Brand + model */}
            <Rect x="80" y="30" rx="6" ry="6" width="180" height="16" />

            {/* Type + plate */}
            <Rect x="80" y="55" rx="5" ry="5" width="140" height="14" />

            {/* Check circle on the right */}
            <Circle cx="350" cy="50" r="12" />
        </ContentLoader>
    </View>
);

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
});

export default VehicleSkeleton;
