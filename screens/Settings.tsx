import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Octicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



function Settings() {
  const navigation = useNavigation();
    
  const onAccountPressed =()=> {navigation.navigate('Account')};
  const onAboutPressed =()=> {navigation.navigate('About')};
  const onHelpPressed =()=> {navigation.navigate('Help')};

  return (

      <View style={styles.drawer} >

          <Pressable onPress={onAccountPressed} style={styles.pressable}>
              <MaterialIcons name="account-circle" size={25} style={styles.icon}/>
              <Text style={styles.text}>Account</Text>
              <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.arrow}/>
          </Pressable>
          <Pressable onPress={onAboutPressed} style={styles.pressable}>
              <Octicons name="info" size={25} style={styles.icon}/>
              <Text style={styles.text}>About</Text>
              <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.arrow}/>
          </Pressable>
          <Pressable onPress={onHelpPressed} style={styles.pressable}>
              <Feather name="help-circle" size={25} style={styles.icon}/>
              <Text style={styles.text}>Help Center</Text>
              <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.arrow}/>
          </Pressable>
          <Pressable onPress={onHelpPressed} style={styles.pressable}>
              <MaterialIcons name="exit-to-app" size={25} style={styles.icon}/>
              <Text style={styles.text}>Sign Out</Text>
              <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.arrow}/>
          </Pressable>

      </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  root: {
      flex: 1,
      backgroundColor: '#F4F9FA',
  },
  container:{
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
},
header:{
    flex: 1,
    width: '100%',
    top: 20,
    padding : 10,
    flexDirection: 'row',
    justifyContent: 'space-between',     
},
body:{
    flex: 6,
    width: '100%',
    alignItems: 'center',
    justifyCenter: 'center',    
},
footer:{
    flex: 3,       
},
drawer: {
    width: '100%',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 40,
},
pressable: {
    height: 50,
    justifyContent: 'center',
},
text: {
    fontSize: 16,
    marginLeft: 35,
},
icon: {
    position: 'absolute',
},
arrow: {
    position: 'absolute',
    right: 0,
}

});
