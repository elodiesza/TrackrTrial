import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import moment from 'moment';

const width = Dimensions.get('window').width;

const PieChartView = ({  intable, daysInMonth }) => {
 
  const itemCounts = [{"item":"productive", "count":0},{"item":"happy", "count":0},{"item":"sick", "count":0},{"item":"stressed", "count":0},{"item":"angry", "count":0},{"item":"calm", "count":0},{"item":"bored", "count":0},{"item":"sad", "count":0}];
  
  
  const table = () => {
    let temp=intable;
    for (var i=0; i<intable.length; i++){
      temp[i][0][0] = "item";
    }
    return temp;
  }
  console.log(intable);

  if (table.length!==0){
    for(var i=1; i<daysInMonth+1;i++){
      table.filter(c=>c.day==i).length==0? undefined: itemCounts.filter(c=>c.item==table.filter(c=>c.day==i).map(c=>c.item)[0])[0].count++;
    }
  }

  const itemColors = ['green','yellowgreen','yellow','orange','red','pink','plum','lightblue'];
  const totalCount = itemCounts.map(c=>c.count).reduce((a,b)=>a+b,0);


  return (
    <View style={{ flex: 1, width:width }}>
      <View style={{height: 300, width:width, justifyContent:'center', alignItems: 'center', flexDirection:'row'}}>
        <View style={{flex:4, justifyContent:'center', alignItems: 'center'}}>
          <PieChart
            widthAndHeight={width/2}
            series={totalCount==0? [1,0,0,0,0,0,0,0] : itemCounts.map(c=>c.count)}
            sliceColor={totalCount==0? ['lightgray','gray','gray','gray','gray','gray','gray','gray']: itemColors}
            coverRadius={0.45}
            coverFill={'#FFF'}
          />
        </View>
        <View style={{flex:3, justifyContent:'center', alignItems: 'center'}}>
          <FlatList
            data={itemCounts}
            renderItem={({item,index}) => 
              <View style={{flexDirection:'row'}}>
                <View style={{height:14,width:14, alignSelf:'center', backgroundColor:itemColors[index],borderRadius:7}}/>
                <Text style={{fontSize: 14,width:40, margin:3, marginLeft:10, color: 'gray'}}>{totalCount==0? 0: (item.count*100/totalCount).toFixed(0)}% </Text><Text style={{fontSize: 14, margin:3}}>{item.item}</Text>
              </View>
            }
            keyExtractor={item => item.item}
            scrollEnabled={false}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
          />
        </View>
      </View>
    </View>
  );
};
export default PieChartView;

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
