import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {colors} from '../styles.js';
import { useState } from 'react';

const width = Dimensions.get('window').width;

const AddMood = ({ moods,setMoods, db,year,month,day, load, loadx, setMoodModalVisible}) => {

  const mood=moods.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.mood).length==0?
  '':moods.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.mood)[0];

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
        <View style={{flex:1, flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1, marginTop: 10, height: 40, width:width, position:'absolute',alignItems:'center'}}>
              <FlatList
                data={[{"name":"productive","color":colors.primary.green,"icon":"emoticon-devil"},{"name":"happy","color":colors.primary.yellowgreen,"icon":"emoticon"},{"name":"sick","color":colors.primary.yellow,"icon":"emoticon-sick"},{"name":"stressed","color":colors.primary.orange,"icon":"emoticon-confused"},{"name":"angry","color":colors.primary.red,"icon":"emoticon-angry"},{"name":"bored","color":colors.primary.purple,"icon":"emoticon-neutral"},{"name":"sad","color":colors.primary.lightblue,"icon":"emoticon-sad"}]}
                renderItem={({item}) => 
                <View style={{flex:1, paddingLeft:1}}>
                  <View style={{marginHorizontal: 6,marginTop: 1, width:38, height:38, backgroundColor:mood==item.name?colors.primary.black:colors.primary.blue, borderRadius:20}}/>
                  <TouchableOpacity style={{marginHorizontal: 6,position:'absolute'}} onPress={()=>{updateMood(item.name);setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
                    <MaterialCommunityIcons name={item.icon} size={40} color={mood==item.name?item.color:colors.primary.default}/>
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
