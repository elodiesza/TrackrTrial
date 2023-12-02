import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import NewSticker from './NewSticker';


function NewState({newStateVisible, setNewStateVisible, addModalVisible, setAddModalVisible, load, loadx, db, states, setStates, staterecords, setStaterecords}) {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  const {control, handleSubmit, reset} = useForm();
  const [pickedIcon, setPickedIcon] = useState('');
  const [pickIcon, setPickIcon] = useState(false);
  const [itemlist, setItemlist] = useState([{ colorPickerVisible: false, picked: '', value: undefined }]);
  
  const AddItemtolist = () => {
    setItemlist((prevList) => [...prevList, { colorPickerVisible: false, picked: '', value: undefined}]);
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
    var newPlace = [... new Set(existingstates.map(c => c.name))].length; 
      for (let i = 0; i < itemlist.length; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO states (id, name, item, icon, color, place) VALUES (?,?,?, ?, ?, ?)',
              [ uuid.v4(),data.name, itemlist[i].value, pickedIcon, itemlist[i].picked, newPlace],
              (txtObj, stateResultSet) => {
                const newState = {
                  id: uuid.v4(),
                  name: data.name,
                  item: itemlist[i].value,
                  icon: pickedIcon,
                  color: itemlist[i].picked,
                  place: newPlace,
                };
                existingstates.push(newState);
                setStates(existingstates); 
              }
            );
        });
      }

    let existingrecords = [...staterecords];
      for (let i = 1; i < DaysInMonth(year, month) + 1; i++) {
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO staterecords (id,name, year, month, day, item) VALUES (?,?, ?, ?, ?, ?)',
              [ uuid.v4(),data.name, year, month, i, ''],
              (txtObj, stateResultSet) => {
                const newState = {
                  id: uuid.v4(),
                  name: data.name,
                  year: year,
                  month: month,
                  day: i,
                  item: '',
                };
                existingrecords.push(newState);
                setStaterecords(existingrecords); 
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
    const itemData = itemlist[index]; 
    const { colorPickerVisible, picked } = itemData;
    return (
      <View style={{width:"100%", justifyContent:'flex-start', alignItems:'flex-end'}}>
        <View style={{flexDirection:'row', width:"100%", justifyContent:'flex-start', alignItems:'flex-end'}}>
          <Pressable onPress={() => RemoveItemfromlist(index)} style={{ display: itemlist.length === 1 ? 'none' : 'flex' }}>
            <Feather name='minus-circle' size={30} color={colors.primary.blue} style={{ marginRight: 5, bottom: 10 }} />
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
        <Pressable onPress={() => {
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
        <Feather name='plus-circle' size={30} color={colors.primary.blue} style={{marginRight:5, bottom:10, marginTop: 10}}/>
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
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20}}>NEW STATE</Text>
                </View>
                <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
                  <Ionicons onPress={()=>setPickIcon(!pickIcon)} name={pickedIcon==''?'circle':pickedIcon} size={30} color={colors.primary.blue} style={{paddingRight:10}}/>
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
                      style={[container.textinput,{borderColor: error ? 'red' : '#e8e8e8', flex:1}]}
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
                <View style={{display:pickIcon?'flex':'none'}}>
                  <NewSticker db={db} picked={colors.primary.white} pickedIcon ={pickedIcon} setPickedIcon={setPickedIcon}/>
                </View>
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
