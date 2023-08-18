import { View, SafeAreaView, Pressable, Text, Modal, TouchableWithoutFeedback, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Color from '../../components/Color';

const DeleteDB = ({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
    statuslist, setStatuslist, statusrecords, setStatusrecords}) => {

    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};


    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'Delete databases'}/>
            <View style={container.body}>
                <Pressable style={container.setting}>
                    <Ionicons name="sync" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Habits</Text>
                    <Color color={habits.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>
                        db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statusrecords', null,
                        (txObj, resultSet) => setStatusrecords([]),
                        (txObj, error) => console.log('error selecting status records')
                        )})}>
                    <Entypo name="progress-full" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Status records</Text>
                    <Color color={statusrecords.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Button title={'delete staterecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS staterecords', null,
        (txObj, resultSet) => setStaterecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
      <Button title={'delete scalerecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS scalerecords', null,
        (txObj, resultSet) => setScalerecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
      <Button title={'delete states'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS states', null,
        (txObj, resultSet) => setStaterecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
      <Button title={'delete scales'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS scales', null,
        (txObj, resultSet) => setScales([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/> 
      <Button title={'delete times'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS times', null,
        (txObj, resultSet) => setTimes([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/> 
     <Button title={'delete timerecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS timerecords', null,
        (txObj, resultSet) => setTimerecords([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/> 

    <Button title={'delete habits'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS habits', null,
        (txObj, resultSet) => setHabits([]),
        (txObj, error) => console.log('error selecting habits')
      );
    })}/>    
    <Button title={'delete tasks'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tasks', null,
        (txObj, resultSet) => setTasks([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    })}/>
        <Button title={'delete tracks'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS tracks', null,
        (txObj, resultSet) => setTracks([]),
        (txObj, error) => console.log('error selecting tracks')
      );
    })}/>
      
    <Button title={'delete logs'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS logs', null,
        (txObj, resultSet) => setLogs([]),
        (txObj, error) => console.log('error selecting logs')
      );
    })}/>
            <Button title={'delete sleep'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS sleep', null,
        (txObj, resultSet) => setSleep([]),
        (txObj, error) => console.log('error selecting sleep')
      );
    })}/>
    <Button title={'delete diary'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS diary', null,
        (txObj, resultSet) => setDiary([]),
        (txObj, error) => console.log('error selecting diary')
      );
    })}/>  
        <Button title={'delete stickerrecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS stickerrecords', null,
        (txObj, resultSet) => setStickerrecords([]),
        (txObj, error) => console.log('error selecting stickerrecords')
      );
    })}/>       
        <Button title={'delete moods'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS moods', null,
        (txObj, resultSet) => setMoods([]),
        (txObj, error) => console.log('error selecting moods')
      );
    })}/> 
        <Button title={'delete weather'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS weather', null,
        (txObj, resultSet) => setWeather([]),
        (txObj, error) => console.log('error selecting weather')
      );
    })}/>  
               <Button title={'delete analytics'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS analytics', null,
        (txObj, resultSet) => setAnalytics([]),
        (txObj, error) => console.log('error selecting analytics')
      );
    })}/>  
                <Button title={'delete statuslist'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statuslist', null,
        (txObj, resultSet) => setStatuslist([]),
        (txObj, error) => console.log('error selecting status list')
      );
    })}/> 
        <Button title={'delete statusrecords'} onPress={()=>db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS statusrecords', null,
        (txObj, resultSet) => setStatusrecords([]),
        (txObj, error) => console.log('error selecting status records')
      );
    })}/>  

            </View>
        </SafeAreaView>
     
    );
};
    
export default DeleteDB;