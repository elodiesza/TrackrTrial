import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';


function NewState({newStateVisible, setNewStateVisible, addModalVisible, setAddModalVisible, load, loadx, db, habits, setHabits, states, setStates}) {


  const {control, handleSubmit, reset} = useForm();
  const [itemlist, setItemlist] = useState([{ colorPickerVisible: false, picked: '', value: undefined }]);

  const removeDb = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS states', null,
        (txObj, resultSet) => setStates([]),
        (txObj, error) => console.log('error deleting states')
      );
    });
    loadx(!load);
  }


  
  const AddItemtolist = () => {
    setItemlist((prevList) => [...prevList, { colorPickerVisible: false, picked: '' }]);
  };

  const RemoveItemfromlist = (index) => {
    setItemlist((prevList) => (prevList.filter((_, i) => i !== index)));
  };


  useEffect(() => {
    if (!newStateVisible) {
      reset();
    }
  }, [newStateVisible, reset]);


  const addState = async (data) => {
    let existingstates = [...states]; 
      for (let i = 0; i < itemlist.length; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO states (name, item, color) VALUES (?, ?, ?)',
              [data.name, itemlist[i].value, itemlist[i].picked],
              (txtObj, stateResultSet) => {
                const newStateId = stateResultSet.insertId;
                const newState = {
                  id: newStateId,
                  name: data.name,
                  item: itemlist[i].value,
                  color: itemlist[i].picked
                };
                existingstates.push(newState);
                setStates(existingstates); 
                loadx(!load);
              }
            );
        });
      }
    setNewStateVisible(false);
    setAddModalVisible(false);
    loadx(!load);

  };

  const ItemList = ({item,index}) => {
    const itemData = itemlist[index]; // Get the item data for this specific index
    const { colorPickerVisible, picked } = itemData;
    return (
      <View style={{width:"100%", justifyContent:'flex-start', alignItems:'flex-end'}}>
        <View style={{flexDirection:'row', width:"100%", justifyContent:'flex-start', alignItems:'flex-end'}}>
          <Pressable onPress={() => RemoveItemfromlist(index)} style={{ display: itemlist.length === 1 ? 'none' : 'flex' }}>
            <Feather name='minus-circle' size={30} color={colors.blue} style={{ marginRight: 5, bottom: 10 }} />
          </Pressable>
          <Controller
          control= {control}
          name={`item${index + 1}`}
          render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
              <>
          <TextInput
              value={item.value}
              onChangeText={(text) => {
                const updatedItems = [...itemlist];
                updatedItems[index] = { ...item, value: text };
                setItemlist(updatedItems);
                // Now call the onChange function provided by react-hook-form
                onChange(text);
              }}
              autoCapitalize = {"characters"}
              onBlur={onBlur}
              placeholder={"STATE "+index}
              style={[container.textinput,{flex:1,borderColor: error ? 'red' : '#e8e8e8'}]}
          />
          {error && (
              <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
          )}
          </>
      )}
      rules={{
          required: 'Input a state',
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
          <Pressable onPress={() => {
          // Toggle the colorPickerVisible state for this specific item
          setItemlist((prevList) =>
            prevList.map((item, i) =>
              i === index ? { ...item, colorPickerVisible: !item.colorPickerVisible } : item
            )
          );
        }}  style={{ bottom: 5 }}>
          <Color color={picked} />
        </Pressable>
        <ColorPicker
          colorPickerVisible={colorPickerVisible}
          setColorPickerVisible={(visible) => {setItemlist((prevList) =>
              prevList.map((item, i) =>i === index ? { ...item, colorPickerVisible: visible } : item));}}
          picked={picked}
          setPicked={(value) => {setItemlist((prevList) =>
              prevList.map((item, i) =>i === index ? { ...item, picked: value } : item));}}
        />
      </View>  
      <Pressable onPress={AddItemtolist} style={{display:index+1==itemlist.length?'flex':'none'}}>
        <Feather name='plus-circle' size={30} color={colors.blue} style={{marginRight:5, bottom:10, marginTop: 10}}/>
      </Pressable>
    </View> 
    );
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newStateVisible}
      onRequestClose={() => {
        setNewStateVisible(!newStateVisible);
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setAddModalVisible(!addModalVisible),setNewStateVisible(!newStateVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.modal}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start', marginBottom:10}}>
                    <Pressable onPress={() => setNewStateVisible(!newStateVisible)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.blue}/>
                    </Pressable>
                    <Text style={{left:20}}>NEW STATE</Text>
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
            <FlatList
                data={itemlist}
                renderItem={({item,index})=>ItemList({item,index})}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{width:"100%", alignItems:'center', justifyContent:'center'}}
            />
              <Pressable onPress={handleSubmit(addState)} style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewState;

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


