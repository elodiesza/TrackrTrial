import { FlatList, Pressable, Button, TouchableOpacity, Image, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {colors,container} from '../styles.js';
import {StickerIcons} from '../constants/StickerIcons.js';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

const StickerList = ({ db, stickers, setStickers, stickerrecords, setStickerrecords, year, month, day}) => {

  return (
    <View style={[container.container,{height:30,width:'100%',flexDirection:'row'}]}>
      <FlatList
        data={stickers.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.sticker)}
        renderItem={({item}) =>(
          <Ionicons name={item} size={30} color={item.color}/>
        )}
        keyExtractor={(c) => c!==undefined ? c.toString():''} 
        horizontal={true}
      />
    </View>
  );
}

export default StickerList;

