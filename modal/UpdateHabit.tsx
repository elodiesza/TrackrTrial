import React from 'react';
import { View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Modal, Text, Pressable, StyleSheet } from 'react-native';
import IsLoading from './IsLoading';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {container, colors, text} from '../styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import ColorPicker from '../components/ColorPicker';
import DeleteIndicatorValid from './DeleteIndicatorValid';

const UpdateHabit = ({db, data, changeModalVisible, setChangeModalVisible, type, update, setUpdate, update2, setUpdate2, load, loadx}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState(data==undefined?undefined:data.name);
    const {control, handleSubmit, reset} = useForm();
    const [editname, setEditname] = useState(false);
    const [productivitymode, setProductivitymode] = useState(data==undefined?undefined:data.productive);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [picked, setPicked] = useState(data==undefined?undefined:data.color);
    const [deleteVisible, setDeleteVisible] = useState(false);


    useEffect(() => {
      if(data!==undefined){
        setProductivitymode(data.productive);
        setPicked(data.color);
        setValue(data.name);
      }
    },[data])

    const EditInd = () => {
        let indupdate=[...update];
        if(type=='habit'){
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET productive = ? WHERE name = ?', [productivitymode, data.name],
              (txObj, resultSet2) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else if(type=='scale'){
          let indupdate2=[...update2];
          db.transaction(tx=> {
            tx.executeSql('UPDATE scalerecords SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          db.transaction(tx=> {
            tx.executeSql('UPDATE scales SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet2) => {
                setUpdate2(indupdate2);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else if(type=='state'){
          let indupdate2=[...update2];
          db.transaction(tx=> {
            tx.executeSql('UPDATE staterecords SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet) => {
                setUpdate(indupdate);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          db.transaction(tx=> {
            tx.executeSql('UPDATE states SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet2) => {
                setUpdate2(indupdate2);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }  
          loadx(!load);
          setChangeModalVisible(!changeModalVisible);
      };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={changeModalVisible}
            onRequestClose={() => {
              setChangeModalVisible(!changeModalVisible);
              loadx(!load);
            }}
          >
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setChangeModalVisible(!changeModalVisible)}} activeOpacity={1}>
                  <TouchableWithoutFeedback>
                    <View style={container.modal}>
                      <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center', height:40}}>
                        <Ionicons name={data==undefined?undefined:data.icon} size={16} color={colors.primary.blue} style={{marginRight:5}}/>
                        <Text style={[text.title,{display:editname?'none':'flex', width:150, paddingLeft:10}]}>{data==undefined?undefined:value}</Text>
                        <Controller
                        control= {control}
                        name="name"
                        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                            <>
                            <TextInput
                                value={value}
                                onChangeText={(val)=>setValue(val)}
                                autoCapitalize = {"characters"}
                                onBlur={onBlur}
                                placeholder={data==undefined?undefined:data.name}
                                style={[container.textinput,{ borderColor: error ? 'red' : colors.primary.blue,display: editname ? 'flex' : 'none', width:150}]}
                            />
                            {error && (
                                <Text style={[text.regular,{color: 'red', alignSelf: 'stretch'}]}>{error.message || 'Error'}</Text>
                            )}
                            </>
                        )}
                        rules={{
                            required: 'Input a name',
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
                        <Feather onPress={()=>setEditname(!editname)} name={editname?"check":"edit-2"} size={16} color={colors.primary.blue} style={{marginLeft:5}}/>
                      </View>
                      <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center', height:40}}>
                        <Pressable onPress={()=>setColorPickerVisible(true)} style={[container.color,{backgroundColor:data==undefined?undefined:data.color}]}/>
                        <ColorPicker
                          colorPickerVisible={colorPickerVisible}
                          setColorPickerVisible={setColorPickerVisible}
                          picked={picked}
                          setPicked={setPicked}
                        />
                        <Text style={[text.regular,{width:120, paddingLeft:10}]}>productivity mode</Text>
                        <Ionicons onPress={()=>setProductivitymode(!productivitymode)} name={"flame"} size={20} color={colors.primary.blue} style={{marginRight:5,display:productivitymode?'flex':'none'}}/>
                        <Ionicons onPress={()=>setProductivitymode(!productivitymode)} name={"flame-outline"} size={20} color={colors.primary.blue} style={{marginRight:5,display:productivitymode?'none':'flex'}}/>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>EditInd()} style={[container.button,{flex:1}]}>
                          <Text>Change</Text>
                        </TouchableOpacity>
                        <Feather onPress={()=>setDeleteVisible(true)} name="trash" size={20} color={colors.primary.blue} style={{marginLeft:5}}/>
                        <DeleteIndicatorValid selectedData={data==undefined?undefined:data.name} type={type} deleteVisible={deleteVisible} setDeleteVisible={setDeleteVisible} db={db} load={load} loadx={loadx}/>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </TouchableOpacity>
                <IsLoading isLoading={isLoading}/>
        </Modal>
    )

};

export default UpdateHabit;

