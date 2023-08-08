import React, { Component } from 'react'
import { FlatList, ScrollView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { container } from '../../styles';
import MoodPie from '../../components/MoodPie';
import PieChartView from '../../components/PieChartView';
import {colors} from '../../styles';
import { Ionicons } from '@expo/vector-icons';

const width = Dimensions.get('window').width;

const StatsHome = ({ habits, states, scales, scalerecords, stickers, stickerrecords, sleep, staterecords, month, year, tracks, moods, daysInMonth }) => {
    console.warn(stickerrecords)

    const today=new Date();
    const thisDay= today.getDate();
    const thisMonth= today.getMonth();
    const thisYear= today.getFullYear();

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
        const meanvalue= scalerecords.length==0? 0: (scalerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.value!==null)).map(c=>c.value).reduce((a, b) => a + b) / scalerecords.filter(c=>(c.name==item&&c.year==year&&c.month==month&&c.value!==null)).map(c=>c.value).length).toFixed(0);
        return(
            <View style={{flexDirection:'row', marginVertical:2,width:width, alignItems:'center'}}>
                <View style={{width:90}}>
                    <Text style={{fontSize:10, marginHorizontal:10}}>{item}</Text>
                </View>
                <View style={{width:60,height:25,borderWidth:1,borderColor:colors.primary.black,borderRadius:5,backgroundColor:colors.primary.white,justifyContent:'center',alignItems:'center'}}>
                    <Text>{meanvalue}</Text>
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
    const greensleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.type==5)).length/sleepwidth;
    const yellowgreensleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.type==4)).length/sleepwidth;
    const yellowsleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.type==3)).length/sleepwidth;
    const orangesleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.type==2)).length/sleepwidth;
    const redsleep = sleep.filter(c=>(c.year==year&&c.month==month&&c.type==1)).length/sleepwidth;
    const firstcolor = Math.max(...sleep.filter(c=>(c.year==year&&c.month==month&&c.type!==null)).map(c=>c.type));
    const lastcolor = Math.min(...sleep.filter(c=>(c.year==year&&c.month==month&&c.type!==null)).map(c=>c.type));
    const meansleep = (sleep.filter(c=>(c.year==year&&c.month==month&&c.sleep!==null)).map(c=>c.sleep).reduce((a, b) => a + b) / sleep.filter(c=>(c.year==year&&c.month==month&&c.sleep!==null)).map(c=>c.sleep).length).toFixed(1);
    const meanwakeup = (sleep.filter(c=>(c.year==year&&c.month==month&&c.wakeup!==null)).map(c=>c.wakeup).reduce((a, b) => a + b) / sleep.filter(c=>(c.year==year&&c.month==month&&c.wakeup!==null)).map(c=>c.wakeup).length).toFixed(1);

    return (
        <View style={[container.body,{marginHorizontal:10}]}>
            <View  style={{width:'100%', height:100, alignItems:'flex-start', margin:10}}>
                <MoodPie moods={moods} year={year} month={month} daysInMonth={daysInMonth} pieWidth={width/5}/>
            </View>
            <FlatList
                data={[...new Set(states.map(c=>c.name))]}
                renderItem={({ item }) => (<PieChartView name={item} year={year} month={month} states={states} staterecords={staterecords} daysInMonth={daysInMonth} pieWidth={width/5}/>)}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{height:100}}
                horizontal
            />
            <View style={{flexDirection:'row', flex:1}}>
                <FlatList
                    data={[...new Set(habits.map(c=>c.name))]}
                    renderItem={({ item }) =>habitBar({item})}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{height:200,flex:1}}
                />
                <FlatList
                    data={[...new Set(stickers)]}
                    renderItem={({ item }) =>stickerObject({item})}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{height:200,flex:1}}
                />
            </View>
            
            <FlatList
                data={[...new Set(scales.map(c=>c.name))]}
                renderItem={({ item }) =>scaleObject({item})}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{height:200,flex:1}}
            />
            <View style={{flex:1, margin:10, right:10,flexDirection:'row',alignItems:'center', justifyContent:'center',height:50,width:'100%'}}>
                <Ionicons name="moon" size={40} color={colors.primary.defaultdark} />
                <View style={{justifyContent:'center', alignItems:'center',marginBottom:15}}>
                    <View>
                        <Text style={{fontSize:12}}>8HRS</Text>
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
