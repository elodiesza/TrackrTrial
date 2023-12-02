import { Dimensions,Modal,TouchableWithoutFeedback,TouchableOpacity, Pressable, Text, View } from 'react-native';
import { container,colors,text } from '../styles';
import { MaterialIcons} from '@expo/vector-icons';

const width = Dimensions.get('window').width;

function DeleteIndicatorValid({deleteVisible, selectedData, setDeleteVisible, db,  
  load, loadx, type}) {

  function Delete() {
    if (type === 'habit') {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM habits WHERE name = ?',
          [selectedData],
          (txObj, resultSet) => {
            console.log('Rows deleted:', resultSet.rowsAffected);
          },
          (txObj, error) => console.log('Error deleting rows', error)
        );
      });
    }
    setDeleteVisible(false);
    loadx(!load);
  };
 

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={deleteVisible}
      onRequestClose={() => {
        setDeleteVisible(!deleteVisible);
        loadx(!load);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => setDeleteVisible(false)} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={[container.modal]}>
                <Text>Delete</Text>
                <Text style={text.title}>{selectedData}</Text>
                <Text>data definitely ?</Text>
                <View style={{flexDirection:'row', width:'100%'}}>
                  <Pressable onPress={()=>Delete()} style={[container.button,{flex:1, flexDirection:'row', alignItems:'center',justifyContent:'center',height:40, marginRight:5}]}>
                    <Text> DELETE </Text>
                  </Pressable>
                  <Pressable onPress={() => setDeleteVisible(false)} style={[container.button,{flex:1,flexDirection:'row', alignItems:'center',justifyContent:'center',height:40, marginRight:5}]}>
                    <Text> CANCEL </Text>
                  </Pressable>
                </View>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteIndicatorValid;