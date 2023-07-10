import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IndicatorTableTitleToday = ({name, state, tags, habits, year, month}) => {

    const IndicatorTag = habits.filter(c=>(c.name==name && c.year==year && c.month==month && c.day==1)).map(c=>c.tag)[0];
    const IndicatorColor = IndicatorTag==0 ? 'white' : tags.filter(c=>c.id==IndicatorTag).map(c=>c.color)[0];

    return (
            <View style={{width:1, height:1}}>
                <View style={[styles.polygon, {backgroundColor: IndicatorColor, opacity:state==1?1:0.1}]} /><Text numberOfLines={1} style={[styles.indText,{opacity: state==1?1:0.3}]}>{name}</Text>
            </View>
       );     
};

const styles = StyleSheet.create({
    polygon: {
        width: 26,
        height: 75,
        borderWidth: 1,
        borderColor: 'black',
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

export default IndicatorTableTitleToday;