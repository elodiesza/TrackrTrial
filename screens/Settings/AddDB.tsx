import { View, SafeAreaView, Pressable, Text, Modal, TouchableWithoutFeedback, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Entypo } from '@expo/vector-icons';
import Color from '../../components/Color';


const AddDB = ({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
    statuslist, setStatuslist, statusrecords, setStatusrecords}) => {

    const navigation = useNavigation();
    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};


    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'Add database from an excel file'}/>
            <View style={container.body}>
                <Pressable style={container.setting}>
                    <Entypo name="progress-full" size={25}/>
                    <Text style={{marginLeft:10, flex:1}}>Status records</Text>
                    <Color color={statusrecords.length==0?colors.primary.white:colors.primary.blue}/>
                </Pressable>
            </View>
        </SafeAreaView>
     
    );
};
    
export default AddDB;