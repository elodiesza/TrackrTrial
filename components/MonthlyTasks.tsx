import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import RecurringTasks from './RecurringTasks';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function MonthlyTasks() {


  return (
    <View style={styles.container}>
        <View style={styles.monthTodo}>
            </View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray'}}>
              <Text style={styles.monthlyRec}>
                Monthly recurring tasks :
              </Text>
        </View>
            
        <View style={styles.monthly}>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  thisMonth: {
    flex: 1,
  },
  monthly: {
    flex: 2,
    marginBottom: 10,
  },
  monthTodo: {
    flex: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  monthlyRec: {
    fontSize: 16,
    marginVertical: 10,
  }
});
