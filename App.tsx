import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [currentName, setCurrentName] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  
  //for states
  const [states, setStates] = useState([]);

    useEffect(() => {

      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, UNIQUE(name,year,month,day))')
      });

      db.transaction(tx => {
        tx.executeSql('SELECT * FROM states', null,
        (txObj, resultSet) => setStates(resultSet.rows._array),
        (txObj, error) => console.log('error selecting states')
        );
      });

      setIsLoading(false);
    },[load]);

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
    }

    const removeDb2 = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS states', null,
          (txObj, resultSet) => setStates([]),
          (txObj, error) => console.log('error selecting states')
        );
      });
      loadx(!load);
    }


    const addState = () => {
      setIsLoading(true);
      let existingStates = [...states];    
      for (let i=1; i<5; i++) {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO states (name,year,month,day,state) values (?,?,?,?,?)',[currentName,2023,6,i,0],
          (txtObj,resultSet)=> {    
            existingStates.push({ id: resultSet.insertId, name: currentName, year:2023, month:6, day:i, state:0});
            setStates(existingStates);
            console.log('Data inserted susccesfully');
            console.warn(existingStates);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
      }
      setIsLoading(false);
    loadx(!load);
    }

    const deleteState = (id) => {
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM states WHERE id = ?', [id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingStates = [...states].filter(state => state.id !==id);
              setStates(existingStates);
            }
          },
          (txObj, error) => console.log(error)
        );       
      });      
    };

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

    const showStates = (ind) => {
      const filteredStates = states.filter(c=>c.name==ind);
      return filteredStates.map((state,index) => {
        return ( 
          <View key={index}>
            <TouchableOpacity onPress={()=> updateState(state.id)}>
              <View style={[styles.cell, { backgroundColor : filteredStates[index].state==1 ? 'black' : 'white' }]} />
            </TouchableOpacity>
          </View>
        )
      })
    }

    const showTitle = (ind) => {
      return  (
          <View>
            <Text>{ind.item}</Text>
            {showStates(ind.item)}
          </View>
        )   
    }

    const allNames = states.filter(c => c.day==1).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

  return (
    <View style={styles.container}>
      <FlatList
        data={uniqueNames}
        renderItem={(name)=>showTitle(name)}
        keyExtractor={(_, index) => index.toString()}
        horizontal={true}
      />
      <Button title='remove Table' onPress={removeDb2} />
      <View style={styles.minicontainer}>
        <Text>Insert new Indicator</Text>
        <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />
        <Button title="Add Name" onPress={addState}/>
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  row: {
    flex:1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minicontainer: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  cell: {
    width: 25,
    height: 25,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
