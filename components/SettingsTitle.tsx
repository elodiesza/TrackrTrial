import { View, Text, StyleSheet,Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../styles';


const SettingsTitle = ({title, returnpress}) => {
    return (
        <View style={styles.header}>
            <Pressable onPress={returnpress}>
                <MaterialIcons name="keyboard-arrow-left" size={25} style={{left:10}} color={colors.primary.blue}/>
            </Pressable>
            <Text style={{marginLeft:30}}>{title}</Text>
        </View>

    );
};
    
export default SettingsTitle;

const styles = StyleSheet.create({
    header:{
        height:40,
        alignItems:'center',
        justifyContent:'flex-start',
        flexDirection:'row',
    }
});