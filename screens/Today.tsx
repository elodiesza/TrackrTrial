import { FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import TodayTasks from '../components/TodayTasks';


const Today = ({db, tasks, setTasks, tags, setTags}) => {

  var today = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [load, loadx] = useState(false);



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
        <View>
          <Text>Hello</Text>
        </View>
        <TodayTasks tags={tags} setTags={setTags}/>
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
