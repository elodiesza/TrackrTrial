
import { StyleSheet, FlatList, View, Text } from 'react-native';
import TrackerCell from '../components/TrackerCell';

function Trackers () {

  const data = Array.from({ length: 31 }, (_, index) => index + 1);
  const renderItem = ({item}: {item: number}) => (
    <TrackerCell item={item} />
  );
  return (
    <View style={styles.container} >
      <View style={{width:25, alignItems: 'center'}}>
        <FlatList
        data={data}
        renderItem={({item}) => <Text style={{textAlign: 'center', lineHeight:25}}>{item}</Text>}
        keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <View style={{justifyContent:'flex-start', flex:1}}>
        <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container:{
    flex: 1,
    flexDirection: 'row',
    marginTop: 100,
  },
});

export default Trackers;