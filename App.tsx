import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Button } from 'react-native';
//import Trackers from './screens/Trackers';

import React, { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

const db = SQLite.openDatabase('indicator1cells.db');

function App() {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
    const [selectedCell, setSelectedCell] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [statex, setStatex] = useState(false);
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

    const handlePress = useCallback(() => {
        setSelectedCell(!selectedCell);
        exportDb;
        setStatex(!statex);
    }, [statex]);
    useEffect(() => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS indicators (id INTEGER PRIMARY KEY AUTOINCREMENT, indicator TEXT, state INTEGER)')
      });
      /* db.transaction(tx => {
        tx.executeSql('SELECT * FROM state', null,
        (txObj, {resultSet}:{resultSet : state}) => setSelectedCell(resultSet),
        (txObj, error) => console.log('error')
        );
      }); */
      db.transaction(tx => {
        tx.executeSql('INSERT INTO indicators (indicator, state) VALUES (?,?); ',
        ['SPORT', selectedCell? 1:0],
        (_,result)=> {
          console.log('Data inserted susccesfully');
        },
        (_,error) => {
          console.log('Error inserting data:', error);
        }
        );
      });
      setIsLoading(false);
    },[statex]);

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
    }

  return (
    <View style={styles.container}>
      {/*  <Trackers/> */}
      <Button title="import DB" onPress={importDb}></Button>
      <Button title="export DB" onPress={exportDb}></Button>
      <View style={styles.minicontainer}>
        <TouchableOpacity onPress={handlePress}>
        <View style={[styles.cell, { backgroundColor : selectedCell ? 'black' : 'white' }]} />
      </TouchableOpacity>
      </View>
      
    </View>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  minicontainer: {
    height: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  cell: {
    flex:1,
    width: 25,
    height: 25,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
