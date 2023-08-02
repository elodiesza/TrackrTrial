import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';


function NewScale({newScaleVisible, setNewScaleVisible, addModalVisible, setAddModalVisible, load, loadx, db, scales, setScales, scalerecords, setScalerecords}) {
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
    const [addUnit, setAddUnit] = useState(false);
    const [addValue, setAddValue] = useState(false);


  useEffect(() => {
    if (!newScaleVisible) {
      reset();
    }
  }, [newScaleVisible, reset]);


  const addScale = async (data) => {
    let existingscales = [...scales]; 
    var newPlace = existingscales.length;
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO scales (name, min, max, mincolor, maxcolor, unit, place) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [data.name, addValue? data.valueMin : undefined, addValue? data.valueMax : undefined, 
                addColor? pickedMin : undefined, addColor? pickedMax : undefined ,addUnit? data.unit : undefined, newPlace],
              (txtObj, scaleResultSet) => {
                const newScale = {
                    id: uuid.v4(),
                    name: data.name,
                    min: addValue? data.valueMin : undefined,
                    max: addValue? data.valueMax : undefined,
                    mincolor: addColor? pickedMin : undefined,
                    maxcolor: addColor? pickedMax : undefined,
                    unit: addUnit? data.unit : undefined,
                    place: newPlace,
                };
                existingscales.push(newScale);
                setScales(existingscales); 
              }
            );
        });

    let existingrecords = [...scalerecords]; 
      for (let i = 1; i < DaysInMonth(year, month) + 1; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO scalerecords (name, year, month, day, value) VALUES (?, ?, ?, ?, ?)',
              [data.name, year, month, i, undefined],
              (txtObj, scaleResultSet) => {
                const newScale = {
                  id: uuid.v4(),
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  value: undefined,
                };
                existingrecords.push(newScale);
                setScalerecords(existingrecords); 
                loadx(!load);
              }
            );
        });
      }

    setNewScaleVisible(false);
    setAddModalVisible(false);
    loadx(!load);
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newScaleVisible}
      onRequestClose={() => {
        setNewScaleVisible(!newScaleVisible);
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible),setNewScaleVisible(!newScaleVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.modal}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginBottom:10}}>
                    <Pressable onPress={() => setNewScaleVisible(!newScaleVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20}}>NEW Scale</Text>
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
                    value: 12,
                    message: 'Name should be max 12 characters long',
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
                <View style={{width:"100%", flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Pressable onPress={()=>setAddValue(true)}>
                        <MaterialCommunityIcons style={{display: addValue? "none":"flex"}} name="checkbox-blank-outline" size={25} color={colors.primary.blue} />
                    </Pressable>
                    <Pressable onPress={()=>setAddValue(false)}>
                        <MaterialCommunityIcons style={{display: addValue? "flex":"none"}} name="checkbox-marked" size={25} color={colors.primary.blue} />
                    </Pressable>
                    <Text style={{marginHorizontal:10, color: addValue? colors.primary.black : colors.primary.gray}}>MIN</Text>
                    <Controller
                    control= {control}
                    name="valueMin"
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                        <>
                        <TextInput
                            value={addValue? value: undefined}
                            editable={addValue? true : false}
                            onChangeText={(text) => {// Remove any non-numeric characters using a regular expression
                                const intValue = text.replace(/\D/g, '');
                                // Set the cleaned integer value back to the input field
                                onChange(intValue);}}
                            onBlur={onBlur}
                            placeholder="value"
                            style={[container.textinput,{width: undefined, flex:1,borderColor: error ? 'red' : '#e8e8e8'}]}
                        />
                        {error && (
                            <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                        )}
                        </>
                    )}
                    rules={{
                        required: 'Input a value',
                        validate: (value) => {
                            if (!/^\d*$/.test(value)) {
                              return 'Please enter a valid integer';
                            }
                            return true;
                          },
                    }}
                    />
                    <Text style={{marginHorizontal:10, color: addValue? colors.primary.black : colors.primary.gray}}>MAX</Text>
                    <Controller
                    control= {control}
                    name="valueMax"
                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                        <>
                        <TextInput
                            value={addValue? value: undefined}
                            editable={addValue? true : false}
                            onChangeText={(text) => {// Remove any non-numeric characters using a regular expression
                                const intValue = text.replace(/\D/g, '');
                                // Set the cleaned integer value back to the input field
                                onChange(intValue);}}
                            autoCapitalize = {"characters"}
                            onBlur={onBlur}
                            placeholder="value"
                            style={[container.textinput,{width: undefined, flex:1,borderColor: error ? 'red' : '#e8e8e8'}]}
                        />
                        {error && (
                            <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                        )}
                        </>
                    )}
                    rules={{
                        required: 'Input a value',
                        validate: (value) => {
                            if (!/^\d*$/.test(value)) {
                              return 'Please enter a valid integer';
                            }
                            return true;
                        },
                    }}
                    />
                </View>
                <View style={{width:"100%", flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                    <Pressable onPress={()=>setAddUnit(true)}>
                        <MaterialCommunityIcons style={{display: addUnit? "none":"flex"}} name="checkbox-blank-outline" size={25} color={colors.primary.blue} />
                    </Pressable>
                    <Pressable onPress={()=>setAddUnit(false)}>
                        <MaterialCommunityIcons style={{display: addUnit? "flex":"none"}} name="checkbox-marked" size={25} color={colors.primary.blue} />
                    </Pressable>
                    <Text style={{marginHorizontal:10, color: addUnit? colors.primary.black : colors.primary.gray}}>UNIT</Text>
                    <Controller
                        control= {control}
                        name="unit"
                        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                            <>
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize = {"characters"}
                                onBlur={onBlur}
                                placeholder="UNIT"
                                style={[container.textinput,{width: undefined, flex:1,borderColor: error ? 'red' : '#e8e8e8'}]}
                            />
                            {error && (
                                <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                            )}
                            </>
                        )}
                    />
                </View>
                
                <Pressable onPress={handleSubmit(addScale)} style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewScale;
