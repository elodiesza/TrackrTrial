import { useState, useEffect } from 'react';
import { Platform, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import TagPicker from '../components/TagPicker';
import ColorPicker from '../components/ColorPicker';
import Color from '../components/Color';
import IsLoading from './IsLoading';


function NewIndicator({addModalVisible, setAddModalVisible, load, loadx, db, habits, setHabits, tags, setTags}) {

  const [isLoading, setIsLoading] = useState(true);
  const {control, handleSubmit, reset} = useForm();
  const [tagDisplay, setTagDisplay] = useState<"none" | "flex" | undefined>('none');
  const [addTag, setAddTag] = useState('Add Tag');
  const [selectedTag, setSelectedTag] = useState(null)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);    
  const [tagIndex, setTagIndex] = useState(0); 
  const [picked, setPicked] = useState<string>('white');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [isStateCreationComplete, setIsStateCreationComplete] = useState(false);

  const colorChoice =  ['#dc143c','#ffa500','#ffff00','#9acd32','#2e8b57',
  '#afeeee', '#4169e1', '#ba55d3', '#c71585', '#ffc0cb',
  '#ffffff', '#f5f5f5','#e6e6fa','#a0522d','#ffebcd'];

  const TagColor = ({item}) => (
    <TouchableOpacity onPress={() => (setPicked(item),setColorPickerVisible(!colorPickerVisible))}>
      <Color color={item}/>
    </TouchableOpacity>
  );
  

  const [type, setType] = useState(0);
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();


  useEffect(() => {

    let existingTags = [...tags];
    let newArray=existingTags.map((item) => {
      return {label: item.tag, value: item.tag}})
    setItems(newArray)

    setIsLoading(false);

  },[load]);


  useEffect(() => {
    if (!addModalVisible) {
      reset();
    }
  }, [addModalVisible, reset]);


  const addState = async (data) => {
    let existinghabits = [...habits]; 
    var newPlace = existinghabits.filter(c => c.day === 1).map(c => c.name).length;
      for (let i = 1; i < DaysInMonth(year, month) + 1; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO habits (name, year, month, day, state, type, tag, place) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [data.name, year, month, i, 0, type, 0, newPlace],
              (txtObj, stateResultSet) => {
                const newStateId = stateResultSet.insertId;
                const newState = {
                  id: newStateId,
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  state: 0,
                  type: type,
                  tag: 0,
                  place: newPlace,
                };
                existinghabits.push(newState);
                setHabits(existinghabits); // Update the state with the new array of habits
                loadx(!load);
              }
            );
        });
      }
      
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
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
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
              <Pressable onPress={handleSubmit(addState)} style={styles.submit}><Text>CREATE</Text></Pressable>
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
  type: {
    flex: 1/3, 
    alignItems:'center', 
    justifyContent: 'center', 
    height: 30,
    borderColor: 'lightgray', 
    borderRadius: 10,
  },
  typeContainer: {
    width: '70%',
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


