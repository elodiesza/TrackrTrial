import { FlatList, TextInput, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {container, colors} from '../styles.js';
import { useForm, Controller, set } from 'react-hook-form';


const width = Dimensions.get('window').width;

const AddScale = ({ name, scales, scalerecords, setScalerecords, db,year,month,day, load, loadx, setScaleModalVisible}) => {
    const {control, handleSubmit, reset} = useForm();

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)]
         : null;
      }
      function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
        var channelA = colorChannelA*amountToMix;
        var channelB = colorChannelB*(1-amountToMix);
        return parseInt(channelA+channelB);
      }
      function colorMixer(rgbA, rgbB, amountToMix){
        var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
        var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
        var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
        return "rgb("+r+","+g+","+b+")";
      }
    const mincolor = scales.filter(c=>c.name==name).map(c=>c.mincolor)[0]==null? [255,255,255]: hexToRgb(scales.filter(c=>c.name==name).map(c=>c.mincolor)[0]);
    const maxcolor = scales.filter(c=>c.name==name).map(c=>c.maxcolor)[0]==null? [255,255,255]: hexToRgb(scales.filter(c=>c.name==name).map(c=>c.maxcolor)[0]);
    const minvalue = scales.filter(c=>c.name==name).map(c=>c.min)[0]==null?Math.min(...scalerecords.filter(c=>(c.name==name && c.value!==null)).map(c=>c.value)):scales.filter(c=>c.name==name).map(c=>c.min)[0];
    const maxvalue = scales.filter(c=>c.name==name).map(c=>c.max)[0]==null?Math.max(...scalerecords.filter(c=>(c.name==name && c.value!==null)).map(c=>c.value)):scales.filter(c=>c.name==name).map(c=>c.max)[0];
    const amountomix = maxvalue==minvalue? 0.5:((maxvalue-scalerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.value)[0])/(maxvalue-minvalue)).toFixed(2);
    const colormix = mincolor!==null && maxcolor!==null?colorMixer(mincolor,maxcolor,amountomix):colors.primary.white;

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
    <View style={{height:70, marginTop:10}}>
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
                            placeholder={scalerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.value)[0]==null?'':scalerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.value)[0].toString()}
                            style={[container.textinput,{backgroundColor:colormix,width: 80, borderColor: error ? 'red' : '#e8e8e8'}]}
                        />
                        {error && (
                            <Text style={{color: colors.primary.red, alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
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
