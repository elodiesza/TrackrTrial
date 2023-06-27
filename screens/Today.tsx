import { FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import TodayTasks from '../components/TodayTasks';
import * as SQLite from 'expo-sqlite';

const Today = () => {

  var today = new Date();
  const [tags, setTags] = useState([]);
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);

  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT, color TEXT, UNIQUE(tag))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tags', null,
      (txObj, resultSet) => setTags(resultSet.rows._array),
      (txObj, error) => console.log('error selecting tags')
      );
    });

    setIsLoading(false);

  },[load]);


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
