import React from 'react';
import Color from './Color';
import { View, StyleSheet, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, FlatList } from 'react-native';
import SleepTypes from '../constants/SleepTypeColors';
import uuid from 'react-native-uuid';

const SleepColorPicker = ( {db, selectedType, colorPickerVisible, setColorPickerVisible,picked,setPicked,sleep,setSleep,year,month,day,setSleepModalVisible,sleepModalVisible}) => {
 
  const SleepType = (item) => (
    <TouchableOpacity onPress={()=>{addSleepType(item)}}>
      <Color color={item.item} />
    </TouchableOpacity>
  );

  const addSleepType = (item) => {
    let existingSleep = [...sleep];
    let pickedType = SleepTypes.filter(c=>c.color==item.item).map(c=>c.type)[0];
    setPicked(item.color);  
    if (sleep.filter((c) => c.year == year && c.month == month && c.day == day).length == 0) {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO sleep (id,sleep, wakeup, year, month, day, type) values (?,?,?,?,?,?,?)',
          [ uuid.v4(),null, null, year, month, day, pickedType],
          (txtObj, resultSet) => {
            existingSleep.push({
              id: uuid.v4(),
              sleep: null,
              wakeup: null,
              year: year,
              month: month,
              day: day,
              type: pickedType,
            });
            setSleep(existingSleep);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
    } else {
      db.transaction((tx) => {
        tx.executeSql('UPDATE sleep SET type=? WHERE year=? AND month=? AND day=?',[pickedType,year,month,day],
          (txtObj,resultSet)=> {    
            existingSleep.filter(c=>(c.year==year && c.month==month && c.day==day))[0].type = pickedType;
            setSleep(existingSleep);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
    }
    setColorPickerVisible(!colorPickerVisible);
    setSleepModalVisible==undefined? undefined : setSleepModalVisible(false);
  };

    return (
        <Modal
              animationType="slide"
              transparent={true}
              visible={colorPickerVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setColorPickerVisible(!colorPickerVisible);
              }}
            >
              <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setColorPickerVisible(!colorPickerVisible)}} activeOpacity={1}>
                <TouchableWithoutFeedback>
                  <View style={styles.colorPicker}>
                    <FlatList data={SleepTypes.map(c=>c.color)} renderItem={SleepType} horizontal={true}/>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
    );
};

const styles = StyleSheet.create({
    colorPicker: {
        flex: 1, 
        position: 'absolute',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 20,
        paddingHorizontal: 10,
        padding: 15,
      }
});

export default SleepColorPicker;