import { FlatList, StyleSheet, Text, View, Dimensions, Pressable } from 'react-native';
import { useState } from 'react';
import StateIcon from './StateIcon';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


export default function TodayTasks() {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const thisDay = today.getDate();

  const [taskState, setTaskState] = useState<number>(0);

  const Task = ({item}) => {
    return(
      <View style={styles.taskcontainer}>
        <StateIcon taskState={taskState} setTaskState={setTaskState} item={item}/>
        <View style={styles.tasktext}>
          <Text style={styles.tasktext}>
            {item}
          </Text>
        </View>
      </View>
    )
  };

  const data = ['Task 1', 'Task 2', 'Task 3', 'Task 4'];

  return (
    <View style={styles.container}>
      <View style={styles.tasktitle}>
        <Text style={styles.titletext}>
          TODAY'S TASKS
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <Task item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: 'black',
    marginLeft: 30,
  },
  taskcontainer: {
    width: width,
    flexDirection: 'row',
    height: 45,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  tasktext: {
    textAlign:'left',
    marginLeft: 5,
  },
  tasktitle: {
    width: width,
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'center',
  },
  titletext: {
    marginLeft: 20,
    fontSize: 20,
    color: 'gray',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  }
});
