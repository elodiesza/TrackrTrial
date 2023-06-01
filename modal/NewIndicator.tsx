import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';


function ModalScreen() {

  return (
    <View style={styles.container}>
     
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

