import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {colors} from '../styles.js';

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
        <View style={{flexDirection:'row', justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{updateMood('productive');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon-devil" size={40} color={colors.green}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('happy');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon" size={40} color={colors.yellowgreen}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('sick');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon-sick" size={40} color={colors.yellow}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('stressed');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon-confused" size={40} color={colors.orange}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('angry');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon-angry" size={40} color={colors.red}/>
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="emoticon-happy" size={40} color={colors.pink}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('bored');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon-neutral" size={40} color={colors.purple}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{updateMood('sad');setMoodModalVisible==undefined? undefined:setMoodModalVisible(false);}}>
              <MaterialCommunityIcons name="emoticon-sad" size={40} color={colors.lightblue}/>
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
