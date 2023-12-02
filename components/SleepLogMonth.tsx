import { FlatList, Pressable, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import moment from 'moment';  


const width = Dimensions.get('window').width;

const SleeplogMonth = ({ sleep, year, month}) => {

    const sleepTypes=[{"type":1,"color":"red"},{"type":2,"color":"orange"},{"type":3,"color":"yellow"},{"type":4,"color":"yellowgreen"},{"type":5,"color":"green"}];

    var today = new Date();
    var day = today.getDate();
    const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();


    const SleepList =(day) => {
      let thisMonthSleep = sleep.filter(c=>(c.year==year && c.month==month));

      if(thisMonthSleep.filter(c=>c.day==day.item+1).length==0 && thisMonthSleep.filter(c=>c.day==day.item+1).map(c=>c.sleep)[0]!==null && thisMonthSleep.filter(c=>c.day==day.item+1).map(c=>c.wakeup)[0]!==null){
        return(
          <View style={{flex:1, width:10, height:10*21}}/>
        )
      }
      else{
        let wakeupTime =thisMonthSleep.filter(c=>c.day==day.item+1).map(c=>c.wakeup)[0];
        let sleepTime = 24-(thisMonthSleep.filter(c=>c.day==day.item+1).map(c=>c.sleep)[0]-thisMonthSleep.filter(c=>c.day==day.item+1).map(c=>c.wakeup)[0]);     
        return(
          <View style={{flex:1, width:10, height:10*sleepTime, bottom:-(10-wakeupTime)*10, backgroundColor: sleep.filter(c=>(c.year==year && c.month==month && c.day==day.item+1)).map(c=>c.type)==0? 'paleturquoise': sleepTypes.filter(c=>c.type==sleep.filter(c=>(c.year==year && c.month==month && c.day==day.item+1)).map(c=>c.type)[0]).map(c=>c.color)[0]}}/>
        )
      }
    };

    const HorizontalAxisGraduation =(day) => {
      return(
        <View style={{width:10}}>
          <View style={{width:10, height:3, borderRightWidth:1}}/>
          <View style={{width:10, height:17}}><Text style={{fontSize:6,textAlign:'center'}}>{day.item+1}</Text></View>
        </View>
      )
    };

    const VerticalAxisGraduation =(time) => {
      return(
        <View style={{flexDirection:'row',width:20}}>
          <View style={{width:17}}><Text style={{fontSize:6,textAlign:'right'}}>{time.item}</Text></View>
          <View style={{flex:1, height:10, width:3, borderTopWidth:1}}/>
        </View>
      )
    };

  return (
    <View style={styles.container}>
        <View style={styles.sleeplogContainer}>
          <View style={{width:210,height:20,justifyContent:'center',alignItems:'center', bottom: -95, left:-110,transform:[{rotate:"-90deg"}]}}>
            <Text>Sleep Time</Text>
          </View>
          <View style={{height:21*10, bottom:1, width:20, left:-200}}>
            <FlatList
              data={["7PM","8PM","9PM","10PM","11PM","12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","1A0M","11AM","12PM","1PM","2PM","3PM"]}
              renderItem={(item)=>VerticalAxisGraduation(item)}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
          <View style={{left:-200}}>
            <View style={[styles.sleeplogTable,{ width: DaysInMonth(year,month)*10}]}>
              <FlatList
                data={Array.from(Array(DaysInMonth(year,month)).keys())}
                renderItem={(item)=>SleepList(item)}
                keyExtractor={(_, index) => index.toString()}
                horizontal={true}
                scrollEnabled={false}
              />
              <View pointerEvents="none" style={{position:'absolute',width:'100%',height:10*16,borderTopWidth:1,borderTopColor:'lightgray',bottom:0}}/>
            </View>
            <View style={{width:DaysInMonth(year,month)*10, height:10}}>
              <FlatList
                data={Array.from(Array(DaysInMonth(year,month)).keys())}
                renderItem={(item)=>HorizontalAxisGraduation(item)}
                keyExtractor={(_, index) => index.toString()}
                horizontal={true}
                scrollEnabled={false}
                contentContainerStyle={{paddingLeft:2}}
              />
            </View>
            <View style={{height:20, width:'100%', justifyContent:'center', alignItems:'center'}}>
                <Text>Day of the Month</Text>
            </View>
          </View>
        </View>
    </View>
  );
}

export default SleeplogMonth;

const styles = StyleSheet.create({
  container: {
    flex:1,
    width: width,
    height: 300,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleeplogTable: {
    flex:1,
    height: 21*10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    backgroundColor: 'white',
  },
  sleeplogContainer: {
    height: 240,
    width: '80%',
    flexDirection: 'row',
  }
});
