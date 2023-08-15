import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import { SelectList } from 'react-native-dropdown-select-list';


function NewStatus({newStatusVisible, setNewStatusVisible, db, statuslist, setStatuslist, statusrecords, setStatusrecords}) {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();


  
  const {control, handleSubmit, reset} = useForm();
  const [itemlist, setItemlist] = useState([{ colorPickerVisible: false, picked: '', value: undefined }]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const ListOfStatuses = () => {
    let list = [];
    for (let i = 0; i < [...new Set(statuslist.map(c=>c.name))].length; i++) {
      list.push({value: statuslist.filter(c=>c.name==[...new Set(statuslist.map(c=>c.name))][i]).map(c=>c.item)});
    }
    return list;
  }

  const AddItemtolist = () => {
    setItemlist((prevList) => [...prevList, { colorPickerVisible: false, picked: '' }]);
  };

  const RemoveItemfromlist = (index) => {
    setItemlist((prevList) => (prevList.filter((_, i) => i !== index)));
  };

  console.warn(statuslist,statusrecords)
  useEffect(() => {
    if (!newStatusVisible) {
      reset();
    }
  }, [newStatusVisible, reset]);


  const addStatus = async (data) => {
    let existingstatuslist = [...statuslist]; 
      for (let i = 0; i < itemlist.length; i++) {
        console.warn(uuid.v4(),data.name, itemlist[i].value, itemlist[i].picked, i);
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO statuslist (id,name, item, color, index) VALUES (?,?, ?, ?, ?)',
              [ uuid.v4(),data.name, itemlist[i].value, itemlist[i].picked, i],
              (txtObj, stateResultSet) => {
                const newState = {
                  id: uuid.v4(),
                  name: data.name,
                  item: itemlist[i].value,
                  color: itemlist[i].picked,
                  index: i,
                };
                existingstatuslist.push(newState);
                setStatuslist(existingstatuslist); 
              }
            );
        });
      }
    setNewStatusVisible(false);

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
        <Feather name='plus-circle' size={30} color={colors.primary.blue} style={{marginRight:5, bottom:10, marginTop: 10}}/>
      </Pressable>
    </View> 
    );
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newStatusVisible}
      onRequestClose={() => {
        setNewStatusVisible(!newStatusVisible);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setNewStatusVisible(!newStatusVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.modal}>
                <View>
                  <SelectList 
                  setSelected={(val) => setSelectedStatus(val)} 
                  data={ListOfStatuses()} 
                  save="value"
                  placeholder='status list'
                  boxStyles={{backgroundColor:colors.primary.white}}
                  dropdownStyles={{backgroundColor:colors.primary.white,height:150}}
                  />  
                </View>
                <Text>NEW STATUS</Text>
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
                required: 'Input a satus',
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
            <FlatList
                data={itemlist}
                renderItem={({item,index})=>ItemList({item,index})}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{width:"100%", alignItems:'center', justifyContent:'center'}}
            />
              <Pressable onPress={handleSubmit(addStatus)} style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewStatus;
