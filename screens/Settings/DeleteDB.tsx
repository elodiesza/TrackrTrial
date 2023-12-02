import { View, ScrollView, SafeAreaView, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons } from '@expo/vector-icons';
import Color from '../../components/Color';
import DeleteDBvalid from '../../modal/DeleteDBvalid';

const DeleteDB = ({db,
    habits, setHabits, moods, setMoods, sleep, setSleep, scalerecords, 
    setScalerecords, scales, setScales, states, setStates, staterecords, setStaterecords, 
    times, setTimes, weather, setWeather, timerecords, setTimerecords, diary, 
    setDiary, analytics, setAnalytics}) => {

    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};

      const [selectedData, setSelectedData] = useState('');
      const [deleteVisible, setDeleteVisible] = useState(false);

    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'Delete databases'}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('habits');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Habits</Text>
                    <Color color={habits.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('moods');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Moods</Text>
                    <Color color={moods.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('states');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>States</Text>
                    <Color color={states.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('staterecords');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>State records</Text>
                    <Color color={staterecords.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('scales');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Scales</Text>
                    <Color color={scales.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('scalerecords');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Scale records</Text>
                    <Color color={scalerecords.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('sleep');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Sleep Log</Text>
                    <Color color={sleep.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('times');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Times</Text>
                    <Color color={times.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('timerecords');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Time records</Text>
                    <Color color={timerecords.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('diary');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Diaries</Text>
                    <Color color={diary.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('weather');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Weather</Text>
                    <Color color={weather.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <Pressable style={container.setting} onPress={()=>{setSelectedData('analytics');setDeleteVisible(true)}}>
                    <Ionicons name="checkbox-outline" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Analytics</Text>
                    <Color color={analytics.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
                <DeleteDBvalid db={db} 
                    selectedData={selectedData}
                    habits={habits} setHabits={setHabits} 
                    moods={moods} setMoods={setMoods} 
                    sleep={sleep} setSleep={setSleep} 
                    scalerecords={scalerecords} setScalerecords={setScalerecords}
                    diary={diary} setDiary={setDiary}
                    staterecords={staterecords} setStaterecords={setStaterecords}
                    states={states} setStates={setStates}
                    times={times} setTimes={setTimes}
                    timerecords={timerecords} setTimerecords={setTimerecords}
                    scales={scales} setScales={setScales}
                    weather={weather} setWeather={setWeather}s
                    analytics={analytics} setAnalytics={setAnalytics}
                    setDeleteVisible={setDeleteVisible} deleteVisible={deleteVisible}
                />
            </ScrollView>
        </SafeAreaView>
     
    );
};
    
export default DeleteDB;