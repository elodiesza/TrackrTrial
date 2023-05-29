import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';

import React, { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
//import * as Sharing from 'expo-sharing';
//import * as FileSystem from 'expo-file-system';
//import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [db2, setDb2] = useState(SQLite.openDatabase('example2.db'));
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  //for states
  const [states, setStates] = useState([]);

    useEffect(() => {
      // start names transactions
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
      });

      db.transaction(tx => {
        tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log('error selecting names')
        );
      });

      // start state transaction

      db2.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, state INTEGER)')
      });

      db2.transaction(tx => {
        tx.executeSql('SELECT * FROM states', null,
        (txObj, resultSet) => setStates(resultSet.rows._array),
        (txObj, error) => console.log('error selecting states')
        );
      });

      setIsLoading(false);
    },[]);

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
    }

    const removeDb2 = () => {
      db2.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS states', null,
          (txObj, resultSet) => setStates([]),
          (txObj, error) => console.log('error selecting states')
        );
      });
    }

    const addName = () => {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO names (name) values (?)',[currentName],
          (txtObj,resultSet)=> {
            let existingNames = [...names];
            existingNames.push({ id: resultSet.insertId, name:currentName});
            setNames(existingNames);
            setCurrentName(undefined);
            console.log('Data inserted susccesfully');
          },
          (txtObj,error) => console.log('Error inserting data:', error)
        );
      });
    }

    const deleteName = (id) => {
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM names WHERE id = ?', [id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingNames = [...names].filter(name => name.id !==id);
              setNames(existingNames);
            }
          },
          (txObj, error) => console.log(error)
        );
      });
    };

    const updateName = (id) => {
      db.transaction(tx=> {
        tx.executeSql('UPDATE names SET name = ? WHERE id = ?', [currentName, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingNames=[...names];
              const indexToUpdate = existingNames.findIndex(name => name.id === id);
              existingNames[indexToUpdate].name = currentName;
              setNames(existingNames);
              setCurrentName(undefined);
            }
          },
          (txObj, error) => console.log(error)
        );
      });
    };

    // for State 
    const addState = () => {
      db2.transaction(tx => {
        tx.executeSql('INSERT INTO states (name,state) values (?,?)',['SPORT',0],
          (txtObj,resultSet)=> {
            let existingStates = [...states];
            existingStates.push({ id: resultSet.insertId, name: 'SPORT', state:0});
            setStates(existingStates);
            console.log('Data inserted susccesfully');
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
    }

    const deleteState = (id) => {
      db2.transaction(tx=> {
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
        db2.transaction(tx=> {
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
        db2.transaction(tx=> {
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

    const showStates = () =>{
      return states.map((state,index) => {
        return (
          <View key={index}>
            <TouchableOpacity onPress={()=> updateState(state.id)}>
              <View style={[styles.cell, { backgroundColor : states[index].state==1 ? 'black' : 'white' }]} />
            </TouchableOpacity>
            <Button title='Delete' onPress={()=> deleteState(state.id)} />
          </View>
        )
      })
    }

    const showNames = () =>{
      return names.map((name,index) => {
        return (
          <View key={index}>
            <Text>{name.name}</Text>
            <Button title='Delete' onPress={()=> deleteName(name.id)} />
            <Button title='Update' onPress={()=> updateName(name.id)} />
          </View>
        )
      })
    }


  return (
    <View style={styles.container}>
      <Button title='create State' onPress={addState} />
      {showStates()}
      <Button title='remove Table' onPress={removeDb2} />
      {/*
      <View style={styles.minicontainer}>
        <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />
        <Button title="Add Name" onPress={addName}/>
        {showNames()}
      </View>
      */}
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
