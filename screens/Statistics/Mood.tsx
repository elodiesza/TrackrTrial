import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import moment from 'moment';

const width = Dimensions.get('window').width;

export default class Mood extends Component {

    render() {
        const widthAndHeight = 250
        const series = [123, 321, 123, 789, 537]
        const sliceColor = ['#fbd203', '#ffb300', '#ff9100', '#ff6c00', '#ff3c00']

        return (
            <ScrollView style={{flex:1}}>
                <View style={styles.container}>
                    <Text style={styles.title}>Basic</Text>
                    <PieChart widthAndHeight={widthAndHeight} series={series} sliceColor={sliceColor} />
                    <Text style={styles.title}>Doughnut</Text>
                    <PieChart
                        widthAndHeight={widthAndHeight}
                        series={series}
                        sliceColor={sliceColor}
                        coverRadius={0.45}
                        coverFill={'#FFF'}
                    />
                </View>
            </ScrollView>
        );
    }
};


const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    margin: 10,
  },
});
