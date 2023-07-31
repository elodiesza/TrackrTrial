import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import moment from 'moment';
import { container } from '../../styles';
import PieChartView from '../../components/PieChartView';
import Mood from './Mood';

const width = Dimensions.get('window').width;

const StatsHome = ({ habits, month, year, tracks, moods, daysInMonth }) => {



    return (
        <View style={container.body}>
            <View  style={{width:width,height: 120, backgroundColor:'red'}}>
                <Mood moods={moods} daysInMonth={daysInMonth}/>
            </View>
            <View style={{flex:1}}>
            </View> 
        </View>
    );
};
export default StatsHome;
