import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList } from 'react-native';
import { container } from '../styles';
import Tab from '../components/Tab';
import { colors } from '../styles';

function Tracks() {
    const TabItem = ({item,index}) => {
        return (
            <View style={{position:'relative', marginLeft:-50, bottom:index==tabstitles.length-1?-1:0}}>
                <Tab zindex={''} color={colors.defaultlight} title={item.title}/>
            </View>
        );
    };
    const tabstitles =[{title: 'PROGRAMMING'}, {title: 'KOREAN'}, {title: 'BOOKS'}, {title: 'MOVIES'}];
    const tabstitleslength = tabstitles.length;

    return (

        <SafeAreaView style={container.container}>
            <View style={[container.header,{borderBottomWidth:0}]}>
                <Text style={{fontSize:20}}>TRACKS</Text>
            </View>
            <View style={{height:41, zIndex:1, bottom:-1}}>
                <FlatList
                    data={tabstitles.reverse()}
                    renderItem={({item,index}) => TabItem({item,index})}
                    horizontal={true}
                    keyExtractor={item => item.title}
                    contentContainerStyle={{flexDirection:'row-reverse',left:30}}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View style={[container.body,{borderTopWidth:1, borderTopColor: 'gray'}]}>
            
            </View>
        </SafeAreaView>
    );
}

export default Tracks;
