import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { container, colors} from '../styles';
import Slider from '@react-native-community/slider';



const width = Dimensions.get('window').width;

function Status({db, name, statuslist, statusrecords, setStatusrecords, index}) {

  const [newstatuslist, setNewstatuslist] = useState(value);
  const [nameClicked, setNameClicked] = useState(false);

  const updatestatuslist = (id) => {
    let existingstatuslist=[...statuslist];
    const indexToUpdate = existingstatuslist.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE statuslist SET statuslist = ? WHERE id = ?', [newstatuslist, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingstatuslist[indexToUpdate].statuslist = newstatuslist;
              setStatuslist(existingstatuslist);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
  };

  return (
    <View style={{flexDirection:'row',backgroundColor:colors.primary.white,width:width, height:40,flex:1}}>
        <Pressable onPress={()=>setNameClicked(!nameClicked)} style={{flex:nameClicked?3/4:1/4,justifyContent:'center', marginLeft:10}}>
          <Text style={{textAlign:'left'}}>{name}</Text>
        </Pressable>
        <View style={{flex: nameClicked? 1/4:3/4, alignItems:'center', justifyContent:'center'}}>
          <View style={{flex:1,borderWidth:1,borderRadius:10,position:'absolute', alignItems:'flex-start', justifyContent:'center', width:'90%', backgroundColor:colors.primary.white, height:30}}>
            <View style={{position:'absolute',borderRadius:10, width:value+'%', backgroundColor:color, height:28}}/>
          </View>
          <Slider
            style={{width: '91%', height: 40}}
            value={value}
            onValueChange={(value) => {setNewstatuslist(value);updatestatuslist(id);}}
            step={1}
            thumbTintColor={'transparent'}
            minimumValue={0}
            maximumValue={101}
            minimumTrackTintColor={'transparent'}
            maximumTrackTintColor={'transparent'}
          />
        </View>
    </View>
  );
}
export default Status;

