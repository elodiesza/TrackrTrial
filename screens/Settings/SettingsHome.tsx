import { View, SafeAreaView, Text, Pressable, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles';
import { container } from '../../styles';
import { Octicons, MaterialIcons, Feather } from '@expo/vector-icons';


const SettingsHome = () => {
    const navigation = useNavigation();
    
    const onAccountPressed =()=> {navigation.navigate('Account')};
    const onAboutPressed =()=> {navigation.navigate('About')};
    const onHelpPressed =()=> {navigation.navigate('Help')};

    return (

        <SafeAreaView style={container.container}>
            <View style={[container.body,{justifyContent:'flex-start'}]}>
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
        </View>
        </SafeAreaView>

    );
};
    
export default SettingsHome;

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
        color: colors.primary.blue,
    }

});
