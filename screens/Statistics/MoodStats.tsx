import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { container } from '../../styles';
import MoodPie from '../../components/MoodPie';

const width = Dimensions.get('window').width;

const StatsHome = ({ moods, daysInMonth }) => {
    const moodCounts = [{"mood":"productive", "count":0},{"mood":"happy", "count":0},{"mood":"sick", "count":0},{"mood":"stressed", "count":0},{"mood":"angry", "count":0},{"mood":"calm", "count":0},{"mood":"bored", "count":0},{"mood":"sad", "count":0}];

    if (moods.length!==0){
        for(var i=1; i<daysInMonth+1;i++){
        moods.filter(c=>c.day==i).length==0? undefined: moodCounts.filter(c=>c.mood==moods.filter(c=>c.day==i).map(c=>c.mood)[0])[0].count++;
        }
    }

  const moodColors = ['green','yellowgreen','yellow','orange','red','pink','plum','lightblue'];
  const totalCount = moodCounts.map(c=>c.count).reduce((a,b)=>a+b,0);


    return (
        <View style={[container.body,{width:width,flexDirection:'row'}]}>
            <View style={{flex:3/5}}>
                <MoodPie moods={moods} daysInMonth={daysInMonth} pieWidth={width/2}/>
            </View>
            <View style={{flex:2/5, justifyContent:'center', alignItems: 'center'}}>
                <FlatList
                    data={moodCounts}
                    renderItem={({item,index}) => 
                    <View style={{flexDirection:'row'}}>
                        <View style={{height:14,width:14, alignSelf:'center', backgroundColor:moodColors[index],borderRadius:7}}/>
                        <Text style={{fontSize: 14,width:40, margin:3, marginLeft:10, color: 'gray'}}>{totalCount==0? 0: (item.count*100/totalCount).toFixed(0)}% </Text><Text style={{fontSize: 14, margin:3}}>{item.mood}</Text>
                    </View>
                    }
                    keyExtractor={item => item.mood}
                    scrollEnabled={false}
                    contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                />
            </View>
        </View>
    );
};
export default StatsHome;
