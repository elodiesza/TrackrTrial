import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import {colors} from '../styles';

const width = Dimensions.get('window').width;

const Mood = ({  moods, year, month, daysInMonth, pieWidth }) => {
 
  const moodCounts = [{"mood":"productive", "count":0},{"mood":"happy", "count":0},{"mood":"sick", "count":0},{"mood":"stressed", "count":0},{"mood":"angry", "count":0},{"mood":"calm", "count":0},{"mood":"bored", "count":0},{"mood":"sad", "count":0}];
  
  if (moods.length!==0){
    for(var i=1; i<daysInMonth+1;i++){
      moods.filter(c=>c.day==i).length==0? undefined: moodCounts.filter(c=>c.mood==moods.filter(c=>c.day==i).map(c=>c.mood)[0])[0].count++;
    }
  }

  const moodColors = ['green','yellowgreen','yellow','orange','red','pink','plum','lightblue'];
  const totalCount = moodCounts.map(c=>c.count).reduce((a,b)=>a+b,0);

  return (
        <View style={{flex:4, justifyContent:'center', alignItems: 'center'}}>
          <PieChart
            widthAndHeight={pieWidth}
            series={totalCount==0? [1,0,0,0,0,0,0,0] : moodCounts.map(c=>c.count)}
            sliceColor={totalCount==0? ['lightgray','gray','gray','gray','gray','gray','gray','gray']: moodColors}
            coverRadius={0.45}
            coverFill={colors.primary.defaultlight}
          />
        </View>
  );
};
export default Mood;

