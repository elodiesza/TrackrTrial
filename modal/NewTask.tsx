import { useState, useEffect } from 'react';
import { Switch, Button, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import ColorPicker from '../components/ColorPicker';
import TagPicker from '../components/TagPicker';
import Color from '../components/Color';

function NewTask({addModalVisible, setAddModalVisible, load, loadx, db, tasks, setTasks, tags, setTags}) {

  const [isLoading, setIsLoading] = useState(true);
  const {control, handleSubmit, reset} = useForm();
  const [tagDisplay, setTagDisplay] = useState<"none" | "flex" | undefined>('none');
  const [addTag, setAddTag] = useState('Add Tag');
  const [selectedTag, setSelectedTag] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [picked, setPicked] = useState<string>('white');

  var today = new Date();
  var day = today.getDate();
  var month = today.getMonth();
  var year = today.getFullYear();

  const [recurring, setRecurring] = useState(false);
  const toggleSwitch = () => setRecurring(previousState => !previousState);

  const colorChoice =  ['crimson','orange','yellow','yellowgreen','seagreen',
  'paleturquoise', 'royalblue', 'mediumorchid', 'mediumvioletred', 'pink',
  'white', 'whitesmoke','lavender','sienna','blanchedalmond'];

  const TagColor = ({item}) => (
    <TouchableOpacity onPress={() => (setPicked(item),setColorPickerVisible(!colorPickerVisible))}>
      <Color color={item}/>
    </TouchableOpacity>
  );

  const existingtag = (tag: string) => selectedTag=== ('Add a new Tag') ? tags.map(c=>c.tag).includes(tag) === false : true || 'this Tag already exists';


  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, tag INTEGER, time TEXT, UNIQUE(task,year,month,day))')
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


  const addTask = async (data) => {
    let existingTags = [...tags];
    let existingTasks = [...tasks]; 
    var newPlace = existingTasks.filter(c => c.day === 1).map(c => c.name).length;
    if(addTag=='Add Tag' || (selectedTag==null && selectedTag!=='Add a new Tag')){
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring, tag, time) values (?,?,?,?,?,?,?,?)',[data.task,year,month,day,0,recurring?1:0,0,0],
          (txtObj,resultSet)=> {    
            existingTasks.push({ id: resultSet.insertId, task: data.task, year:year, month:month, day:day, taskState:0, recurring:recurring?1:0, tag:0, time:0});
            setTasks(existingTasks);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        });
    }
    else if (addTag=='Delete Tag' && selectedTag!=='Add a new Tag'){
      const tempTag = existingTags.filter(c=>c.tag==selectedTag).map(c=>c.id)[0];
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring, tag, time) values (?,?,?,?,?,?,?,?)',[data.task,year,month,day,0,recurring?1:0,tempTag,0],
          (txtObj,resultSet)=> {    
            existingTasks.push({ id: resultSet.insertId, task: data.task, year:year, month:month, day:day, taskState:0, recurring:recurring?1:0, tag:tempTag, time:0});
            setTasks(existingTasks);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
        });
    }
    else {
      try {
        // Update the tags table
        await db.transaction(async (tx) => {
          tx.executeSql(
            'INSERT INTO tags (tag, color) VALUES (?, ?)',
            [data.tag, picked],
            (txtObj, tagResultSet) => {
              const tagId = tagResultSet.insertId;
              existingTags.push({ id: tagId, tag: data.tag, color: picked });
              setTags(existingTags); // Update the state with the new array of tags
                db.transaction((tx) => {
                  tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring, tag, time) values (?,?,?,?,?,?,?,?)',[data.task,year,month,day,0,recurring?1:0,tagId,0],
                    (txtObj,resultSet)=> {    
                      existingTasks.push({ id: resultSet.insertId, task: data.task, year:year, month:month, day:day, taskState:0, recurring:recurring?1:0, tag:tagId, time:0});
                      setTasks(existingTasks);
                    },
                    (txtObj, error) => console.warn('Error inserting data:', error)
                  );
                });
            }
          );
        });
      } catch (error) {
        console.warn('Error inserting data:', error);
      }
    }
    setPicked('white');
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
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
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
              <Button title={addTag} onPress={() => (setTagDisplay(tagDisplay==='none'? 'flex' : 'none'), setAddTag(addTag==='Add Tag'? 'Delete Tag' : 'Add Tag'))}/>
              <View style={{display: tagDisplay, width:'70%', justifyContent: 'center'}}>
                <View style={{width:'100%', flexDirection: 'row'}}>
                  <View style={{width: '80%'}}>
                    <TagPicker load={load} loadx={loadx} tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag}/>
                  </View>
                  <View style={{flex:1, alignItems: 'flex-end', justifyContent: 'center'}}>
                    <Pressable onPress={selectedTag === 'Add a new Tag' ? colorPickerVisible => setColorPickerVisible(true): null} style={[styles.color, {backgroundColor: selectedTag!==null ? (selectedTag=='Add a new Tag' ? picked : tags.filter(c=>c.tag==selectedTag).map(c=>c.color)[0]):'white'}]}/>
                  </View>
                  <ColorPicker TagColor={TagColor} colorChoice={colorChoice} colorPickerVisible={colorPickerVisible} setColorPickerVisible={setColorPickerVisible}/>
                </View>
                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', display: (selectedTag==='Add a new Tag' ? 'flex' : 'none')}}>
                  <Controller
                  control= {control}
                  name="tag"
                  render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                      <>
                      <View style={[styles.input,{width:'100%'}]}>
                          <TextInput
                              value={selectedTag !== (null||'Add a new Tag') ? selectedTag : value}
                              onChangeText={onChange}
                              autoCapitalize = {"characters"}
                              onBlur={onBlur}
                              style={[{height:40},{borderColor: error ? 'red' : '#e8e8e8'}]}
                          />
                      </View>
                      {error && (
                      <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                      )}
                      </>
                    )}
                  rules={{
                      required: selectedTag==='Add a new Tag' ? 'Input a Tag' : false,
                      minLength: {
                          value: 3,
                          message: 'Task should be at least 3 characters long',
                      },
                      maxLength: {
                          value: 18,
                          message: 'Task should be max 18 characters long',
                      },
                      validate: existingtag || 'This tag already exists'
                  }}
                  />
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

