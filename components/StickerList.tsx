import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {colors,container} from '../styles.js';
import uuid from 'react-native-uuid';
import UpdateHabit from '../modal/UpdateHabit';

const width = Dimensions.get('window').width;

const StickerList = ({ db, habits, setHabits, year, month, day, load, loadx}) => {

  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const updateSticker = (name) => {
    const existingrecords = [...habits];
    let currentState=habits.filter(c=>(c.productive==false && c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.state)[0];
    if (habits.filter(c=>(c.productive==false && c.year==year&&c.month==month&&c.day==day&&c.name==name)).length==0){
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO habits (id, name, year, month, day, state) VALUES (?, ?, ?, ?, ?, ?)',
          [ uuid.v4(), name, year, month, day, true],
          (txtObj, stateResultSet) => {
            existingrecords.push({id:uuid.v4(), name:name, year:year, month:month, day:day, state:true});
            setHabits(existingrecords);
          }
        );
      });
    }
    else {
      let stickerId = existingrecords.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
      let stickerIndex = existingrecords.findIndex(c => c.id === stickerId);
      db.transaction(tx=> {
          tx.executeSql('UPDATE habits SET state = ? WHERE id= ?', [!currentState, stickerId],
              (txObj, resultSet) => {
                existingrecords[stickerIndex].state = !currentState;
                setHabits(existingrecords);
                currentState = !currentState;
              },
              (txObj, error) => console.log('Error updating data', error)
          );
      });
    }
    
  };

  return (
    <View style={[container.body,{height:30,width:'100%',alignItems:'flex-start'}]}>
      <FlatList
        data={habits.filter(c=>(c.productive==false && c.year==year&&c.month==month&&c.day==day))}
        renderItem={({item}) =>(
          <TouchableOpacity onPress={()=>updateSticker(item.name)} onLongPress={()=>{setSelectedHabit(item.name);setChangeModalVisible(true);}} style={{marginHorizontal:5}}>
            <View style={{position:'absolute'}}>
              <Ionicons name={item.icon} size={30} color={item.state==true?item.color:'transparent'}/>
            </View>
            <Ionicons name={item.icon+'-outline'} size={30} color={item.state==true?colors.primary.black:colors.primary.blue}/>
          </TouchableOpacity> 
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={true}
      />
      <UpdateHabit
            changeModalVisible={changeModalVisible}
            setChangeModalVisible={setChangeModalVisible}
            db={db}
            data={habits.filter(c=>(c.name==selectedHabit))[0]}
            type={'habit'}
            update={habits}
            setUpdate={setHabits}
            update2={undefined}
            setUpdate2={undefined}
            load={load}
            loadx={loadx}
      />
    </View>
  );
}

export default StickerList;

