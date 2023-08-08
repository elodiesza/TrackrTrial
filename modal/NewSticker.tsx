import { useState, useEffect } from 'react';
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { useForm, Controller, set } from 'react-hook-form';
import { container,colors } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';
import uuid from 'react-native-uuid';
import { StickerIcons } from '../constants/StickerIcons';


function NewSticker({db, stickers, setStickers, newStickerVisible, setNewStickerVisible}) {

  const {control, handleSubmit, reset} = useForm();
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [picked, setPicked] = useState(colors.primary.white);
  const [pickedIcon, setPickedIcon] = useState('');

  const data = [Object.values(StickerIcons.outline).slice(0,8),
                Object.values(StickerIcons.outline).slice(8,16),
                Object.values(StickerIcons.outline).slice(16,24),
                Object.values(StickerIcons.outline).slice(24,32),
                Object.values(StickerIcons.outline).slice(32,40)
              ]
  const dataFill = [Object.values(StickerIcons.fill).slice(0,8),
                Object.values(StickerIcons.fill).slice(8,16),
                Object.values(StickerIcons.fill).slice(16,24),
                Object.values(StickerIcons.fill).slice(24,32),
                Object.values(StickerIcons.fill).slice(32,40)
              ]

  const addSticker = async (data) => {
    let existingstickers = [...stickers]; 
      if(pickedIcon !== ''){
        db.transaction((tx) => {
            tx.executeSql(
              'INSERT INTO stickers (id, name, icon, color) VALUES (?, ?, ?, ?)',
              [ uuid.v4(),data.name, pickedIcon, picked],
              (txtObj, stateResultSet) => {
                const newSticker = {
                  id: uuid.v4(),
                  name: data.name,
                  icon: pickedIcon,
                  color: picked,
                };
                existingstickers.push(newSticker);
                setStickers(existingstickers); 
              }
            );
        });
        setNewStickerVisible(false);
      }
      else {
        console.warn('Please pick an icon')
      }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={newStickerVisible}
      onRequestClose={() => {
        setNewStickerVisible(!newStickerVisible);
        setPickedIcon('');
        setPicked(colors.primary.white);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setNewStickerVisible(!newStickerVisible);setPickedIcon('');setPicked(colors.primary.white);}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={container.modal}>
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
            <View style={{marginHorizontal:20,marginTop:10,flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Pressable onPress={()=>setColorPickerVisible(true)} style={{ marginRight:5 }}>
              <Color color={picked} />
            </Pressable>
            <ColorPicker
              colorPickerVisible={colorPickerVisible}
              setColorPickerVisible={setColorPickerVisible}
              picked={picked}
              setPicked={setPicked}
            />
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={container.textinput}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="name"
                />
              )}
              rules={{required: true}}
            />
            </View>
            <Pressable onPress={handleSubmit(addSticker)} style={container.button}><Text>CREATE</Text></Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default NewSticker;
