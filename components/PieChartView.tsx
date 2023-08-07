import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart'
import {colors} from '../styles';


const PieChartView = ({ name, year, month, states, staterecords, daysInMonth, pieWidth }) => {
 
  const itemList=states.filter(c=>c.name==name).map(c=>c.item);
  const NbOfItems=itemList.length;
  const dataSeries=[];
  if (staterecords.length!==0){
    for(var j=0; j<NbOfItems;j++){
      var itemCount=0;
      for(var i=1; i<daysInMonth+1;i++){
        staterecords.filter(c=>(c.year==year && c.month==month && c.day==i && c.name==name)).map(c=>c.item)[0]==itemList[j]? itemCount++: undefined;
      }
      dataSeries.push({'item':itemList[j], 'count':itemCount});
    }
  }
  const itemColors=states.filter(c=>c.name==name).map(c=>c.color);
  
  var sumCounts=0;
  for (var i=0;i<NbOfItems;i++){
    sumCounts=sumCounts+dataSeries.map(c=>c.count)[i];
  }

  var noDataArray=[1];
  for (var i=0;i<NbOfItems;i++){
    i==0?undefined:noDataArray.push(0);
  }

  const dataCounts=dataSeries.map(c=>c.count);


  return (
        <View style={{flex:1, justifyContent:'center', alignItems: 'center', margin:10}}>
          <PieChart
            widthAndHeight={pieWidth}
            series={dataCounts.reduce((accumulator, currentValue) => accumulator + currentValue, 0)==0?noDataArray:dataCounts}
            sliceColor={itemColors}
            coverRadius={0.60}
            coverFill={colors.primary.defaultlight}
          />
          <View style={{position:'absolute'}}>
            <Text style={{textAlign:'center', fontSize:10}}>{name}</Text>
          </View>
        </View>
  );
};
export default PieChartView;

