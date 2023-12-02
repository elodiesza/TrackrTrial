import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {colors} from '../styles.js';
import uuid from 'react-native-uuid';
import { useEffect, useState } from 'react';
import { MoodIcons } from '../constants/MoodIcons.js';

const width = Dimensions.get('window').width;

const AddMood = ({ moods,setMoods, db,year,month,day,setMoodModalVisible}) => {

  const [selectedMood, setSelectedMood] = useState(moods.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.mood)[0]);

  useEffect(()=>{
    setSelectedMood(moods.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.mood)[0]);
  },[moods,day])


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
    <View style={styles.container}>
        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1, marginTop: 10, height: 40, width:width, position:'absolute',alignItems:'center'}}>
              <FlatList
                data={MoodIcons}
                renderItem={({item}) => 
                <View style={{flex:1, paddingLeft:1}}>
                  <View style={{marginHorizontal: 4,marginTop: 1, width:38, height:38, backgroundColor:selectedMood==item.name?colors.primary.black:colors.primary.blue, borderRadius:20}}/>
                  <TouchableOpacity style={{marginHorizontal: 4,position:'absolute'}} onPress={()=>{updateMood(item.name);setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                    <MaterialCommunityIcons name={item.icon} size={40} color={selectedMood==item.name?item.color:colors.primary.default}/>
                  </TouchableOpacity>
                </View>}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                scrollEnabled={false}
              />
            </View>
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
