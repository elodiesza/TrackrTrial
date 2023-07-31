import React, { useState, useEffect } from 'react';
import { Switch, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

function NewTask({addModalVisible, setAddModalVisible, db, tasks, setTasks, tracks, track, section, pageDate, tracksScreen}) {

  const {control, handleSubmit, reset} = useForm();
  const [date, setDate] = useState(pageDate)
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [time, setTime] = useState(new Date())
  const [showTimePicker, setShowTimePicker] = useState(true);
  const [dateDisplay, setDateDisplay] = useState<"none" | "flex" | undefined>('none');
  const [addDeadline, setAddDeadline] = useState('Add Deadline');
  const [timeDisplay, setTimeDisplay] = useState<"none" | "flex" | undefined>('none');
  const [addTime, setAddTime] = useState('Add Time');
  const [load, loadx] = useState(false);

  const [recurring, setRecurring] = useState(false);
  const toggleSwitch = () => setRecurring(previousState => !previousState);

  useEffect(() => {
    if (!addModalVisible) {
      reset();
    }
  }, [addModalVisible, reset]);


    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');
      setDate(currentDate);
    };

    const onChange2 = (event, selectedTime) => {
      const currentTime = selectedTime || time;
      setShowTimePicker(Platform.OS === 'ios');
      setTime(currentTime);
    };

  const addTask = async (data) => {
    let existingTasks = [...tasks]; 
    setDate(pageDate);  
    console.warn(data);
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring, monthly, track, time, section) values (?,?,?,?,?,?,?,?,?,?)',[data.task,tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getFullYear():moment(date).format('YYYY'),tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getMonth():moment(date).format('MM')-1,tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getDate():moment(date).format('DD'),0,recurring?1:0,false,track,addTime=='Add Time'?null:time.toString(),section==undefined?undefined:section],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: resultSet.insertId, task: data.task, year:tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getFullYear():moment(date).format('YYYY'), month:tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getMonth():moment(date).format('MM')-1, day:tracksScreen?undefined:addDeadline=='Add deadline'?pageDate.getDate():moment(date).format('DD'), taskState:0, recurring:recurring?1:0, monthly:false, track:track, time:addTime=='Add Time'?null:time.toString(), section});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    });
    setRecurring(false);
    setTime(new Date());
    setAddTime('Add Time');
    setAddDeadline('Add deadline');
    setDate(pageDate);  
    setDateDisplay('none');
    setTimeDisplay('none');
    setAddModalVisible(false);
    loadx(!load);
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(false);
        setTime(new Date());
        setAddTime('Add Time');
        setAddDeadline('Add deadline');
        setDate(pageDate);  
        setDateDisplay('none');
        setTimeDisplay('none');
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(false);
        setTime(new Date());
        setAddTime('Add Time');
        setAddDeadline('Add deadline');
        setDate(pageDate);  
        setDateDisplay('none');
        setTimeDisplay('none');
        }} 
        activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
              <View style={{flexDirection:'row', marginBottom:10}}>
                <Text>Insert new Task</Text>
                <Text style={{display:section==undefined?"none":"flex"}}> in {section}</Text>
              </View>
              <Controller
              control= {control}
              name="task"
              render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder=""
                    style={[styles.input,{height:40, borderColor: error ? 'red' : '#e8e8e8'}]}
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
                  value: 36,
                  message: 'Task should be max 36 characters long',
                },
              }}
              />
              <View style={{display: track==undefined? "flex" : "none"}}>
                <Switch onValueChange={toggleSwitch} value={recurring}/>
              </View>
              <View style={{display: recurring==true? 'none': track==undefined ? "flex" : "none"}}>
                <Button title={addDeadline} onPress={() => (setDateDisplay(dateDisplay==='none'? 'flex' : 'none'), setAddDeadline(addDeadline==='Add Deadline'? 'Cancel Deadline' : 'Add Deadline'))}/>
                <View style={{display: dateDisplay}}>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date==undefined? new Date() : date}
                      mode="date"
                      display="default"
                      onChange={onChange}
                    />
                  )}
                  <Button title={addTime} onPress={() => (setTimeDisplay(timeDisplay==='none'? 'flex' : 'none'), setAddTime(addTime==='Add Time'? 'Cancel Time' : 'Add Time'))}/>
                  <View style={{display: timeDisplay}}>
                    {showTimePicker && (
                      <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={onChange2}
                        minuteInterval={5}
                      />
                    )}
                  </View>
                </View>
              </View>
              <Pressable onPress={handleSubmit(addTask)} style={styles.submit}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'lightgray', fontSize: 12, marginBottom:10}}>Must be up to 32 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewTask;

const styles = StyleSheet.create({
  container: {
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '70%',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightgray',
    paddingHorizontal: 10,
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
  color: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 20,
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
