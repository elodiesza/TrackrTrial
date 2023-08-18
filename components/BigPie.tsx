import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import {colors} from '../styles';
import { MoodIcons } from '../constants/MoodIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BigPie = ({  data, name, states, year, month, daysInMonth, pieWidth }) => {
   
  const totalCount = data==undefined? 0 : data.map(c=>c.count).reduce((a,b)=>a+b,0);
  const emptyArray = [1,0];
  const maxValue = name!=="MOOD"? 0 : Math.max(...data.map(c=>c.count));
  const maxMood = (name!=="MOOD" || maxValue==undefined)? undefined:MoodIcons.filter(c=>c.name==data.filter(c=>c.count==maxValue).map(c=>c.item)[0]).map(c=>c.icon);

  return (
        <View style={{flex:4, justifyContent:'center', alignItems: 'center'}}>
          <PieChart
            widthAndHeight={pieWidth}
            series={totalCount==0? emptyArray : data.map(c=>c.count)}
            sliceColor={totalCount==0? [colors.primary.default,colors.primary.gray]: 
            name=="MOOD"?  MoodIcons.map(c=>c.color) : states.filter(c=>(c.name==name)).map(c=>c.color)}
            coverRadius={0.60}
            coverFill={name=="MOOD"? colors.primary.black:colors.primary.defaultlight}
          />
          <View style={{position:'absolute'}}>
            <View style={{display:name=="MOOD"?"none":"flex"}}>
              <Text style={{textAlign:'center', fontSize:10}}>{name}</Text>
            </View>
            <View style={{display:name=="MOOD"?"flex":"none"}}>
              <MaterialCommunityIcons name={maxMood} size={140} color={colors.primary.defaultlight}/>
            </View>
          </View>
        </View>
  );
};
export default BigPie;

