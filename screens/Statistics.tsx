import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import LastMonth from '../components/LastMonth';

const width = Dimensions.get('window').width;

const Statistics = ({states, tags, setStates, setTags, load, loadx}) => {
  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);
  const [isLoading, setIsLoading] = useState(false);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);

  useEffect(() => {
    if (states.filter(c=>(c.year==year && c.month==month-1))=="") {
      setFirstMonth(true);
    }
    else{
      setFirstMonth(false);
    }
    if (states.filter(c=>(c.year==year && c.month==month+1))=="") {
      setLastMonth(true);
    }
    else{
      setLastMonth(false);
    }
  },[])

  const LastMonth = () => {
    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
    if (states.filter(c=>(c.year==year && c.month==month-2))==""){
      setFirstMonth(true);
    }
    setLastMonth(false);
  };

  const NextMonth = () => {
    if (month==11){
      setMonth(0);
      setYear(year+1);
    }
    else {
      setMonth(month+1);
    }
    if (states.filter(c=>(c.year==year && c.month==month+2))==""){
      setLastMonth(true);
    }
    setFirstMonth(false);
  };



  const IndList = ({item}) => {
    let gauge=0;
    for (var i=0;i<DaysInMonth(year,month);i++){
      gauge = gauge + states.filter(c=>(c.name==item.name && c.month==month && c.year==year)).map(c=>c.state)[i];
    }
    gauge=gauge/DaysInMonth(year,month);
    return(
      <View style={{width:width}}>
        <View style={{flex:1, width: width, height:40, justifyContent:'center', paddingLeft:20, backgroundColor: tags.filter(c=>c.id==item.tag).map(c=>c.color)[0], opacity:0.2}}/>
        <View style={{flex:1, width: width*gauge, height:40, justifyContent:'center',position:'absolute', paddingLeft:20, backgroundColor: tags.filter(c=>c.id==item.tag).map(c=>c.color)[0], opacity:0.7}}/>
        <View style={{flex:1, width: width, height:40, justifyContent:'center', paddingLeft:20,position:'absolute'}}>
          <Text style={{textAlignVertical:'center'}}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };

  if (!states || states.length === 0) {
    // Render loading state or placeholder component
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={firstMonth? undefined:()=>LastMonth(states)}>
          <Feather name='chevron-left' size={40} style={{right:30}} color={firstMonth? 'lightgray':'black'}/>
        </Pressable>
        <View>
          <Text style={{fontSize:10, textAlign:'center'}}>{moment(new Date(year,1,1)).format('YYYY')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{moment(new Date(0,month,1)).format('MMMM')}</Text>
        </View>
        <Pressable onPress={lastMonth? undefined:NextMonth}>
          <Feather name='chevron-right' size={40} style={{left:30}} color={lastMonth?'lightgray':'black'}/>
        </Pressable>
      </View>
      <View style={styles.body}>
        <FlatList
          data={states.filter(c=>(c.day==1 && c.month==month && c.year==year))}
          renderItem={(item)=>IndList(item)}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
}


export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',    
  },
  body: {
    flex:15,
  }
});
