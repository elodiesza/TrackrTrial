import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import moment from 'moment';

const width = Dimensions.get('window').width;

const Mood = ({  moods, daysInMonth }) => {
  const moodSeries =[];
  const moodCounts = [{"mood":"productive", "count":0},{"mood":"happy", "count":0},{"mood":"sick", "count":0},{"mood":"stressed", "count":0},{"mood":"angry", "count":0},{"mood":"calm", "count":0},{"mood":"bored", "count":0},{"mood":"sad", "count":0}];

  for(var i=1; i<daysInMonth+1;i++){
    moodSeries.push(moods.filter(c=>c.day==i).length==0? null:moods.filter(c=>c.day==2).map(c=>c.mood)[0]);
    moods.filter(c=>c.day==i).length==0? undefined: moodCounts.filter(c=>c.mood==moods.filter(c=>c.day==i).map(c=>c.mood)[0])[0].count++;
  }

  const moodColors = ['green','yellowgreen','yellow','orange','red','pink','plum','lightblue'];
  const totalCount = moodCounts.map(c=>c.count).reduce((a,b)=>a+b,0);

  return (
    <View style={{ flex: 1, width:width }}>
      <View style={{height: 300, width:width, justifyContent:'center', alignItems: 'center', flexDirection:'row'}}>
        <View style={{flex:4, justifyContent:'center', alignItems: 'center'}}>
          <PieChart
            widthAndHeight={width/2}
            series={moodCounts.map(c=>c.count)}
            sliceColor={moodColors}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>
        <View style={{flex:3, justifyContent:'center', alignItems: 'center'}}>
          <FlatList
            data={moodCounts}
            renderItem={({item,index}) => 
              <View style={{flexDirection:'row'}}>
                <View style={{height:14,width:14, alignSelf:'center', backgroundColor:moodColors[index],borderRadius:7}}/>
                <Text style={{fontSize: 14,width:40, margin:3, marginLeft:10, color: 'gray'}}>{(item.count*100/totalCount).toFixed(0)}% </Text><Text style={{fontSize: 14, margin:3}}>{item.mood}</Text>
              </View>
            }
            keyExtractor={item => item.mood}
            scrollEnabled={false}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          />
        </View>
      </View>
    </View>
  );
};
export default Mood;

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
