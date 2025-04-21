import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import ContentLoader, { Rect } from 'react-content-loader/native';

const HomeSkeleton = ({ count = 3 }) => {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchWrapper}>
                <ContentLoader
                    speed={1.5}
                    width="100%"
                    height={60}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <Rect x="0" y="10" rx="10" ry="10" width="100%" height="40" />
                </ContentLoader>
            </View>

            {/* Popular Heading */}
            <View style={styles.headingWrapper}>
                <ContentLoader
                    speed={1.5}
                    width="100%"
                    height={30}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <Rect x="0" y="5" rx="6" ry="6" width="150" height="20" />
                </ContentLoader>
            </View>

            {/* Horizontal Popular Cards */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {[...Array(count)].map((_, index) => (
                    <View key={index} style={styles.popularBox}>
                        <ContentLoader
                            speed={1.5}
                            width={220}
                            height={220}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#ecebeb"
                        >
                            <Rect x="0" y="0" rx="10" ry="10" width="100%" height="140" />
                            <Rect x="0" y="150" rx="4" ry="4" width="80" height="12" />
                            <Rect x="0" y="170" rx="4" ry="4" width="120" height="14" />
                            <Rect x="0" y="190" rx="4" ry="4" width="100" height="12" />
                        </ContentLoader>
                    </View>
                ))}
            </ScrollView>

            {/* Nearby Heading */}
            <View style={styles.headingWrapper}>
                <ContentLoader
                    speed={1.5}
                    width="100%"
                    height={30}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                >
                    <Rect x="0" y="5" rx="6" ry="6" width="150" height="20" />
                </ContentLoader>
            </View>

            {/* Nearby Vertical Cards */}
            {[...Array(count)].map((_, index) => (
                <View key={index} style={styles.stackContainer}>
                    <ContentLoader
                        speed={1.5}
                        width="100%"
                        height={100}
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <Rect x="0" y="0" rx="10" ry="10" width="100" height="100" />
                        <Rect x="120" y="10" rx="5" ry="5" width="140" height="14" />
                        <Rect x="120" y="30" rx="5" ry="5" width="180" height="12" />
                        <Rect x="120" y="50" rx="5" ry="5" width="150" height="10" />
                        <Rect x="120" y="70" rx="5" ry="5" width="160" height="10" />
                    </ContentLoader>
                </View>
            ))}
        </ScrollView>
    );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'web' ? 20 : 50,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    searchWrapper: {
        marginBottom: 10,
    },
    headingWrapper: {
        marginBottom: 10,
    },
    horizontalScroll: {
        marginVertical: 10,
    },
    popularBox: {
        marginRight: 14,
    },
    stackContainer: {
        marginBottom: 15,
    },
});
