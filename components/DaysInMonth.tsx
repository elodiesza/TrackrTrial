import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';

export default function DaysInMonth(today) {

    var thisMonth = today.getMonth();
    var thisYear = today.getFullYear();

    var days = [];
  
    const GetDaysInMonth = (month) => {
      var date = new Date(thisYear, thisMonth, 1);
        while (date.getMonth() === month) {
          days.push(new Date(date).getDate());
          date.setDate(date.getDate() + 1);
        }
      return days;
    }
  
    var daysLength = GetDaysInMonth(thisMonth).length;

return (
    daysLength
    );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
