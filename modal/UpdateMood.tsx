
import React, { useState, useRef, useEffect } from 'react';
import { Platform, Dimensions, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { container,colors } from '../styles';
import { MoodIcons } from '../constants/MoodIcons.js';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

function UpdateMood({db,moods, setMoods, moodModalVisible, setMoodModalVisible, year, month, day, referenceElementPosition, selectedMood, setSelectedMood}) {


    const updateMood = (mood) => {
        let existingMoods=[...moods];
        if (existingMoods.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0){
          db.transaction(tx=> {
            tx.executeSql('INSERT INTO moods (id,year, month, day, mood) VALUES (?,?, ?, ?, ?)', [uuid.v4(),year, month, day, mood],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingMoods.push({id: uuid.v4(), year: year, month: month, day: day, mood: mood});
                  setMoods(existingMoods);
                }
              },
              (txObj, error) => console.log('Error inserting data', error)
            );
          });
        }
        else {
            let moodId = existingMoods.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
            let moodIndex = existingMoods.findIndex(mood => mood.id === moodId);
            db.transaction(tx=> {
                tx.executeSql('UPDATE moods SET mood = ? WHERE id= ?', [mood, moodId],
                  (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                      existingMoods[moodIndex].mood = mood;
                      setMoods(existingMoods);
                    }
                  },
                  (txObj, error) => console.log('Error updating data', error)
                );
            });
        }
        setSelectedMood(mood);
    };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={moodModalVisible}
      onRequestClose={() => {
        setMoodModalVisible(false);
      }}
    > 
      <TouchableOpacity style={{flex:1}} onPressOut={() => {setMoodModalVisible(!moodModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={[container.picker,{width: 306, maxWidth:306,left: referenceElementPosition.x-8+referenceElementPosition.width+10,  top: referenceElementPosition.y-3}]}>
              <FlatList
                data={MoodIcons}
                renderItem={({item}) => 
                <View style={{flex:1, paddingLeft:1}}>
                  <View style={{marginHorizontal: 2,marginTop: 1, width:38, height:38, backgroundColor:selectedMood==item.name?colors.primary.black:colors.primary.blue, borderRadius:20}}/>
                  <TouchableOpacity style={{marginHorizontal: 2,position:'absolute'}} onPress={()=>{updateMood(item.name);setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                    <MaterialCommunityIcons name={item.icon} size={40} color={selectedMood==item.name?item.color:colors.primary.default}/>
                  </TouchableOpacity>
                </View>}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                scrollEnabled={false}
              />
            </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default UpdateMood;
