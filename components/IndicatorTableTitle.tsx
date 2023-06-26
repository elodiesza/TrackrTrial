import React from 'react';
import { View, Text, StyleSheet, Pressable,TouchableOpacity, Dimensions } from 'react-native';

const width = Dimensions.get('window').width;

const IndicatorTableTitle = ({name, tags, states, modalVisible, setModalVisible}) => {

    const IndicatorTag = states.filter(c=>(c.name==name && c.day==1)).map(c=>c.tag)[0];
    const IndicatorColor = IndicatorTag==0 ? 'white' : tags.filter(c=>c.id==IndicatorTag).map(c=>c.color)[0];

    return (
            <TouchableOpacity onPress={()=>setModalVisible(true)} style={{width:1, height:1, margin:12, left:-43}}>
                <View style={[styles.polygon, {backgroundColor: IndicatorColor}]} /><Text numberOfLines={1} style={styles.indText}>{name}</Text>
            </TouchableOpacity>
       );     
};

const styles = StyleSheet.create({
    polygon: {
        marginLeft: 31,
        width: 26,
        height: 75,
        borderWidth: 0.3,
        borderColor: '#71A4AC',
        opacity: 1,
    },
    indText: {
        position: 'absolute',
        transform: [{scaleY: 0.5}, { rotate: "-90deg" },{skewX: '-45deg'}],
        width: 120,
        marginLeft: 31,
        left: -46,
        bottom: -46,
    }
});

export default IndicatorTableTitle;