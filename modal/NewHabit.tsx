import { useState, useEffect } from 'react';
import { Platform, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { container,colors } from '../styles';
import uuid from 'react-native-uuid';
import NewSticker from './NewSticker';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

function NewHabit({newHabitVisible, setNewHabitVisible, addModalVisible, setAddModalVisible, db, habits, setHabits, load, loadx}) {
  
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [pickedIcon, setPickedIcon] = useState('');
  const [picked, setPicked] = useState(colors.primary.white);
  const [productive, setProductive] = useState(true); 
  const {control, handleSubmit, reset} = useForm();

  const [type, setType] = useState(0);
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  useEffect(() => {
    if (!newHabitVisible) {
      reset();
    }
  }, [newHabitVisible, reset]);

  const addHabit = async (data) => {
    let existinghabits = [...habits]; 
    var newPlace = existinghabits.filter(c =>(c.year==year&&c.month==month&&c.day==1)).map(c => c.name).length;
      for (let i = 1; i < DaysInMonth(year, month) + 1; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO habits (id,name, year, month, day, state, type, productive, icon, color, place) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
              [ uuid.v4(),data.name, year, month, i, false, type, productive,pickedIcon, picked, newPlace],
              (txtObj,) => {
                const newState = {
                  id: uuid.v4(),
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  state: false,
                  type: type,
                  productive: productive,
                  icon: pickedIcon,
                  color: picked,
                  place: newPlace,
                };
                existinghabits.push(newState);
                setHabits(existinghabits); // Update the state with the new array of habits
                loadx(!load);
              }
            );
        });
      }

    setNewHabitVisible(false);
    setAddModalVisible(false);

  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newHabitVisible}
      onRequestClose={() => {
        setNewHabitVisible(!newHabitVisible);
        setAddModalVisible(!addModalVisible);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible);setNewHabitVisible(!newHabitVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <>
          <View style={container.backmodal}/>
          <View style={container.frontmodal}>
            <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginBottom:10}}>
                    <Pressable onPress={() => setNewStateVisible(!newStateVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20}}>NEW HABIT</Text>
                </View>
              <View style={{flexDirection:'row', width:"100%", alignItems:'center'}}>
                <Pressable onPress={()=>setColorPickerVisible(true)} style={{ width:'15%', marginRight: 5, marginLeft:-5}}>
                  <Color color={picked} />
                </Pressable>
                <ColorPicker
                  colorPickerVisible={colorPickerVisible}
                  setColorPickerVisible={setColorPickerVisible}
                  picked={picked}
                  setPicked={setPicked}
                />
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
                      style={[container.textinput,{borderColor: error ? 'red' : '#e8e8e8', width:'85%'}]}
                    />
                    {error && (
                      <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                    )}
                  </>
                )}
                rules={{
                  required: 'Input a Habit',
                  minLength: {
                    value: 3,
                    message: 'Task should be at least 3 characters long',
                  },
                  maxLength: {
                    value: 14,
                    message: 'Task should be max 14 characters long',
                  },
                  validate: (name) => {
                    if (name.includes('  ')) {
                      return 'Name should not contain consecutive spaces';
                    }
                    return true;
                  }
                }}
                />
              </View>
              <View style={{width:'100%', flexDirection:'row', alignItems:'center'}}>
                <Pressable onPress={()=>setProductive(!productive)} style={{width:'15%', justifyContent:'center'}}>
                  <Ionicons name="flame" color={colors.primary.defaultdark} size={30} style={{position:'absolute', display: productive?'flex':'none'}}/>
                  <Ionicons name="flame-outline" color={colors.primary.blue} size={30}/>
                </Pressable>
                <View style={styles.typeContainer}>
                  <Pressable onPress={type => setType(2)} style={[styles.type,{borderWidth: type===2 ? 1 : 0, backgroundColor: type===2 ? '#FFD1D1' : 'transparent'}]}>
                      <Text>Bad</Text>
                  </Pressable>
                  <Pressable onPress={type => setType(0)} style={[styles.type,{borderWidth: type===0 ? 1 : 0, backgroundColor: type===0 ? '#F4F9FA' : 'transparent'}]}>
                      <Text>Neutral</Text>
                  </Pressable>
                  <Pressable onPress={type => setType(1)} style={[styles.type,{borderWidth: type===1 ? 1 : 0, backgroundColor: type===1 ? 'palegreen' : 'transparent'}]}>
                      <Text>Good</Text>
                  </Pressable>
                </View>
              </View>
              <NewSticker db={db} pickedIcon={pickedIcon} setPickedIcon={setPickedIcon} picked={picked}/>
              <Pressable onPress={handleSubmit(addHabit)} style={container.button}><Text>CREATE</Text></Pressable>
          </View> 
          </>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewHabit;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submit: {
    width: '70%',
    borderWidth: 1,
    borderColor: 'lightblue',
    backgroundColor: 'lightgray',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  type: {
    flex: 1/3, 
    alignItems:'center', 
    justifyContent: 'center', 
    height: 30,
    borderColor:  colors.primary.blue, 
    borderRadius: 10,
  },
  typeContainer: {
    width: '85%',
    flexDirection:'row',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginVertical: 5,
  },
  color: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'lightgray',
  },
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


