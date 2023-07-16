import { View, Text, StyleSheet, Pressable,SafeAreaView } from 'react-native';
import { container } from '../styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './Settings/Account';
import About from './Settings/About';
import Help from './Settings/Help';
import SettingsHome from './Settings/SettingsHome';

const Stack = createNativeStackNavigator();

const SettingsNavigator =()=> {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsHome" component={SettingsHome} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function Settings() {


  return (
    <SafeAreaView style={container.container}>
        <View style={container.header}>
            <Text style={container.headertitle}>SETTINGS</Text>
        </View>
        <SettingsNavigator/>
    </SafeAreaView>
      
  );
}

export default Settings;

const styles = StyleSheet.create({
    drawer: {
        width: '100%',
        backgroundColor: 'white',
        paddingLeft: 20,
        paddingRight: 20,
        
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
