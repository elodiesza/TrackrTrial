import { FlatList, Pressable, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import IndicatorTableTitleToday from './IndicatorTableTitleToday';
import AddSleepLog from './AddSleepLog';
import AddMood from './AddMood';
import { container } from '../styles';


const width = Dimensions.get('window').width;

const TodayScreen = ({ db, tasks, setTasks, tags, setTags, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx}) => {

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    const [isLoading, setIsLoading] = useState(false);


    const allNames = habits.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

    if (isLoading) {
        return (
          <View>
            <Text> Is Loading...</Text>
          </View>
        )
      }

    const updateState = (id) => {
        let existinghabits=[...habits];
        const indexToUpdate = existinghabits.findIndex(state => state.id === id);
        if (existinghabits[indexToUpdate].state==0){
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET state = ? WHERE id = ?', [1, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existinghabits[indexToUpdate].state = 1;
                  setHabits(existinghabits);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else {
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET state = ? WHERE id = ?', [0, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existinghabits[indexToUpdate].state = 0;
                  setHabits(existinghabits);
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
          <Pressable onPress={()=>updateState(habits.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0])} style={{ height: 75, width:25*1.25, transform: [{ skewX: '-45deg' },{scale: 1.25}], left: 60 }}>
            <IndicatorTableTitleToday name={ind.item} state={habits.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.state)[0]} tags={tags} habits={habits} year={year} month={month}/>
          </Pressable>
        </View>
      );
    };


  return (
    <SafeAreaView style={container.body}>
      <View style={{flex:1}}>
        <AddMood moods={moods} setMoods={setMoods} db={db} year={year} month={month} day={day} load={load} loadx={loadx} setMoodModalVisible={undefined}/>
      </View>
      <View style={{flex:1, width:width}}>
        <FlatList
          horizontal
          data={uniqueNames}
          renderItem={uniqueNames!==null?(name)=>showTitle(name):undefined}
          keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
        />
      </View>
      <View style={{flex:1, width:width}}>
        <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={day} load={load} loadx={loadx} setSleepModalVisible={undefined} sleepModalVisible={undefined}/>
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
});
