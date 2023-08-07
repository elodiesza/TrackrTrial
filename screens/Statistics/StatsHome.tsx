import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { container } from '../../styles';
import MoodPie from '../../components/MoodPie';
import PieChartView from '../../components/PieChartView';

const width = Dimensions.get('window').width;

const StatsHome = ({ habits, states, staterecords, month, year, tracks, moods, daysInMonth }) => {

    return (
        <View style={container.body}>
            <View  style={{width:width,height: 120}}>
                <MoodPie moods={moods} year={year} month={month} daysInMonth={daysInMonth} pieWidth={width/5}/>
            </View>
            <FlatList
            data={[...new Set(states.map(c=>c.name))]}
            renderItem={({ item }) => (<PieChartView name={item} year={year} month={month} states={states} staterecords={staterecords} daysInMonth={daysInMonth} pieWidth={width/5}/>)}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            />
            <View style={{flex:1}}>
            </View> 
        </View>
    );
};
export default StatsHome;
