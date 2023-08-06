import React from 'react';
import { View, Text, StyleSheet, Pressable,TouchableOpacity, Dimensions } from 'react-native';

const IndicatorTableTitle = ({name, year, month, setModalVisible,scaleInd, scalerecords}) => {

    return (
            <TouchableOpacity onPress={()=>setModalVisible(name)} style={{width:1, height:1}}>
                <View style={[styles.polygon, {backgroundColor: 'white', 
                width: (scaleInd&&scalerecords.filter(c=>(c.year==year && c.month==month && c.name==name && c.value>1000)).length>0)?51:(scaleInd&&scalerecords.filter(c=>(c.year==year && c.month==month && c.name==name && c.value>100)).length>0)?39:26}]} />
                <Text numberOfLines={1} style={styles.indText}>{name}</Text>
            </TouchableOpacity>
       );     
};

const styles = StyleSheet.create({
    polygon: {
        width: 26,
        height: 75,
        borderWidth: 0.3,
        borderColor: 'gray',
        opacity: 1,
    },
    indText: {
        position: 'absolute',
        transform: [{scaleY: 0.5}, { rotate: "-90deg" },{skewX: '-45deg'}],
        width: 120,
        left: -46,
        bottom: -46,
    }
});

export default IndicatorTableTitle;