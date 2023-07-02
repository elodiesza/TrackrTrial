import { FlatList, Pressable, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import IndicatorTableTitleToday from './IndicatorTableTitleToday';

const width = Dimensions.get('window').width;

const TodayScreen = ({ db, tasks, setTasks, tags, setTags, states, setStates, load, loadx}) => {

    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    const [isLoading, setIsLoading] = useState(false);

    const allNames = states.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

    const updateState = (id) => {
        console.warn(id);
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
        <View style={{left:20}}>
          <Pressable onPress={()=>updateState(states.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0])} style={{ height: 75, width:25*1.25, transform: [{ skewX: '-45deg' },{scale: 1.25}], left: 37 }}>
            <IndicatorTableTitleToday name={ind.item} state={states.filter(c=>(c.name==ind.item && c.year==year && c.month==month && c.day==day)).map(c=>c.state)[0]} tags={tags} states={states} year={year} month={month}/>
          </Pressable>
        </View>
      );
    };
  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
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
