import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { container } from '../../styles';
import MoodPie from '../../components/BigPie';
import PieChartView from '../../components/PieChartView';
import {colors} from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

const StatsHome = ({ habits, states, scales, scalerecords, stickers, stickerrecords, sleep, staterecords, month, year, tracks, moods, daysInMonth, times, timerecords }) => {

    const today=new Date();
    const thisDay= today.getDate();
    const thisMonth= today.getMonth();
    const thisYear= today.getFullYear();

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)]
         : null;
      }
      function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
        var channelA = colorChannelA*amountToMix;
        var channelB = colorChannelB*(1-amountToMix);
        return parseInt(channelA+channelB);
      }
      function colorMixer(rgbA, rgbB, amountToMix){
        var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
        var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
        var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
        return "rgb("+r+","+g+","+b+")";
      }

    const habitBar = ({item}) => { 
        const habitsPercentage = () => {
            let gauge=0;
            for(let i=1; i<((year==thisYear&&month==thisMonth)?thisDay:daysInMonth)+1; i++){
                habits.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.day==i)).map(c=>c.state)[0]==1?gauge++:undefined;
            }
            return gauge/((year==thisYear&&month==thisMonth)?thisDay:daysInMonth);
        }
        return(
            <View style={{flexDirection:'row', marginVertical:2,width:width}}>
                <View style={{width:90, justifyContent:'center', marginLeft:10}}>
                    <Text style={{fontSize:10}}>{item}</Text>
                </View>
                <View style={{width:90,height:18,borderRadius:5, borderWidth:1, borderColor:colors.primary.black, backgroundColor:colors.primary.white}}>
                    <View style={{width:98*habitsPercentage(),height:16,backgroundColor:colors.primary.tungstene,borderRadius:4}} />
                </View>
            </View>
        );
    }
    const scaleObject = ({item}) => { 

        const meanvalue= (scalerecords.filter(c=>(c.year==year&&c.month==month)).length==0)? 0: scalerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.value!==null)).length==0? 0: (scalerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.value!==null)).map(c=>c.value).reduce((a, b) => a + b) / scalerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.value!==null)).map(c=>c.value).length).toFixed(0);
        const mincolor = scales.filter(c=>c.name==item).map(c=>c.mincolor)[0]==null? [255,255,255]: hexToRgb(scales.filter(c=>c.name==item).map(c=>c.mincolor)[0]);
        const maxcolor = scales.filter(c=>c.name==item).map(c=>c.maxcolor)[0]==null? [255,255,255]: hexToRgb(scales.filter(c=>c.name==item).map(c=>c.maxcolor)[0]);
        const minvalue = scales.filter(c=>c.name==item).map(c=>c.min)[0]==null?Math.min(...scalerecords.filter(c=>(c.name==item && c.value!==null)).map(c=>c.value)):scales.filter(c=>c.name==item).map(c=>c.min)[0];
        const maxvalue = scales.filter(c=>c.name==item).map(c=>c.max)[0]==null?Math.max(...scalerecords.filter(c=>(c.name==item && c.value!==null)).map(c=>c.value)):scales.filter(c=>c.name==item).map(c=>c.max)[0];
        const amountomix = maxvalue==minvalue? 0.5:((maxvalue-meanvalue)/(maxvalue-minvalue)).toFixed(2);
        const colormix = mincolor!==null && maxcolor!==null?colorMixer(mincolor,maxcolor,amountomix):colors.primary.white;
        
        return(
            <View style={{flexDirection:'row', marginVertical:2,width:width, alignItems:'center'}}>
                <View style={{width:90}}>
                    <Text style={{fontSize:10, marginHorizontal:10}}>{item}</Text>
                </View>
                <View style={{width:60,height:25,borderWidth:1,borderColor:colors.primary.black,borderRadius:5,backgroundColor:colormix,justifyContent:'center',alignItems:'center'}}>
                    <Text>{meanvalue}</Text>
                </View>
                <View>
                    <Text style={{fontSize:10, marginHorizontal:10}}>{scales.filter(c=>c.name==item).map(c=>c.unit)[0]}</Text>
                </View>
            </View>
        );
    }
    const timeObject = ({item}) => { 
        const totalhours= timerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month)).map(c=>c.hours*60).reduce((a, b) => a + b)
        const totalminutes = timerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month)).map(c=>c.minutes).reduce((a, b) => a + b)
        const meanvalue = (timerecords.filter(c=>(c.year==year&&c.month==month)).length==0)? 0: 
        timerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.hours!==null &&c.minutes!==null)).length==0? 0: 
        ((totalhours+totalminutes) / timerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.hours!==null&&c.minutes!==null)).length).toFixed(0);
        const mincolor = times.filter(c=>c.name==item).map(c=>c.mincolor)[0]==null? [255,255,255]: hexToRgb(times.filter(c=>c.name==item).map(c=>c.mincolor)[0]);
        const maxcolor = times.filter(c=>c.name==item).map(c=>c.maxcolor)[0]==null? [255,255,255]: hexToRgb(times.filter(c=>c.name==item).map(c=>c.maxcolor)[0]);
        const minhoursvalue = Math.min(...timerecords.filter(c=>(c.name==item && c.hours!==null)).map(c=>c.hours))*60;
        const maxhoursvalue = Math.max(...timerecords.filter(c=>(c.name==item && c.hours!==null)).map(c=>c.hours))*60;
        const minminutesvalue = Math.min(...timerecords.filter(c=>(c.name==item && c.hours!==null)).map(c=>c.minutes));
        const maxminutesvalue = Math.max(...timerecords.filter(c=>(c.name==item && c.hours!==null)).map(c=>c.minutes));
        const minvalue = minhoursvalue+minminutesvalue;
        const maxvalue = maxhoursvalue+maxminutesvalue;

        const amountomix = maxvalue==minvalue? 0.5:(maxvalue-meanvalue)/(maxvalue-minvalue);
        const colormix = mincolor!==null && maxcolor!==null?colorMixer(mincolor,maxcolor,amountomix):colors.primary.white;
        
        return(
            <View style={{flexDirection:'row', marginVertical:2,width:width, alignItems:'center'}}>
                <View style={{width:90}}>
                    <Text style={{fontSize:10, marginHorizontal:10}}>{item}</Text>
                </View>
                <View style={{width:60,height:25,borderWidth:1,borderColor:colors.primary.black,borderRadius:5,backgroundColor:colormix,justifyContent:'center',alignItems:'center'}}>
                    <Text>{Math.floor(meanvalue/60)}:{(meanvalue-Math.floor(meanvalue/60)*60)<10? ((meanvalue-Math.floor(meanvalue/60)*60)==0? "00" : "0"+(meanvalue-Math.floor(meanvalue/60)*60)):meanvalue-Math.floor(meanvalue/60)*60}</Text>
                </View>
                <View>
                    <Text style={{fontSize:10, marginHorizontal:10}}>{scales.filter(c=>c.name==item).map(c=>c.unit)[0]}</Text>
                </View>
            </View>
        );
    }
    const stickerObject = ({item}) => {
        const stickerCount= stickerrecords.filter(c=>(c.name==item.name&&c.year==year&&c.month==month&&c.state==true)).length;
        return(
            <View style={{width:250,flexDirection:'row', alignItems:'center'}}>
                <View style={{}}>
                    <View style={{position:'absolute'}}>
                        <Ionicons name={item.icon} size={30} color={item.color}/>
                    </View>
                    <Ionicons name={item.icon+'-outline'} size={30} color={colors.primary.black}/>
                </View>
                <Text style={{fontSize:10, marginHorizontal:10}}>{stickerCount}</Text>
                <Text style={{fontSize:10, marginHorizontal:10}}>{item.name}</Text>
            </View>
        );
    };

    //Sleep gauges
    const sleepwidth = sleep.filter(c=>(c.year==year&&c.month==month&&c.type!==null)).length;
    const greensleep = sleepwidth==0? 0: sleep.filter(c=>(c.year==year&&c.month==month&&c.type==5)).length/sleepwidth;
    const yellowgreensleep = sleepwidth==0? 0: sleep.filter(c=>(c.year==year&&c.month==month&&c.type==4)).length/sleepwidth;
    const yellowsleep = sleepwidth==0? 0: sleep.filter(c=>(c.year==year&&c.month==month&&c.type==3)).length/sleepwidth;
    const orangesleep = sleepwidth==0? 0: sleep.filter(c=>(c.year==year&&c.month==month&&c.type==2)).length/sleepwidth;
    const redsleep = sleepwidth==0? 0: sleep.filter(c=>(c.year==year&&c.month==month&&c.type==1)).length/sleepwidth;
    const firstcolor = Math.max(...sleep.filter(c=>(c.year==year&&c.month==month&&c.type!==null)).map(c=>c.type));
    const lastcolor = Math.min(...sleep.filter(c=>(c.year==year&&c.month==month&&c.type!==null&&c.type!==0)).map(c=>c.type));
    const meansleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.sleep!==null)).length==0? undefined: (sleep.filter(c=>(c.year==year&&c.month==month&&c.sleep!==null)).map(c=>c.sleep).reduce((a, b) => a + b) / sleep.filter(c=>(c.year==year&&c.month==month&&c.sleep!==null)).map(c=>c.sleep).length).toFixed(1);
    const meanwakeup = sleep.filter(c=>(c.year==year&&c.month==month&&c.wakeup!==null)).length==0? undefined:(sleep.filter(c=>(c.year==year&&c.month==month&&c.wakeup!==null)).map(c=>c.wakeup).reduce((a, b) => a + b) / sleep.filter(c=>(c.year==year&&c.month==month&&c.wakeup!==null)).map(c=>c.wakeup).length).toFixed(1);
    const meanSleepTime = () => {
        let allSleeps = [];
        for (let i=1;i<daysInMonth+1;i++){
            let goSleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.day==i)).map(c=>c.sleep)[0];
            let wakeUp = sleep.filter(c=>(c.year==year&&c.month==month&&c.day==i)).map(c=>c.wakeup)[0];
            let sleepTime = goSleep==undefined||wakeUp==undefined?undefined:goSleep<wakeUp? wakeUp-goSleep:24-goSleep+wakeUp;
            sleepTime==undefined?undefined:allSleeps.push(sleepTime);
        }
        return allSleeps.length==0?undefined:(allSleeps.reduce((a, b) => a + b) / allSleeps.length).toFixed(1);
        
    }

    return (
        <View style={[container.body,{marginHorizontal:10}]}>
            <View  style={{width:'100%', height:100, alignItems:'flex-start', margin:10}}>
                <MoodPie moods={moods} year={year} month={month} daysInMonth={daysInMonth} pieWidth={width/5}/>
            </View>
            <View>
                <FlatList
                    data={[...new Set(states.map(c=>c.name))]}
                    renderItem={({ item }) => (<PieChartView name={item} year={year} month={month} states={states} staterecords={staterecords} daysInMonth={daysInMonth} pieWidth={width/5}/>)}
                    keyExtractor={states.id}
                    contentContainerStyle={{height:100}}
                    horizontal
                />
            </View>
            <View style={{flexDirection:'row', flex:1}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={[...new Set(habits.map(c=>c.name))]}
                        renderItem={({ item }) =>habitBar({item})}
                        keyExtractor={habits.id}
                        contentContainerStyle={{flex:1}}
                    />
                </ScrollView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={[...new Set(stickers)]}
                        renderItem={({ item }) =>stickerObject({item})}
                        keyExtractor={stickers.id}
                        contentContainerStyle={{flex:1}}
                    />
                </ScrollView>
            </View>
            <View style={{flex:1,flexDirection:'row', marginTop:10}}>
                <View style={{flex:3}}>
                    <FlatList
                        data={[...new Set(scales.map(c=>c.name))]}
                        renderItem={({ item }) =>scaleObject({item})}
                        keyExtractor={scales.id}
                        contentContainerStyle={{height:200,flex:2}}
                    /> 
                </View>
                <View style={{flex:2}}>
                    <FlatList
                    data={[...new Set(times.map(c=>c.name))]}
                    renderItem={({ item }) =>timeObject({item})}
                    keyExtractor={times.id}
                    contentContainerStyle={{height:200,flex:1}}
                    />
                </View>
            </View>
            <View style={{flex:1, margin:10, right:10,flexDirection:'row',alignItems:'center', justifyContent:'center',height:50,width:'100%'}}>
                <Ionicons name="moon" size={40} color={colors.primary.defaultdark} />
                <View style={{justifyContent:'center', alignItems:'center',marginBottom:15}}>
                    <View>
                        <Text style={{fontSize:12}}>{meanSleepTime()} HRS</Text>
                    </View>
                    <View style={{flexDirection:'row', marginLeft:10, marginVertical:5}}>
                        <View style={{marginHorizontal:10}}><Text>{meanwakeup}</Text></View>
                        <View style={{backgroundColor:colors.primary.green,height:20,borderTopLeftRadius:5,borderBottomLeftRadius:5,borderTopRightRadius:lastcolor==5?5:0,borderBottomRightRadius:lastcolor==5?5:0,width:200*greensleep}}/>
                        <View style={{backgroundColor:colors.primary.yellowgreen,height:20,borderTopLeftRadius:firstcolor==4?5:0,borderBottomLeftRadius:firstcolor==4?5:0,borderTopRightRadius:lastcolor==4?5:0,borderBottomRightRadius:lastcolor==4?5:0,width:200*yellowgreensleep}}/>
                        <View style={{backgroundColor:colors.primary.yellow,height:20,borderTopLeftRadius:firstcolor==3?5:0,borderBottomLeftRadius:firstcolor==3?5:0,borderTopRightRadius:lastcolor==3?5:0,borderBottomRightRadius:lastcolor==3?5:0,width:200*yellowsleep}}/>
                        <View style={{backgroundColor:colors.primary.orange,height:20,borderTopLeftRadius:firstcolor==2?5:0,borderBottomLeftRadius:firstcolor==2?5:0,borderTopRightRadius:lastcolor==2?5:0,borderBottomRightRadius:lastcolor==2?5:0,width:200*orangesleep}}/>
                        <View style={{backgroundColor:colors.primary.red,height:20,borderTopLeftRadius:firstcolor==1?5:0,borderBottomLeftRadius:firstcolor==1?5:0,borderTopRightRadius:5,borderBottomRightRadius:5,width:200*redsleep}}/>
                        <View style={{marginHorizontal:10}}><Text>{meansleep}</Text></View>
                    </View>
                </View>
            </View> 
        </View>
    );
};
export default StatsHome;
