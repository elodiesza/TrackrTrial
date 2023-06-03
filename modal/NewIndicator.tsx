import { useState, useEffect } from 'react';
import { Platform, Modal, Span, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import DaysInMonth from '../components/DaysInMonth';
import * as SQLite from 'expo-sqlite';


function NewIndicator({addModalVisible, setAddModalVisible, load, loadx, db, states, setStates}) {

  const [isLoading, setIsLoading] = useState(true);
  const {control, handleSubmit, reset} = useForm();
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  var nbDaysThisMonth = DaysInMonth(today);


  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, UNIQUE(name,year,month,day))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM states', null,
      (txObj, resultSet) => setStates(resultSet.rows._array),
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

  const addState = (data) => {
    let existingStates = [...states];    
    for (let i=1; i<=nbDaysThisMonth; i++) {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO states (name,year,month,day,state) values (?,?,?,?,?)',[data.name,year,month,i,0],
          (txtObj,resultSet)=> {    
            existingStates.push({ id: resultSet.insertId, name: data.name, year:year, month:month, day:i, state:0});
            setStates(existingStates);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
    }
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
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <View style={styles.minicontainer}>
              <Text>Insert new Indicator</Text>
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
              <Pressable onPress={handleSubmit(addState)} style={styles.submit}><Text>CREATE</Text></Pressable>
            </View>
            <Text style={{color: 'lightgray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewIndicator;

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

