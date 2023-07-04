import React, { Component } from 'react'
import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import moment from 'moment';

const width = Dimensions.get('window').width;

const SleepLog = () => {


    return (
        <SafeAreaView style={styles.container}>
          <Text>HELLO</Text>
        </SafeAreaView>
    );

};

export default SleepLog;

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
