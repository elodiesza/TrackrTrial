import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { colors } from '../../styles';

const width = Dimensions.get('window').width;

const HabitsStats = ({ habits, month, year, tracks }) => {

    const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

    const IndList = ({item}) => {
        let gauge=0;
        if(habits.filter(c=>(c.name==item.name && c.month==month && c.year==year)).length==DaysInMonth(year,month)){
          for (var i=0;i<DaysInMonth(year,month);i++){
            gauge = gauge + habits.filter(c=>(c.name==item.name && c.month==month && c.year==year)).map(c=>c.state)[i];
          }
          gauge=gauge/DaysInMonth(year,month);
        }
        let lastMonthGauge=0;
        if (habits.filter(c=>(c.name==item.name && c.month==month-1 && c.year==year)).length>0){
          for (var i=0;i<DaysInMonth(year,month-1);i++){
            lastMonthGauge = lastMonthGauge + habits.filter(c=>(c.name==item.name && c.month==month-1 && c.year==year)).map(c=>c.state)[i];
          }
          lastMonthGauge=lastMonthGauge/DaysInMonth(year,month-1);
        }
        let progress=(gauge-lastMonthGauge)*100;
        return(
          <View style={{width:width}}>
            <View style={{flex:1, width: width, height:40, justifyContent:'center', backgroundColor: tracks.filter(c=>c.id==item.track).length>0?tracks.filter(c=>c.id==item.track).map(c=>c.color)[0]:colors.default, opacity:0.2}}/>
            <View style={{flex:1, width: gauge=="NaN"? 0:width*gauge, height:40, justifyContent:'center',position:'absolute', backgroundColor: tracks.filter(c=>c.id==item.track).length>0?tracks.filter(c=>c.id==item.track).map(c=>c.color)[0]:colors.default, opacity:0.7}}/>
            <View style={{flex:1, flexDirection:'row', width: width, height:40, justifyContent:'center',position:'absolute'}}>
              <View style={{flex:9, justifyContent:'center'}}>
                <Text style={{textAlignVertical:'center', left:20}}>
                  {item.name}
                </Text>
              </View>
              <View style={{flex:1, justifyContent:'center'}}>
                <Text style={{textAlignVertical:'center',textAlign:'right',right:10, color: lastMonthGauge.toString()=='NaN'?'black':((progress<1 && progress>-1)? 'black': progress>0? 'green':'red')}}>
                  {lastMonthGauge.toString()=='NaN'?'':((progress<0 && progress>-1)? "0%": progress>1? "+"+progress.toFixed(0)+"%":progress.toFixed(0)+"%")}
                </Text>
              </View>
            </View>
          </View>
        );
      };

  return (
    <View style={{ flex: 1, width:width }}>
        <View style={{flex:1,height:400}}>
            <FlatList
                data={habits.filter(c=>(c.day==1 && c.month==month && c.year==year))}
                renderItem={(item)=>IndList(item)}
                keyExtractor={(_, index) => index.toString()}
                scrollEnabled={false}
            />
        </View>
    </View>
  );
};
export default HabitsStats;

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
