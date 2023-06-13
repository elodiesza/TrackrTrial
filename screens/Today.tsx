import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import DaysInMonth from '../components/DaysInMonth';
import Swiper from 'react-native-swiper';
import TodayTasks from '../components/TodayTasks';

const Today = () => {

  var today = new Date();
  var nbDays = DaysInMonth(today);


  return (
    <View style={styles.container}>
      <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false}>
        <View>
          <Text>Hello</Text>
        </View>
        <TodayTasks/>
      </Swiper>
    </View>
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
