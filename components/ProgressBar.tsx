import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { container, colors} from '../styles';
import Slider from '@react-native-community/slider';



const width = Dimensions.get('window').width;

function ProgressBar({db, name, progress, setProgress, value, id, color}) {

  const [newProgress, setNewProgress] = useState(value);
  const [nameClicked, setNameClicked] = useState(false);

  const updateProgress = (id) => {
    let existingProgress=[...progress];
    const indexToUpdate = existingProgress.findIndex(c => c.id === id);
      db.transaction(tx=> {
        tx.executeSql('UPDATE progress SET progress = ? WHERE id = ?', [newProgress, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingProgress[indexToUpdate].progress = newProgress;
              setProgress(existingProgress);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
  };

  return (
    <View style={{flexDirection:'row',justifyContent:'center', alignItems:'center',backgroundColor:colors.primary.white,width:width, height:40}}>
        <Pressable onPress={()=>setNameClicked(!nameClicked)} style={{flex:nameClicked?3/4:1/4,justifyContent:'center', marginLeft:10}}>
          <Text style={{textAlign:'left'}}>{name}</Text>
        </Pressable>
        <View style={{flex: nameClicked? 1/4:3/4, alignItems:'center'}}>
          <Slider
            style={{width: '90%', height: 40}}
            value={value}
            onValueChange={(value) => {setNewProgress(value);updateProgress(id);}}
            step={1}
            thumbTintColor={color}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={color}
            maximumTrackTintColor={colors.primary.defaultlight}
          />
        </View>
    </View>
  );
}
export default ProgressBar;

