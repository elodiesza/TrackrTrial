import { View, SafeAreaView, ScrollView, Text, Button, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { container,colors } from '../../styles';
import SettingsTitle from '../../components/SettingsTitle';
import { Ionicons } from '@expo/vector-icons';

const AdditionalFeatures = () => {
    const navigation = useNavigation();

    const onReturnPressed =()=> {navigation.dispatch(CommonActions.goBack())};

    return (

        <SafeAreaView style={container.container}>
            <SettingsTitle returnpress={onReturnPressed}title={'ADDITIONAL FEATURES'}/>
            <View style={container.body}>
                <View style={container.setting}>
                    <Ionicons name="logo-apple" size={25}/>
                    <Text style={{marginLeft:10, color:colors.primary.magenta}}>Link with apple data</Text>
                </View>
            </View>
        </SafeAreaView>

    );
};
    
export default AdditionalFeatures;