import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, Button } from 'react-native';

import React, { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  //const db = SQLite.openDatabase('example.db');
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const exportDb = async () => {
    await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/example.db' );
  }

  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true
    });

    if (result.type === "success") {
      setIsLoading(true);

      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      }

      const base64 = await FileSystem.readAsStringAsync(
      result.uri,
      {
        encoding: FileSystem.EncodingType.Base64
      }
      );
      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'SQLite/example.db', base64, {encoding: FileSystem.EncodingType.Base64});
      await db.closeAsync();
      setDb(SQLite.openDatabase('example.db'));
    }
  } 

    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
      });

      db.transaction(tx => {
        tx.executeSql('SELECT * FROM names', null,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => console.log('error selecting names')
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

    const deleteName = ({id}:{id:number}) => {
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
    {/*  <Trackers/> */}
      <Button title="import DB" onPress={importDb}></Button>
      <Button title="export DB" onPress={exportDb}></Button>
      <View style={styles.minicontainer}>
        <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />
        <Button title="Add Name" onPress={addName}/>
        {showNames()}
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
  minicontainer: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  cell: {
    flex:1,
    width: 100,
    height: 100,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
