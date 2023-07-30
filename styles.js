import { StyleSheet,Dimensions, Platform  } from "react-native";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const colors = {
    primary:{
        white: '#ffffff',
        default: '#D3DDDF',
        defaultlight: '#eff3f4',
        defaultdark: '#ADBBBD',
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
        gray: '#d3d3d3',  
        black: '#000000',
        transparent: '#000000',
    },
    pale:{
        white: '#ffffff',
        default: '#D3DDDF',
        defaultlight: '#eff3f4',
        defaultdark: '#ADBBBD',
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
        gray: '#d3d3d3',  
        black: '#000000',
        transparent: '#000000',
    }
};
export const container = StyleSheet.create({
    
    container: {
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary.white,
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
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: colors.primary.defaultlight,
    },
    subcategory: {
        width: width,
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        justifyContent: 'center',
        backgroundColor: colors.primary.white,
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
    },
    button: {
        height:40,
        width: "100%",
        borderWidth:1,
        borderColor: colors.primary.blue,
        borderRadius: 10,
        backgroundColor: colors.primary.default,
        justifyContent: 'center',
        alignItems: 'center',
        margin:5,
    },
    buttontext:{
        fontSize: 16,
        color: colors.black,
    },
    modal:{
        width: "70%",
        backgroundColor: colors.primary.defaultlight,
        borderColor: colors.primary.black,
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        shadowColor: colors.primary.black,
        shadowRadius: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.2,
    },
    textinput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        height:40,
        borderColor: colors.primary.black,
        paddingHorizontal:10,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
    },
    section:{
        width: "100%",
        height:40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        borderBottomWidth:1,
        borderBottomColor: colors.primary.gray,
    },
    tasktext: {
        textAlign:'left',
        marginLeft: 5,
        textAlignVertical: 'center',
    },
    taskcontainer: {
        width: width,
        flexDirection: 'row',
        height: 45,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        paddingLeft: 10,
    },
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: 'black',
        marginLeft: 30,
    }
});



export const paleColor = (color) => {
  // Extract the base color and pale color group name (e.g., "white" and "primary" from "#ffffff")
  const colorGroup = color.substring(1); // Remove the '#' symbol
  const baseColor = Object.keys(colors.primary).find((key) => colors.primary[key] === `#${colorGroup}`);

  // If the base color is found, get its corresponding paler color from the "pale" sub-object
  if (baseColor && colors.pale[baseColor]) {
    return colors.pale[baseColor];
  }

  // If the base color is not found or there's no paler color, return the default color
  return colors.primary.default;
};





