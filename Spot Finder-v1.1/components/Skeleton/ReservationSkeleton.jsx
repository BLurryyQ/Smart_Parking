import React from 'react';
import { View, Platform } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const ReservationSkeleton = () => (
    <View style={{ marginBottom: 20 }}>
        <ContentLoader
            speed={2}
            width="100%"
            height={120}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <Rect x="0" y="0" rx="10" ry="10" width="100%" height="100" />
        </ContentLoader>
    </View>
);

export default ReservationSkeleton;
