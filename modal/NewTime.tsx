import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { container,colors } from '../styles';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import { SelectList } from 'react-native-dropdown-select-list'


function NewTime({newTimeVisible, setNewTimeVisible, addModalVisible, setAddModalVisible, load, loadx, db, times, setTimes, timerecords, setTimerecords}) {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  const {control, handleSubmit, reset} = useForm();
  const [colorPickerVisibleMin, setColorPickerVisibleMin] = useState(false);
  const [colorPickerVisibleMax, setColorPickerVisibleMax] = useState(false);
  const [pickedMin, setPickedMin] = useState(colors.primary.white);
  const [pickedMax, setPickedMax] = useState(colors.primary.white);
  const [addColor, setAddColor] = useState(false);

  const addTime = async (data) => {
    let existingtimes = [...times]; 
    var newPlace = existingtimes.length;
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO times (id,name, mincolor, maxcolor, place) VALUES (?,?,?,?,?)',
              [uuid.v4(), data.name, addColor? pickedMin : undefined, addColor? pickedMax : undefined, newPlace],
              (txtObj, scaleResultSet) => {
                const newTime = {
                    id: uuid.v4(),
                    name: data.name,
                    mincolor: addColor? pickedMin : undefined,
                    maxcolor: addColor? pickedMax : undefined,
                    place: newPlace
                };
                existingtimes.push(newTime);
                setTimes(existingtimes); 
              }
            );
    });
    let existingrecords = [...timerecords]; 
      for (let i = 1; i < DaysInMonth(year, month) + 1; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO timerecords (id, name, year, month, day, hours, minutes) VALUES (?,?, ?, ?, ?, ?,?)',
              [ uuid.v4(),data.name, year, month, i, undefined, undefined],
              (txtObj, scaleResultSet) => {
                const newTime = {
                  id: uuid.v4(),
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  hours: undefined,
                  minutes: undefined,
                };
                existingrecords.push(newTime);
                setTimerecords(existingrecords); 
                loadx(!load);
              }
            );
        });
      }

    setNewTimeVisible(false);
    setAddModalVisible(false);
    loadx(!load);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newTimeVisible}
      onRequestClose={() => {
        setNewTimeVisible(!newTimeVisible);
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible),setNewTimeVisible(!newTimeVisible)}} activeOpacity={1}>
      <TouchableWithoutFeedback>
            <View style={container.modal}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginBottom:10}}>
                    <Pressable onPress={() => setNewTimeVisible(!newTimeVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20}}>NEW Time</Text>
                </View>
                <Controller
                control= {control}
                name="name"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <>
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize = {"characters"}
                        onBlur={onBlur}
                        placeholder="NAME"
                        style={[container.textinput,{borderColor: error ? 'red' : '#e8e8e8'}]}
                    />
                    {error && (
                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                    </>
                )}
                rules={{
                    required: 'Input a Scale name',
                    minLength: {
                    value: 3,
                    message: 'Name should be at least 3 characters long',
                    },
                    maxLength: {
                    value: 14,
                    message: 'Name should be max 14 characters long',
                    },
                    validate: (name) => {
                    if (name.includes('  ')) {
                        return 'Name should not contain consecutive spaces';
                    }
                    return true;
                    }
                }}
                />   
                <View style={{width:"100%", flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Pressable onPress={()=>setAddColor(true)}>
                        <MaterialCommunityIcons style={{display: addColor? "none":"flex"}} name="checkbox-blank-outline" size={25} color={colors.primary.blue} />
                    </Pressable>
                    <Pressable onPress={()=>setAddColor(false)}>
                        <MaterialCommunityIcons style={{display: addColor? "flex":"none"}} name="checkbox-marked" size={25} color={colors.primary.blue} />
                    </Pressable>
                    <Text style={{marginLeft:10, color: addColor? colors.primary.black : colors.primary.gray}}>MIN</Text>
                    <Pressable onPress={addColor? ()=>setColorPickerVisibleMin(true) : undefined}>
                        <Color color={addColor? pickedMin : colors.primary.gray} />
                    </Pressable>
                    <ColorPicker
                    colorPickerVisible={colorPickerVisibleMin}
                    setColorPickerVisible={setColorPickerVisibleMin}
                    picked={pickedMin}
                    setPicked={setPickedMin}
                    />
                    <Text style={{marginLeft:10, color: addColor? colors.primary.black : colors.primary.gray}}>MAX</Text>
                    <Pressable onPress={addColor? ()=>setColorPickerVisibleMax(true) : undefined}>
                        <Color color={addColor? pickedMax : colors.primary.gray} />
                    </Pressable>
                    <ColorPicker
                        colorPickerVisible={colorPickerVisibleMax}
                        setColorPickerVisible={setColorPickerVisibleMax}
                        picked={pickedMax}
                        setPicked={setPickedMax}
                    />     
                </View>
                <Pressable onPress={handleSubmit(addTime)} style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewTime;
