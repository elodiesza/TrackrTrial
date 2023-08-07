import React, { Component } from 'react'
import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import SleeplogMonth from '../../components/SleepLogMonth';

const width = Dimensions.get('window').width;

const SleepLogStats = ({sleep, year, month}) => {


    return (
        <SafeAreaView style={styles.container}>
          <SleeplogMonth sleep={sleep} year={year} month={month}/>
        </SafeAreaView>
    );

};

export default SleepLogStats;

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
