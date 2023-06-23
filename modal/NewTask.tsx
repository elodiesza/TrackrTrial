import { useState, useEffect } from 'react';
import { Switch, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';


function NewTask({addModalVisible, setAddModalVisible, load, loadx, db, tasks, setTasks}) {

  const [isLoading, setIsLoading] = useState(true);
  const {control, handleSubmit, reset} = useForm();
  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();

  const [recurring, setRecurring] = useState(false);
  const toggleSwitch = () => setRecurring(previousState => !previousState);


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, UNIQUE(task,year,month,day))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', null,
      (txObj, resultSet) => setTasks(resultSet.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });

    

    setIsLoading(false);
  },[load]);


  useEffect(() => {
    if (!addModalVisible) {
      reset();
    }
  }, [addModalVisible, reset]);

  const addTask = (data) => {
    let existingTasks = [...tasks];    
      db.transaction(tx => {
        tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring) values (?,?,?,?,?,?)',[data.task,year,month,day,0,recurring?1:0],
          (txtObj,resultSet)=> {    
            existingTasks.push({ id: resultSet.insertId, task: data.task, year:year, month:month, day:day, taskState:0, recurring:recurring?1:0});
            setTasks(existingTasks);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
    setAddModalVisible(false);
    loadx(!load);
  }


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={addModalVisible}
      onRequestClose={() => {
        setAddModalVisible(!addModalVisible);
        setRecurring(false);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.minicontainer}>
              <Text>Insert new Task</Text>
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
              <Switch onValueChange={toggleSwitch} value={recurring}/>
              <Pressable onPress={handleSubmit(addTask)} style={styles.submit}><Text>CREATE</Text></Pressable>
            </View>
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
    height: 200,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
  },
  minicontainer: {
    flex:2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
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
});

