import { FlatList, TextInput, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {container, colors} from '../styles.js';
import { useForm, Controller, set } from 'react-hook-form';



const AddTime = ({ name, times, timerecords, setTimerecords, db,year,month,day, setTimeModalVisible}) => {
    const {control, handleSubmit, reset} = useForm();
    const thisTime= timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.value)[0];
    const [timeExists, setTimeExists] = useState(thisTime!==null);

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
    
    const mincolor = times.filter(c=>c.name==name).map(c=>c.mincolor)[0]==null? [255,255,255]: hexToRgb(times.filter(c=>c.name==name).map(c=>c.mincolor)[0]);
    const maxcolor = times.filter(c=>c.name==name).map(c=>c.maxcolor)[0]==null? [255,255,255]: hexToRgb(times.filter(c=>c.name==name).map(c=>c.maxcolor)[0]);
    const minhoursvalue = Math.min(...timerecords.filter(c=>(c.name==name && c.hours!==null)).map(c=>c.hours))*60;
    const maxhoursvalue = Math.max(...timerecords.filter(c=>(c.name==name && c.hours!==null)).map(c=>c.hours))*60;
    const minminutesvalue = Math.min(...timerecords.filter(c=>(c.name==name && c.hours!==null)).map(c=>c.minutes));
    const maxminutesvalue = Math.max(...timerecords.filter(c=>(c.name==name && c.hours!==null)).map(c=>c.minutes));
    const minvalue = minhoursvalue+minminutesvalue;
    const maxvalue = maxhoursvalue+maxminutesvalue;
    const amountomix = (maxvalue==minvalue || minvalue==null || maxvalue==null)? 0.5:((maxvalue-(timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.hours)[0]*60+timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.minutes)[0]))/(maxvalue-minvalue)).toFixed(2);
    const colormix = (mincolor==(null||undefined) || maxcolor==(null||undefined))?colors.primary.white:colorMixer(mincolor,maxcolor,amountomix);

    const updateTime = (data) => {
        const existingrecords = [...timerecords];
        let timeId = existingrecords.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
        let timeIndex = existingrecords.findIndex(c => c.id === timeId);
        db.transaction(tx=> {
            tx.executeSql('UPDATE timerecords SET hours = ?  WHERE id= ?', [data.hours, timeId],
                (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    existingrecords[timeIndex].hours = data.hours;
                    setTimerecords(existingrecords);
                }
                },
                (txObj, error) => console.log('Error updating data', error)
            );
        });
        db.transaction(tx=> {
            tx.executeSql('UPDATE timerecords SET minutes = ? WHERE id= ?', [data.minutes, timeId],
                (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    existingrecords[timeIndex].minutes = data.minutes;
                    setTimerecords(existingrecords);
                }
                },
                (txObj, error) => console.log('Error updating data', error)
            );
        });
        setTimeModalVisible==undefined? undefined: setTimeModalVisible(false);
    };

  return (
    <View style={{height:70}}>
            <Text style={{textAlign:'center'}}>{name}</Text>
        <View style={{flex:1, flexDirection: 'row', width:'100%', alignItems: 'center', justifyContent:'center'}}>
        <Controller
                control= {control}
                name="hours"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <>
                        <TextInput
                            value={value}
                            onChangeText={(text) => {
                                const intValue = text.replace(/\D/g, '');
                                const sanitizedValue = parseInt(intValue) > 23 ? 23 : intValue;
                                onChange(sanitizedValue);
                            }}
                            onBlur={onBlur}
                            placeholder={timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.hours)[0]==null?'HH':timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.hours)[0].toString()}
                            style={[container.textinput,{backgroundColor:colormix,flex:1, borderColor: error ? 'red' : '#e8e8e8'}]}
                        />
                        {error && console.warn(error.message || 'Error')}
                        </>
                )}
                    rules={{
                        required: 'Input a value',
                        validate: (value) => {
                            if (!/^\d*$/.test(value)) {
                                return 'Please enter a valid integer';
                            }
                            if (parseInt(value) > 59) {
                                return 'Value cannot be more than 23';
                            }
                            return true;
                        },
                }}
            />
            <Text> : </Text>
            <Controller
                control= {control}
                name="minutes"
                render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                    <>
                        <TextInput
                            value={value}
                            onChangeText={(text) => {
                                // Remove any non-numeric characters using a regular expression
                                const intValue = text.replace(/\D/g, '');

                                // Ensure the integer value is not more than 59
                                const sanitizedValue = parseInt(intValue) > 59 ? 59 : intValue;

                                // Set the cleaned integer value back to the input field
                                onChange(sanitizedValue);
                            }}
                            onBlur={onBlur}
                            placeholder={timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.minutes)[0]==null?'mm':timerecords.filter(c=>(c.year==year&&c.month==month&&c.day==day&&c.name==name)).map(c=>c.minutes)[0].toString()}
                            style={[container.textinput,{backgroundColor:colormix,flex:1, borderColor: error ? 'red' : '#e8e8e8'}]}
                        />
                        {error && console.warn(error.message || 'Error')}
                        </>
                )}
                    rules={{
                        required: 'Input a value',
                        validate: (value) => {
                            if (!/^\d*$/.test(value)) {
                                return 'Please enter a valid integer';
                            }
                            if (parseInt(value) > 59) {
                                return 'Value cannot be more than 59';
                            }
                            return true;
                        },
                }}
            />
            <Pressable onPress={handleSubmit(updateTime)} style={[container.button,{width:30,backgroundColor:timeExists?colors.primary.defaultdark:colors.primary.blue}]}>
                <Feather name="chevron-right" size={30} />
            </Pressable>
        </View>
    </View>
  );
}

export default AddTime;
