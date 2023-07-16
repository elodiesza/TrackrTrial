import { StyleSheet,Dimensions, Platform  } from "react-native";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const colors = {
    white: '#ffffff',
    default: '#000000',
    defaultlight: '#eff3f4',
    defaultmedium: '#000000',
    red: '#FF6347',
    orange: '#ffa500',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
    green: '#2e8b57',
    turquoise: '#afeeee',
    royalblue: '#4169e1',
    lightblue: '#ADD8E6',
    blue: '#007AFF',
    lavender: '#e6e6fa',
    purple: '#ba55d3',
    magenta: '#c71585',
    pink: '#ffc0cb',
    brown: '#a0522d',
    beige: '#ffebcd',
    gray: '#000000',  
    black: '#000000',
    transparent: '#000000',
    palered: '#000000',
    paleorange: '#000000',
    paleyellow: '#000000',
    paleyellowgreen: '#000000',
    palegreen: '#000000',
    paleturquoise: '#000000',
    paleroyalblue: '#000000',
    paleblue: '#000000',
    palelightblue: '#000000',
    palelavender: '#000000',
    palepurple: '#000000',
    palemagenta: '#000000',
    palepink: '#000000',
    palebrown: '#000000',
    palebeige: '#000000',
    palegray: '#f5f5f5',
    paleblack: '#000000',
};
export const container = StyleSheet.create({
    
    container: {
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    header: {
        width: width,
        height: height/18,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor:'gray',
        borderBottomWidth:1,
    },
    body: {
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: colors.defaultlight,
    },
    subcategory: {
        width: width,
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        justifyContent: 'center',
        backgroundColor: colors.white,
    },
    subcategorytext: {
        marginLeft: 20,
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
    },
    headerdate: {
        fontSize: 14,
    },
    headertitle: {
        fontSize: 20,
    }
});
