import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('indicator1cells.db');

function TrackerCell({item}: {item: number}) {

  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
    const [selectedCell, setSelectedCell] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [statex, setStatex] = useState(false);
    const exportDb = async () => {
      await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/example.db' );
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
    <TouchableOpacity onPress={handlePress}>
        <View style={[styles.cell, { backgroundColor : selectedCell ? 'black' : 'white' }]} />
    </TouchableOpacity>
  );
};

export default TrackerCell;

const styles = StyleSheet.create({
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
