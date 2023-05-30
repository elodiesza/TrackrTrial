import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Text, View } from 'react-native';


function TrackerCell({item}: {item: number}) {

  
    return (
    <View></View>
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
