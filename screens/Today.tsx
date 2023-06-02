import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import DaysInMonth from '../components/DaysInMonth';

const Today = () => {

  var today = new Date();
  var nbDays = DaysInMonth(today);

  return (
    <View style={styles.container}>
      <Text>{nbDays}</Text>
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
