import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import { SelectList } from 'react-native-dropdown-select-list';


function NewStatus({newStatusVisible, setNewStatusVisible, db, statuslist, setStatuslist, statusrecords, setStatusrecords, selectedTab, selectedSection}) {
  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();
  
  const { control: control1, handleSubmit: handleSubmit1, reset: reset1 } = useForm();
  const { control: control2, handleSubmit: handleSubmit2, reset: reset2 } = useForm();

  const [itemlist, setItemlist] = useState([{ colorPickerVisible: false, picked: '', value: undefined }]);
  const [selectedStatus, setSelectedStatus] = useState('');

  const ListOfStatuses = () => {
    let list = [];
    for (let i = 0; i < [...new Set(statuslist.map(c=>c.name))].length; i++) {
      list.push([[...new Set(statuslist.map(c=>c.name))][i]," : "+statuslist.filter(c=>c.name==[...new Set(statuslist.map(c=>c.name))][i]).map(c=>" "+c.item)]);
    }
    return list;
  }

  const AddItemtolist = () => {
    setItemlist((prevList) => [...prevList, { colorPickerVisible: false, picked: '' }]);
  };

  const RemoveItemfromlist = (index) => {
    setItemlist((prevList) => (prevList.filter((_, i) => i !== index)));
  };

  useEffect(() => {
    if (!newStatusVisible) {
      reset1();
    }
  }, [newStatusVisible, reset1]);

  const addStatus = async (data) => {
    let existingstatuslist = [...statuslist]; 
      for (let i = 0; i < itemlist.length; i++) {
        const newID=uuid.v4();
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO statuslist (id,name, item, color, number) VALUES (?,?,?,?,?)',
              [ newID,data.name, itemlist[i].value, itemlist[i].picked, i],
              (txtObj, stateResultSet) => {
                const newStatus = {
                  id: newID,
                  name: data.name,
                  item: itemlist[i].value,
                  color: itemlist[i].picked,
                  number: i,
                };
                existingstatuslist.push(newStatus);
                setStatuslist(existingstatuslist); 
              }
            );
        });
      }
    setItemlist([{ colorPickerVisible: false, picked: '', value: undefined }]);
  };
  const addStatusrecord = async (data) => {
    let existingstatusrecords = [...statusrecords];
    const selectedList = selectedStatus[0].toString();
    console.warn(selectedList);
        const newID=uuid.v4();
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO statusrecords (id,name, track, section, list, number,archive) VALUES (?,?,?,?,?,?,?)',
              [ newID,data.newrecord, selectedTab, selectedSection, selectedList, 0,false],
              (txtObj, stateResultSet) => {
                const newStatus = {
                  id: newID,
                  name: data.newrecord,
                  track: selectedTab,
                  section: selectedSection,
                  list: selectedList,
                  number: 0,
                  archive: false,
                };
                existingstatusrecords.push(newStatus);
                setStatusrecords(existingstatusrecords); 
              }
            );
        });
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
          control= {control1}
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
        setItemlist([{ colorPickerVisible: false, picked: '', value: undefined }]);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setNewStatusVisible(!newStatusVisible);setItemlist([{ colorPickerVisible: false, picked: '', value: undefined }]);}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={container.modal}>
                <View style={{width:'100%',height:50, zIndex:2}}>
                  <View style={{position:'absolute'}}>
                    <SelectList 
                    setSelected={(val) => setSelectedStatus(val)} 
                    data={[...ListOfStatuses(),{value:"CREATE A NEW STATUS"}]} 
                    save="value"
                    placeholder='select a status list'
                    boxStyles={{backgroundColor:colors.primary.white, width:250}}
                    dropdownStyles={{backgroundColor:colors.primary.white,maxHeight:150}}
                    dropdownTextStyles={{fontSize:10}}
                    />  
                  </View>
                </View>

                <Text style={{marginTop:10}}>NEW STATUS</Text>
                <View style={{display: selectedStatus!=="CREATE A NEW STATUS"? "none":"flex", width:250, justifyContent:'center', alignItems:'center'}}>
                  <Controller
                    control= {control1}
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
                    <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
                  <FlatList
                      data={itemlist}
                      renderItem={({item,index})=>ItemList({item,index})}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{width:"100%", alignItems:'center', justifyContent:'center'}}
                  />
                  <Pressable onPress={handleSubmit1(addStatus)} style={container.button}><Text>CREATE</Text></Pressable>
                </View>
                <Controller
                    control= {control2}
                    name="newrecord"
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
                    <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
                  <Pressable onPress={handleSubmit2(addStatusrecord)} style={container.button}><Text>CREATE</Text></Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewStatus;
