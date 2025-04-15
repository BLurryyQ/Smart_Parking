import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const ReservationSkeleton = () => (
    <View style={styles.wrapper}>
        <ContentLoader
            speed={1.5}
            width="100%"
            height={130}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            {/* Image placeholder */}
            <Rect x="10" y="15" rx="10" ry="10" width="100" height="100" />

            {/* Title & rating row */}
            <Rect x="120" y="15" rx="5" ry="5" width="150" height="14" />
            <Rect x="280" y="15" rx="5" ry="5" width="40" height="14" />

            {/* Parking name */}
            <Rect x="120" y="38" rx="5" ry="5" width="180" height="12" />

            {/* Price */}
            <Rect x="120" y="58" rx="5" ry="5" width="60" height="12" />

            {/* Location */}
            <Rect x="120" y="78" rx="5" ry="5" width="140" height="12" />

            {/* Time and car row */}
            <Rect x="120" y="98" rx="5" ry="5" width="100" height="12" />
            <Rect x="230" y="98" rx="5" ry="5" width="80" height="12" />
        </ContentLoader>
    </View>
);

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 15,
        paddingHorizontal: 4,
    },
});

export default ReservationSkeleton;
