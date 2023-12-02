import { Dimensions,TouchableWithoutFeedback,TouchableOpacity, Pressable, Text, View } from 'react-native';
import { container,colors } from '../styles';
import { MaterialIcons} from '@expo/vector-icons';
import Modal from 'react-native-modal';

const width = Dimensions.get('window').width;

function DeleteDBvalid({deleteVisible, selectedData, setDeleteVisible, db,  
  habits, setHabits, moods, setMoods, sleep, setSleep, scalerecords, 
  setScalerecords, scales, setScales, states, setStates, staterecords, setStaterecords, 
  times, setTimes, weather, setWeather, timerecords, setTimerecords, diary, 
  setDiary, analytics, setAnalytics}) {


  function Delete() {
    if (selectedData=='habits') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS habits', null,
      (txObj, resultSet) => setHabits([]),
      (txObj, error) => console.log('error selecting tasks')
      )})
    }
    else if (selectedData=='moods') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS moods', null,
      (txObj, resultSet) => setMoods([]),
      (txObj, error) => console.log('error selecting tracks')
      )})
    }
    else if (selectedData=='states') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS states', null,
      (txObj, resultSet) => setStates([]),
      (txObj, error) => console.log('error selecting logs')
      )})
    }
    else if (selectedData=='staterecords') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS staterecords', null,
      (txObj, resultSet) => setStaterecords([]),
      (txObj, error) => console.log('error selecting logs')
      )})
    }
    else if (selectedData=='scales') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS scales', null,
      (txObj, resultSet) => setScales([]),
      (txObj, error) => console.log('error selecting logs')
      )})
    }
    else if (selectedData=='scalerecords') {
      db.transaction(tx=>{tx.executeSql('DROP TABLE IF EXISTS scalerecords', null,
      (txObj, resultSet) => setScalerecords([]),
      (txObj, error) => console.log('error selecting logs')
      )})
    }
    setDeleteVisible(false);
  };
 

  return (
    <Modal
      isVisible={deleteVisible}
      onBackdropPress={() => {
        setDeleteVisible(false);
      }}
        backdropColor='white'
        avoidKeyboard={true}
        style={{margin: 0,justifyContent:'flex-end',alignItems:'center', width:width}}
    > 
      <TouchableOpacity onPressOut={() => setDeleteVisible(false)} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={[container.newModal,{alignItems:'center'}]}>
                <View style={{width:"100%",flexDirection:'row', alignItems:'center', justifyContent:'flex-start'}}>
                    <Pressable onPress={() => setDeleteVisible(false)}>
                        <MaterialIcons name="keyboard-arrow-left" size={25} color={colors.primary.blue}/>
                    </Pressable>
                    <Text style={{left:20, flexWrap:'wrap'}}>Delete {selectedData} data definitely ?</Text>
                </View>
                <Pressable onPress={()=>Delete()} style={[container.button,{flexDirection:'row', alignItems:'center',justifyContent:'center',height:40, width:150, marginRight:5}]}>
                    <Text> DELETE </Text>
                </Pressable>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteDBvalid;