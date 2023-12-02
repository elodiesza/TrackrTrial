import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { StickerIcons } from '../constants/StickerIcons';


function NewSticker({db, picked, pickedIcon, setPickedIcon}) {



  const data = [Object.values(StickerIcons.outline).slice(0,7),
                Object.values(StickerIcons.outline).slice(7,14),
                Object.values(StickerIcons.outline).slice(14,21),
                Object.values(StickerIcons.outline).slice(21,28),
                Object.values(StickerIcons.outline).slice(28,35)
              ]
  const dataFill = [Object.values(StickerIcons.fill).slice(0,7),
                Object.values(StickerIcons.fill).slice(7,14),
                Object.values(StickerIcons.fill).slice(14,21),
                Object.values(StickerIcons.fill).slice(21,28),
                Object.values(StickerIcons.fill).slice(28,35)
              ]

  return (
          <View style={{height:150, width:"100%", backgroundColor:colors.primary.default, borderRadius:10, padding:10, alignItems:'center', marginVertical:5}}>
            <FlatList 
              data={data}
              renderItem={({item,index}) =>{
                let rowIndex=index;
                 return(
                  <FlatList
                    data={item}
                    renderItem={({item,index}) =>(
                      <TouchableOpacity onPress={()=>setPickedIcon(dataFill[rowIndex][index])}>
                        <View style={{position:'absolute',display:pickedIcon==dataFill[rowIndex][index]?"flex":"none"}}>
                          <Ionicons name={dataFill[rowIndex][index]} size={30} color={picked}/>
                        </View> 
                        <Ionicons name={item} size={30} color={colors.primary.blue}/>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(c) => c!==undefined ? c.toString():''}
                    horizontal
                    scrollEnabled={false}
                  />
              )}}
              keyExtractor={(c) => c!==undefined ? c.toString():''}
              scrollEnabled={false}
            />
          </View> 
  );
};

export default NewSticker;