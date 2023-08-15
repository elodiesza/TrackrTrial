import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import {colors} from '../styles';
import { MoodIcons } from '../constants/MoodIcons';

const BigPie = ({  data, name, states, year, month, daysInMonth, pieWidth }) => {
   
  const totalCount = data==undefined? 0 : data.map(c=>c.count).reduce((a,b)=>a+b,0);
  const emptyArray = [1,0];

  return (
        <View style={{flex:4, justifyContent:'center', alignItems: 'center'}}>
          <PieChart
            widthAndHeight={pieWidth}
            series={totalCount==0? emptyArray : data.map(c=>c.count)}
            sliceColor={totalCount==0? [colors.primary.default,colors.primary.gray]: 
            name=="MOOD"?  MoodIcons.map(c=>c.color) : states.filter(c=>(c.name==name)).map(c=>c.color)}
            coverRadius={0.60}
            coverFill={colors.primary.defaultlight}
          />
          <View style={{position:'absolute'}}>
            <Text style={{textAlign:'center', fontSize:10}}>MOOD</Text>
          </View>
        </View>
  );
};
export default BigPie;

