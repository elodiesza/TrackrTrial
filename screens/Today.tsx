import { FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import TodayTasks from '../components/TodayTasks';
import TodayScreen from '../components/TodayScreen';


const Today = ({db, tasks, setTasks, tags, setTags, states, setStates, moods, setMoods, sleep, setSleep, load, loadx}) => {

  var today = new Date();
  const [isLoading, setIsLoading] = useState(false);


  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false}>
        <TodayScreen db={db} tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags} states={states} setStates={setStates} moods={moods} setMoods={setMoods} sleep={sleep} setSleep={setSleep} load={load} loadx={loadx}/>
        <TodayTasks db={db} tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags} load={load} loadx={loadx}/>
      </Swiper>
    </SafeAreaView>
  );
}

export default Today;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
