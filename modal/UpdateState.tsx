
import { Platform, Modal, Alert, TouchableWithoutFeedback,TouchableOpacity, StyleSheet, TextInput, Pressable, Text, View, FlatList } from 'react-native';
import { container,colors } from '../styles';
import Color from '../components/Color';
import ColorPicker from '../components/ColorPicker';


function UpdateState({db, staterecords, setStaterecords, states, setStates, name, updateStateVisible, setUpdateStateVisible}) {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={updateStateVisible}
      onRequestClose={() => {
        setUpdateStateVisible(false);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setUpdateStateVisible(!updateStateVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
            <View style={container.modal}>
            <FlatList
                horizontal={true}
                data={[... new Set(states.filter(c=>c.name==name).map(c=>c.item))]}
                renderItem={({item,index})=><Color color={states.filter(c=>c.name==name).map(c=>c.color)[index]}/>}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{width:"100%", alignItems:'center', justifyContent:'center'}}
            />
              <Pressable style={container.button}><Text>CREATE</Text></Pressable>
            <Text style={{color: 'gray', fontSize: 12, marginBottom:10}}>Must be up to 16 characters</Text>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

export default UpdateState;
