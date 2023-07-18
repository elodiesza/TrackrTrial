import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback, FlatList } from 'react-native';
import Color from './Color';
import { colors } from '../styles';

const ColorPicker = ( {colorPickerVisible, setColorPickerVisible, picked, setPicked} ) => {
    
  const colorChoice=[colors.red,colors.orange,colors.yellow,colors.yellowgreen,colors.green,
    colors.blue,colors.turquoise,colors.purple,colors.magenta,colors.pink,colors.beige,colors.brown,colors.white,colors.gray,colors.black];

  const TagColor = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => (setPicked(item), setColorPickerVisible(!setColorPickerVisible))}>
        <Color color={item} />
      </TouchableOpacity>
    );
  };
    return (
        <Modal
              animationType="slide"
              transparent={true}
              visible={colorPickerVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setColorPickerVisible(!colorPickerVisible);
              }}
            >
              <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setColorPickerVisible(!colorPickerVisible)}} activeOpacity={1}>
                <TouchableWithoutFeedback>
                  <View style={styles.colorPicker}>
                    <FlatList data={colorChoice.slice(0,5)} renderItem={TagColor} horizontal={true}/>
                    <FlatList data={colorChoice.slice(5,10)} renderItem={TagColor} horizontal={true}/>
                    <FlatList data={colorChoice.slice(10,15)} renderItem={TagColor} horizontal={true}/>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
    );
};

const styles = StyleSheet.create({
    colorPicker: {
        flex: 1, 
        position: 'absolute',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'lightgray',
        borderRadius: 20,
        paddingHorizontal: 10,
        padding: 15,
      }
});

export default ColorPicker;