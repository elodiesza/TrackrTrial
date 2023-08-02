import { useState, useEffect } from 'react';
import { Platform, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { container,colors } from '../styles';
import uuid from 'react-native-uuid';


function NewHabit({newHabitVisible, setNewHabitVisible, addModalVisible, setAddModalVisible, load, loadx, db, habits, setHabits}) {


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


  const addState = async (data) => {
    let existinghabits = [...habits]; 
    var newPlace = existinghabits.filter(c => c.day === 1).map(c => c.name).length;
      for (let i = 1; i < DaysInMonth(year, month) + 1; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO habits (name, year, month, day, state, type, track, place) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [data.name, year, month, i, 0, type, 0, newPlace],
              (txtObj,) => {
                const newState = {
                  id: uuid.v4(),
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  state: 0,
                  type: type,
                  track: 0,
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
    loadx(!load);
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newHabitVisible}
      onRequestClose={() => {
        setNewHabitVisible(!newHabitVisible);
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible),setNewHabitVisible(!newHabitVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={container.modal}>
              <Text style={{marginBottom:10}}>Create a new Habit</Text>
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
                required: 'Input a Habit',
                minLength: {
                  value: 3,
                  message: 'Task should be at least 3 characters long',
                },
                maxLength: {
                  value: 12,
                  message: 'Task should be max 12 characters long',
                },
                validate: (name) => {
                  if (name.includes('  ')) {
                    return 'Name should not contain consecutive spaces';
                  }
                  return true;
                }
              }}
              />
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
              <Pressable onPress={handleSubmit(addState)} style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
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
    borderColor:  colors.blue, 
    borderRadius: 10,
  },
  typeContainer: {
    width: '100%',
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


