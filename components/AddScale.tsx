import { FlatList, TextInput, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {container, colors} from '../styles.js';
import { useForm, Controller, set } from 'react-hook-form';


const width = Dimensions.get('window').width;

const AddScale = ({ name, scales, setScales, scalerecords, setScalerecords, db,year,month,day, load, loadx, setScaleModalVisible}) => {
    const {control, handleSubmit, reset} = useForm();
    const [scaleValue, setScaleValue] = useState(0);

    const updateScale = (data) => {
        const existingrecords = [...scalerecords];
        let scaleId = existingrecords.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
        let scaleIndex = existingrecords.findIndex(c => c.id === scaleId);
        db.transaction(tx=> {
            tx.executeSql('UPDATE scalerecords SET value = ? WHERE id= ?', [data.value, scaleId],
                (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    existingrecords[scaleIndex].value = data.value;
                    setScalerecords(existingrecords);
                }
                },
                (txObj, error) => console.log('Error updating data', error)
            );
        });
        setScaleModalVisible(false);
        loadx(!load);
    };

  return (
    <View style={{alignContent:'center', justifyContent:'center', marginTop:10}}>
        <Text style={{textAlign:'center'}}>{name}</Text>
        <View style={{flex:1, flexDirection: 'row', width:'100%', alignItems: 'center', justifyContent:'center'}}>
            <Controller
                        control= {control}
                        name="value"
                        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                            <>
                            <TextInput
                                value={value}
                                onChangeText={(text) => {// Remove any non-numeric characters using a regular expression
                                    const intValue = text.replace(/\D/g, '');
                                    // Set the cleaned integer value back to the input field
                                    onChange(intValue);}}
                                onBlur={onBlur}
                                placeholder="value"
                                style={[container.textinput,{width: 80, borderColor: error ? 'red' : '#e8e8e8'}]}
                            />
                            {error && (
                                <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                            )}
                            </>
                        )}
                        rules={{
                            required: 'Input a value',
                            validate: (value) => {
                                if (!/^\d*$/.test(value)) {
                                return 'Please enter a valid integer';
                                }
                                return true;
                            },
                        }}
            />
            <Pressable onPress={handleSubmit(updateScale)} style={[container.button,{width:40}]}>
                <Feather name="chevron-right" size={30} />
            </Pressable>
        </View>
    </View>
  );
}

export default AddScale;
