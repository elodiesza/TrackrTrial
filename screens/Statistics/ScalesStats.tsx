import React, { Component } from 'react'
import { useState } from 'react';
import { FlatList, ScrollView, Pressable, Text, View, Dimensions } from 'react-native';
import { container, colors } from '../../styles';
import { SelectList } from 'react-native-dropdown-select-list';
import {LineChart} from "react-native-chart-kit";

const width = Dimensions.get('window').width;

const ScalesStats = ({ scales, scalerecords, times, timerecords, year, month, daysInMonth }) => {
    const [selected, setSelected] = useState('');
    const [selectedType, setSelectedType] = useState('');


    const scaleNames = new Set(scales.map(c => c.name));
    const timeNames = new Set(times.map(c => c.name));
    
    const scaleObjects = Array.from(scaleNames).map(name => ({ name, type: 'scale' }));
    const timeObjects = Array.from(timeNames).map(name => ({ name, type: 'time' }));

    const totalNames = scaleObjects.map(obj => obj.name).concat(timeObjects.map(obj => obj.name));
    const totalTypes = scaleObjects.map(obj => obj.type).concat(timeObjects.map(obj => obj.type));

    const daysArray = [...Array(daysInMonth).keys()].map(i=>i+1);
    const minvalue = scales.filter(c=>c.name==selected).map(c=>c.min)!==''?scales.filter(c=>c.name==selected).map(c=>c.min)[0]:Math.min(...scalerecords.filter(c=>(c.name==selected&&c.value!==null)).map(c=>c.value))!==undefined?Math.min(...scalerecords.filter(c=>(c.name==selected&&c.value!==null)).map(c=>c.value)):scalerecords.filter(c=>(c.name==selected&&c.value!==null)).map(c=>c.value)[0];
    const maxvalue = scales.filter(c=>c.name==selected).map(c=>c.max)!==''?scales.filter(c=>c.name==selected).map(c=>c.max)[0]:Math.max(...scalerecords.filter(c=>(c.name==selected&&c.value!==null)).map(c=>c.value))!==undefined?Math.max(...scalerecords.filter(c=>(c.name==selected&&c.value!==null)).map(c=>c.value)):scalerecords.filter(c=>(c.name==selected&&c.value!==null)).map(c=>c.value)[0];
    const mincolor = scales.filter(c=>c.name==selected).map(c=>c.mincolor)[0]==''?colors.primary.white:scales.filter(c=>c.name==selected).map(c=>c.mincolor)[0];
    const maxcolor = scales.filter(c=>c.name==selected).map(c=>c.maxcolor)[0]==''?colors.primary.white:scales.filter(c=>c.name==selected).map(c=>c.maxcolor)[0];

    const thisMonthfirstindex = selectedType=='scale'?scalerecords.filter(c=>c.name==selected).findIndex(c=>(c.year==year&&c.month==month&&c.day==1)) :
                                                      timerecords.filter(c=>c.name==selected).findIndex(c=>(c.year==year&&c.month==month&&c.day==1));

    const scalesdata = scalerecords.filter(c=>c.name==selected).map(c=>c.value);

    const timesdata = () => {
      let timesArray = [];
      for(var i=0;i<timerecords.filter(c=>c.name==selected).length;i++){
        timesArray.push((timerecords.filter(c=>c.name==selected)[i].hours==null&&timerecords.filter(c=>c.name==selected)[i].minutes==null)?null:timerecords.filter(c=>c.name==selected)[i].hours+(timerecords.filter(c=>c.name==selected)[i].minutes)/60);
      } 
      return timesArray;
    }


    const dataset = (rawdata) => {
      var firstvalueindex=0;
      while(rawdata[firstvalueindex]==null){
        firstvalueindex++;
      }
      for (let i=0; i<firstvalueindex; i++) {
        rawdata[i] = rawdata[firstvalueindex];
      }
      let newgap=false;
      for (let j=0; j<daysInMonth; j++) {
        let consecutivevalues=[];
        let consecutiveindex=[];
        for (let i=0; i<daysInMonth; i++) {
          if (rawdata[i]==null) {
            newgap=true;
            consecutivevalues.push(rawdata[i]);
            consecutiveindex.push(i);
          }
          else {
            if(consecutivevalues.length!==0) {
              break;
            }
          }
        }
        let valuebefore = rawdata[consecutiveindex[0]-1];
        let valueafter = rawdata[consecutiveindex[consecutiveindex.length-1]+1]==undefined? valuebefore : rawdata[consecutiveindex[consecutiveindex.length-1]+1];
        let increment = (valueafter-valuebefore)/(consecutiveindex.length+1);
        for (var i=0;i<consecutiveindex.length;i++){
          rawdata[consecutiveindex[i]]=(increment*(i+1)+valuebefore);
        }
      }
      return rawdata;
    }


    return (
        <View style={{flex:1}}>
            <View style={[container.statTitle]}>
                <Text style={{fontSize:20}}>SCALES</Text>
            </View>
            <View style={{height:50, flex:1}}>
                <SelectList 
                    setSelected={(val) => {
                      const index = totalNames.indexOf(val);
                      setSelected(val);
                      setSelectedType(totalTypes[index]);
                    }} 
                    data={totalNames} 
                    save="value"
                    placeholder='select a state to display'
                    boxStyles={{backgroundColor:colors.primary.white, position:'absolute', width:width, height:50}}
                    dropdownStyles={{maxHeight:200,backgroundColor:colors.primary.white, marginTop: 50, position:'absolute', width:width}}
                /> 
            </View>
            <View style={[container.body,{width:width,flexDirection:'row', justifyContent:'center', alignItems:'center'}]}>
              {selected!=='' && 
                <LineChart
                    data={{
                        labels: daysArray,
                        datasets: [
                          {
                            data: dataset(selectedType=='scale'?scalesdata:timesdata()).slice(thisMonthfirstindex,thisMonthfirstindex+daysInMonth),
                            color: (opacity = 1) => colors.primary.black, 
                          },
                          {
                            data: selectedType=='scale'?[...Array(daysInMonth).keys()].map(i=>minvalue):[...Array(daysInMonth).keys()].map(i=>0),
                            color: (opacity = 1) => mincolor, 
                          },
                          {
                            data: selectedType=='scale'?[...Array(daysInMonth).keys()].map(i=>maxvalue):[...Array(daysInMonth).keys()].map(i=>24),
                            color: (opacity = 1) => maxcolor, 
                          }
                        ]
                    }}
                    width={width}
                    height={220}
                    yAxisSuffix={selectedType=='time'?':00':''}
                    chartConfig={{
                    backgroundColor: colors.primary.white,
                    backgroundGradientFrom: colors.primary.white,
                    backgroundGradientTo: colors.primary.white,
                    decimalPlaces: 0, 
                    color: (opacity = 1) => colors.primary.white,
                    labelColor: (opacity = 1) => colors.primary.black,
                    propsForDots: {
                        r: "0",
                        strokeWidth: "1",
                        stroke: colors.primary.gray
                    },
                    propsForBackgroundLines: {
                      strokeWidth: 0
                    },
                    propsForLabels: {
                      fontSize: 8,
                    },
                    strokeWidth: 1,
                    }}
                    bezier
                /> }
            </View>
            <View style={{flex:1}}/>
        </View>
    );
};
export default ScalesStats;
