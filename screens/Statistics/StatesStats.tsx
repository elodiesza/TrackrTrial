import React, { Component } from 'react'
import { useState } from 'react';
import { FlatList, ScrollView, Pressable, Text, View, Dimensions } from 'react-native';
import { container, colors } from '../../styles';
import BigPie from '../../components/BigPie';
import { SelectList } from 'react-native-dropdown-select-list';

const width = Dimensions.get('window').width;

const StatesStats = ({ moods, states, staterecords, year, month, daysInMonth }) => {
    const moodCounts = [{"item":"productive", "count":0},{"item":"happy", "count":0},{"item":"sick", "count":0},{"item":"stressed", "count":0},{"item":"angry", "count":0},{"item":"calm", "count":0},{"item":"bored", "count":0},{"item":"sad", "count":0}];
    const [selected, setSelected] = useState('');
    if (moods.length!==0){
        for(var i=1; i<daysInMonth+1;i++){
        moods.filter(c=>c.day==i).length==0? undefined: moodCounts.filter(c=>c.item==moods.filter(c=>c.day==i).map(c=>c.mood)[0])[0].count++;
        }
    }
    const stateCounts = (name) => {
        let thisNameStates = [... new Set(states.filter(c=>(c.name==name)).map(c=>c.item))];
        let counts = [];
        for(var i=0 ; i<thisNameStates.length; i++){
            let thisItemcount = staterecords.filter(c=>(c.name==name && c.item==thisNameStates[i]&&c.year==year&&c.month==month)).length;
            counts.push({"item":thisNameStates[i],"count":thisItemcount})
        }
        return counts;
    }

    const totalStatesNames = ["MOOD",...new Set(states.map(c=>c.name))];
    const moodColors = [colors.primary.green,colors.primary.yellowgreen,colors.primary.yellow,colors.primary.orange,colors.primary.red,colors.primary.pink,colors.primary.purple,colors.primary.lightblue];

    return (
        <View style={{flex:1}}>
            <View style={[container.statTitle]}>
                <Text style={{fontSize:20}}>STATES</Text>
            </View>
            <View style={{height:50, flex:1}}>
                <SelectList 
                    setSelected={(val) => setSelected(val)} 
                    data={totalStatesNames} 
                    save="value"
                    placeholder='select a state to display'
                    boxStyles={{backgroundColor:colors.primary.white, position:'absolute', width:width, height:50}}
                    dropdownStyles={{maxHeight:200,backgroundColor:colors.primary.white, marginTop: 50, position:'absolute', width:width}}
                /> 
            </View>
            <View style={[container.body,{width:width,flexDirection:'row'}]}>
                <View style={{flex:3/5}}>
                    <BigPie data={selected=="MOOD"?moodCounts:stateCounts(selected)} name={selected} states={states} year={year} month={month} daysInMonth={daysInMonth} pieWidth={width/2}/>
                </View>
                <View style={{flex:2/5, justifyContent:'center', alignItems: 'center'}}>
                    <FlatList
                        data={selected=="MOOD"?moodCounts:states.filter(c=>(c.name==selected)).map(c=>c.item)}
                        renderItem={({item,index}) => 
                        <View style={{flexDirection:'row'}}>
                            <View style={{height:14,width:14, alignSelf:'center', 
                            backgroundColor:selected=="MOOD"?moodColors[index]:states.filter(c=>(c.name==selected&&c.item==item)).map(c=>c.color)[0],borderRadius:7}}/>
                            <Text style={{fontSize: 14,width:40, margin:3, marginLeft:10, color: 'gray'}}>
                                {selected=="MOOD"? (moodCounts.map(c=>c.count).reduce((a,b)=>a+b,0)==0? 0:
                                 (item.count*100/moodCounts.map(c=>c.count).reduce((a,b)=>a+b,0)).toFixed(0)) :
                                 stateCounts(selected).map(c=>c.count).reduce((a,b)=>a+b,0)==0? 0:
                                 (stateCounts(selected).filter(c=>c.item==item).map(c=>c.count)*100/stateCounts(selected).map(c=>c.count).reduce((a,b)=>a+b,0)).toFixed(0)}%
                            </Text>
                            <Text style={{fontSize: 14, margin:3}}>{selected=="MOOD"?item.item:item}</Text>
                        </View>
                        }
                        keyExtractor={item => item.mood}
                        scrollEnabled={false}
                        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
                    />
                </View>
            </View>
            <View style={{flex:1}}/>
        </View>
    );
};
export default StatesStats;
