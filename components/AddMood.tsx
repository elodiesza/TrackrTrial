import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Sad from '../assets/images/icons/sad.png';
import Angry from '../assets/images/icons/angry.png';
import Happy from '../assets/images/icons/happy.png';
import Productive from '../assets/images/icons/productive.png';
import Sick from '../assets/images/icons/sick.png';
import Stressed from '../assets/images/icons/stressed.png';
import Bored from '../assets/images/icons/bored.png';

const width = Dimensions.get('window').width;

const AddMood = ({ moods,setMoods, db,year,month,day, load, loadx, setMoodModalVisible}) => {
    
    const updateMood = (mood) => {
        let existingMoods=[...moods];
        if (existingMoods.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0){
          db.transaction(tx=> {
            tx.executeSql('INSERT INTO moods (year, month, day, mood) VALUES (?, ?, ?, ?)', [year, month, day, mood],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingMoods.push({id: resultSet.insertId, year: year, month: month, day: day, mood: mood});
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
    };

  return (
    <View style={styles.container}>
        <Text>Today's mood</Text>
        <View style={{flexDirection:'row', justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{updateMood('productive');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Productive} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('happy');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Happy} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('sick');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Sick} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('stressed');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Stressed} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('angry');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Angry} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('bored');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Bored} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('sad');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                <Image source={Sad} style={styles.mood} />
            </TouchableOpacity>     
        </View>
    </View>
  );
}

export default AddMood;

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
    },
    mood: {
        width: 40,
        height:40,
        margin:1,
        marginTop:10,
        marginBottom:10,
        resizeMode: 'contain',
    }
});
