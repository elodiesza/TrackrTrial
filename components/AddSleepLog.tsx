import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import SleepColorPicker from './SleepColorPicker';
import Color from './Color';



const width = Dimensions.get('window').width;

const AddSleepLog = ({ db, sleep, setSleep, year, month, day, load, loadx}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [sleepTime,setSleepTime] = useState(new Date());
    const [wakeupTime,setWakeupTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(true);
    const [picked, setPicked] = useState<string>('white');
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('white');
    
    const sleepTypes=[{"type":1,"color":"red"},{"type":2,"color":"orange"},{"type":3,"color":"yellow"},{"type":4,"color":"yellowgreen"},{"type":5,"color":"green"}];


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

    const deleteSleepDb = () => {
        db.transaction(tx => {
          tx.executeSql('DROP TABLE IF EXISTS sleep', null,
            (txObj, resultSet) => setSleep([]),
            (txObj, error) => console.log('error deleting sleep')
          );
        });
        loadx(!load);
      }

    const addSleep = () => {
        let existingSleep = [...sleep]; 
        if (sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0) {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO sleep (sleep,wakeup,year,month,day,type) values (?,?,?,?,?,?)',[parseInt(moment(sleepTime).format("HH")),null,year,month,day,0],
                (txtObj,resultSet)=> {    
                existingSleep.push({ id: resultSet.insertId, sleep: parseInt(moment(sleepTime).format("HH")), wakeup:null, year:year, month:month, day:day, type:0 });
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
    };

    const addWakeup = () => {
        let existingSleep = [...sleep]; 
        if (sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0) {
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO sleep (sleep,wakeup,year,month,day,type) values (?,?,?,?,?,?)',[null,parseInt(moment(wakeupTime).format("HH")),year,month,day,0],
                (txtObj,resultSet)=> {    
                existingSleep.push({ id: resultSet.insertId, sleep: null, wakeup:parseInt(moment(wakeupTime).format("HH")), year:year, month:month, day:day, type:0 });
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
    };


  return (
    <SafeAreaView style={styles.container}>
        <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Pressable onPress={colorPickerVisible => setColorPickerVisible(true)} style={[styles.color, {backgroundColor: sleepTypes.filter(c=>c.type==sleep.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.type)[0]).map(c=>c.color)[0]}]}/>
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

            />
            <View style={{width:120,alignContent:'center', alignItems:'center',justifyContent:'center'}}>
                <Text>WAKE-UP TIME</Text>
                <DateTimePicker
                    value={wakeupTime}
                    mode="time"
                    display="default"
                    onChange={onChangeWakeup}
                    minuteInterval={30}
                    timeZoneOffsetInMinutes={9*60}
                    style={{marginRight:8}}
                />
                <Pressable onPress={addWakeup} style={styles.sleepSave}><Text>SAVE</Text></Pressable>
            </View>
            <View style={{width:120,alignContent:'center', alignItems:'center',justifyContent:'center'}}>
                <Text>SLEEP TIME</Text>
                <DateTimePicker
                    value={sleepTime}
                    mode="time"
                    display="default"
                    onChange={onChangeSleep}
                    minuteInterval={30}
                    timeZoneOffsetInMinutes={9*60}
                    style={{marginRight:8}}
                />
                <Pressable onPress={addSleep} style={styles.sleepSave}><Text>SAVE</Text></Pressable>
            </View>
        </View>
    </SafeAreaView>
  );
}

export default AddSleepLog;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  sleepSave: {
    width: 100,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  color: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'lightgray',
  },
});
