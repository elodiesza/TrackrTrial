import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import SleepColorPicker from './SleepColorPicker';
import { container,colors } from '../styles';
import uuid from 'react-native-uuid';
import { Ionicons } from '@expo/vector-icons';
import SleepTypeColors from '../constants/SleepTypeColors';

const width = Dimensions.get('window').width;

const AddSleepLog = ({ db, sleep, setSleep, year, month, day, setSleepModalVisible,sleepModalVisible}) => {

    const [sleepTime,setSleepTime] = useState(new Date(year,month-1,day,23,0,0));
    const [wakeupTime,setWakeupTime] = useState(new Date(year,month-1,day,7,0,0));
    const [showDatePicker, setShowDatePicker] = useState(true);
    const [picked, setPicked] = useState<string>('white');
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('white');
    const initialSleepTime=sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.sleep)[0];
    const initialWakeupTime=sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.wakeup)[0];
    const [sleepTimeExists, setSleepTimeExists] = useState(initialSleepTime!==undefined);
    const [wakeupTimeExists, setWakeupTimeExists] = useState(initialWakeupTime!==undefined);

    useEffect(()=>{
        setSleepTimeExists(initialSleepTime!==undefined && initialSleepTime!==null);
        setWakeupTimeExists(initialWakeupTime!==undefined && initialWakeupTime!==null);
    },[initialSleepTime,initialWakeupTime])
    

    const onChangeSleep = (event, selectedTime) => {
        const currentTime = selectedTime || sleepTime;
        setShowDatePicker(Platform.OS === 'ios');
        setSleepTime(currentTime);
    };
    const onChangeWakeup = (event, selectedTime) => {
        const currentTime = selectedTime || wakeupTime;
        setShowDatePicker(Platform.OS === 'ios');
        setWakeupTime(currentTime);
    };

    const addSleep = () => {
        let existingSleep = [...sleep]; 
        if (sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0) {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO sleep (id,sleep,wakeup,year,month,day,type) values (?,?,?,?,?,?,?)',[uuid.v4(),parseInt(moment(sleepTime).format("HH")),null,year,month,day,0],
                (txtObj,resultSet)=> {    
                existingSleep.push({ id: uuid.v4(), sleep: parseInt(moment(sleepTime).format("HH")), wakeup:null, year:year, month:month, day:day, type:0 });
                setSleep(existingSleep);
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
            });
        }
        else {
            db.transaction((tx) => {
                tx.executeSql('UPDATE sleep SET sleep=? WHERE year=? AND month=? AND day=?',[parseInt(moment(sleepTime).format("HH")),year,month,day],
                (txtObj,resultSet)=> {    
                existingSleep.filter(c=>(c.year==year && c.month==month && c.day==day))[0].sleep = parseInt(moment(sleepTime).format("HH"));
                setSleep(existingSleep);
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
            });
        }
        setSleepTimeExists(true)
    };

    const addWakeup = () => {
        let existingSleep = [...sleep]; 
        if (sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0) {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO sleep (id,sleep,wakeup,year,month,day,type) values (?,?,?,?,?,?,?)',[uuid.v4(),null,parseInt(moment(wakeupTime).format("HH")),year,month,day,0],
                (txtObj,resultSet)=> {    
                existingSleep.push({ id: uuid.v4(), sleep: null, wakeup:parseInt(moment(wakeupTime).format("HH")), year:year, month:month, day:day, type:0 });
                setSleep(existingSleep);
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
            });
        }
        else {
            db.transaction((tx) => {
                tx.executeSql('UPDATE sleep SET wakeup=? WHERE year=? AND month=? AND day=?',[parseInt(moment(wakeupTime).format("HH")),year,month,day],
                (txtObj,resultSet)=> {    
                existingSleep.filter(c=>(c.year==year && c.month==month && c.day==day))[0].wakeup = parseInt(moment(wakeupTime).format("HH"));
                setSleep(existingSleep);
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
            });
        }
        setWakeupTimeExists(true)
    };


  return (
    <SafeAreaView style={container.body}>
        <View style={{flexDirection:'row', justifyContent:'center', height:60}}>
            <SleepColorPicker
              db={db}
              selectedType={selectedType}
              colorPickerVisible={colorPickerVisible}
              setColorPickerVisible={setColorPickerVisible}
              picked={picked}
              setPicked={setPicked}
              sleep={sleep}
              setSleep={setSleep}
              year={year}
              month={month}
              day={day}
              setSleepModalVisible={setSleepModalVisible==undefined? undefined : setSleepModalVisible}
              sleepModalVisible={sleepModalVisible==undefined? undefined : setSleepModalVisible}
            />
            <View style={{marginLeft:10,width:120,alignContent:'center', alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
                <DateTimePicker
                    value={sleepTime}
                    mode="time"
                    display="default"
                    onChange={onChangeSleep}
                    minuteInterval={30}
                    style={{height:30, width:90}}
                />
                <View style={{left:-5, height:30, borderTopRightRadius:17,borderBottomRightRadius:17}}>
                    <Ionicons name="moon" size={32} color={colors.primary.default} style={{transform:[{rotate:"45deg"}],top:-1}}/>
                    <Ionicons name="moon-outline" size={36} color={colors.primary.default} style={{position:'absolute',transform:[{rotate:"45deg"}],top:-5,left:-2}}/>
                </View>
            </View>
            <Pressable onPress={colorPickerVisible => setColorPickerVisible(true)} style={[styles.color, {alignSelf:'center',
            backgroundColor: SleepTypeColors.filter(c=>c.type==sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.type)[0]).map(c=>c.color)[0],
            borderColor:SleepTypeColors.filter(c=>c.type==sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.type)[0]).map(c=>c.type)[0]==undefined?colors.primary.blue:colors.primary.gray}]}/>
            <View style={{width:90, alignContent:'center', alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
                <View style={{left:10,width:20, height:30,justifyContent:'center',paddingLeft:30}}>
                    <Ionicons name="sunny" size={60} color={colors.primary.default} style={{position:'absolute', marginLeft:-10}}/>
                    <Ionicons name="sunny-outline" size={60} color={colors.primary.blue} style={{position:'absolute', marginLeft:-8}}/>
                </View>
                <DateTimePicker
                    value={wakeupTime}
                    mode="time"
                    display="default"
                    onChange={onChangeWakeup}
                    minuteInterval={30}
                    style={{height:30, width:85, backgroundColor:colors.primary.defaultlight,borderWidth:1,borderColor:colors.primary.blue,borderRadius:10}}
                />
            </View>
        </View>
    </SafeAreaView>
  );
}

export default AddSleepLog;

const styles = StyleSheet.create({
  color: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'lightgray',
  },
});
