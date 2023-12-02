import React from 'react';
import { View, TextInput, FlatList, TouchableOpacity, TouchableWithoutFeedback, Modal, Text, Pressable, StyleSheet } from 'react-native';
import IsLoading from './IsLoading';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {container, colors, text} from '../styles';
import { Feather, Ionicons } from '@expo/vector-icons';
import ColorPicker from '../components/ColorPicker';
import DeleteIndicatorValid from './DeleteIndicatorValid';

const UpdateStatelist = ({db, data, updateStatelistVisible, setUpdateStatelistVisible, states, setStates, staterecords, setStaterecords, load, loadx}) => {
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
        let existingstates=[...states];
          let existingstates2=[...staterecords];
          db.transaction(tx=> {
            tx.executeSql('UPDATE staterecords SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet) => {
                setStates(existingstates);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          db.transaction(tx=> {
            tx.executeSql('UPDATE states SET name = ? WHERE name = ?', [value, data.name],
              (txObj, resultSet2) => {
                setStaterecords(existingstates2);
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
          loadx(!load);
          setUpdateStatelistVisible
      (!updateStatelistVisible);
      };

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={updateStatelistVisible}
            onRequestClose={() => {
              setUpdateStatelistVisible
          (!updateStatelistVisible);
              loadx(!load);
            }}
          >
                <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setUpdateStatelistVisible
              (!updateStatelistVisible)}} activeOpacity={1}>
                  <TouchableWithoutFeedback>
                    <View style={container.modal}>
                      <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center', height:40}}>
                        <Ionicons name={data==undefined?undefined:data.icon} size={16} color={colors.primary.blue} style={{marginHorizontal:10}}/>
                        <Text style={[text.title,{display:editname?'none':'flex', width:190, paddingLeft:10}]}>{data==undefined?undefined:value}</Text>
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
                                style={[container.textinput,{ borderColor: error ? 'red' : colors.primary.blue,display: editname ? 'flex' : 'none', width:190}]}
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
                        <FlatList 
                          data={states.filter((c)=>c.name==(data==undefined?undefined:data.name))}
                          renderItem={({item,index}) => (
                            <View style={{flexDirection:'row',alignItems:'center', marginBottom:5}}>
                              <Pressable style={[container.color,{backgroundColor:item.color,marginHorizontal:10}]}/>
                              <Text style={{width:'100%'}}>{item.item}</Text>
                            </View>
                          )}
                          keyExtractor={(item) => item.id.toString()}
                        />
                      <View style={{flexDirection: 'row', justifyContent:'center', alignItems:'center'}}>
                        <TouchableOpacity onPress={()=>EditInd()} style={[container.button,{flex:1}]}>
                          <Text>Change</Text>
                        </TouchableOpacity>
                        <Feather onPress={()=>setDeleteVisible(true)} name="trash" size={20} color={colors.primary.blue} style={{marginLeft:5}}/>
                        <DeleteIndicatorValid selectedData={data==undefined?undefined:data.name} type={'states'} deleteVisible={deleteVisible} setDeleteVisible={setDeleteVisible} db={db} load={load} loadx={loadx}/>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </TouchableOpacity>
                <IsLoading isLoading={isLoading}/>
        </Modal>
    )

};

export default UpdateStatelist;

