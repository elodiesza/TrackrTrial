import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const today= new Date();

function TrackerCell({item}: {item: number}) {

    const [selectedCell, setSelectedCell] = useState(false);
    const [statex, setStatex] = useState(false);
    const handlePress = useCallback(() => {
        setSelectedCell(!selectedCell);
        setStatex(!statex);
      }, [statex]);

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
