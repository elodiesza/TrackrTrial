import { FlatList, Pressable, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import IndicatorTableTitleToday from './IndicatorTableTitleToday';
import SleeplogToday from './SleeplogToday';
import Sad from '../assets/images/icons/sad.png';
import Angry from '../assets/images/icons/angry.png';
import Happy from '../assets/images/icons/happy.png';
import Productive from '../assets/images/icons/productive.png';
import Sick from '../assets/images/icons/sick.png';
import Stressed from '../assets/images/icons/stressed.png';
import Bored from '../assets/images/icons/bored.png';

const width = Dimensions.get('window').width;

const TodayScreen = ({ db, tasks, setTasks, tags, setTags, states, setStates, moods, setMoods, sleep, setSleep, load, loadx}) => {

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    const [isLoading, setIsLoading] = useState(false);


    const allNames = states.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

    if (isLoading) {
        return (
          <View>
            <Text> Is Loading...</Text>
          </View>
        )
      }

    const updateState = (id) => {
        let existingStates=[...states];
        const indexToUpdate = existingStates.findIndex(state => state.id === id);
        if (existingStates[indexToUpdate].state==0){
          db.transaction(tx=> {
            tx.executeSql('UPDATE states SET state = ? WHERE id = ?', [1, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingStates[indexToUpdate].state = 1;
                  setStates(existingStates);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else {
          db.transaction(tx=> {
            tx.executeSql('UPDATE states SET state = ? WHERE id = ?', [0, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingStates[indexToUpdate].state = 0;
                  setStates(existingStates);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
      };

    const showTitle = (ind) => {
      return (
        <View>
          <Pressable onPress={()=>updateState(states.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0])} style={{ height: 75, width:25*1.25, transform: [{ skewX: '-45deg' },{scale: 1.25}], left: 60 }}>
            <IndicatorTableTitleToday name={ind.item} state={states.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.state)[0]} tags={tags} states={states} year={year} month={month}/>
          </Pressable>
        </View>
      );
    };

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
    <SafeAreaView style={styles.container}>
      <View style={{flex:1}}>
        <Text>Today's mood</Text>
        <View style={{flex:1, width:width, flexDirection:'row', justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>updateMood('productive')}>
                <Image source={Productive} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateMood('happy')}>
                <Image source={Happy} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateMood('sick')}>
                <Image source={Sick} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateMood('stressed')}>
                <Image source={Stressed} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateMood('angry')}>
                <Image source={Angry} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateMood('bored')}>
                <Image source={Bored} style={styles.mood} />
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>updateMood('sad')}>
                <Image source={Sad} style={styles.mood} />
            </TouchableOpacity>     
        </View>
      </View>
      <View style={{flex:1, width:width}}>
        <Text>
          Today's habits completion
        </Text>
        <FlatList
          horizontal
          data={uniqueNames}
          renderItem={uniqueNames!==null?(name)=>showTitle(name):undefined}
          keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
        />
      </View>
      <View style={{flex:1, width:width}}>
        <Text>
          Sleep Log
        </Text>
        <SleeplogToday db={db} sleep={sleep} setSleep={setSleep} load={load} loadx={loadx}/>
      </View>
    </SafeAreaView>
  );
}

export default TodayScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  mood: {
    width: 40,
    resizeMode: 'contain',
}
});
