import React, { Component } from 'react'
import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import SleeplogMonth from '../../components/SleepLogMonth';
import { container,colors } from '../../styles';

const width = Dimensions.get('window').width;

const SleepLogStats = ({sleep, year, month}) => {


    return (
        <SafeAreaView style={container.body}>
          <View style={[container.statTitle]}>
            <Text style={{fontSize:20}}>SLEEP LOG</Text>
          </View>
          <SleeplogMonth sleep={sleep} year={year} month={month}/>
        </SafeAreaView>
    );

};

export default SleepLogStats;

