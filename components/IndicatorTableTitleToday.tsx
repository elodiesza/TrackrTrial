import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {colors} from '../styles';

const IndicatorTableTitleToday = ({name, state, tracks, habits, year, month}) => {


    return (
            <View style={{width:1, height:1}}>
                <View style={[styles.polygon, {backgroundColor: colors.primary.white, opacity:state==1?1:0.1}]} /><Text numberOfLines={1} style={[styles.indText,{opacity: state==1?1:0.3}]}>{name}</Text>
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