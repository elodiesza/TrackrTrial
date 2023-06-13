import { FlatList, StyleSheet, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import NewTask from '../modal/NewTask';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function TodayTasks() {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const thisDay = today.getDate();

  const [tasks, setTasks] = useState([]);
  const [taskState, setTaskState] = useState<number>(0);

  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);

  
  useEffect(() => {
      setIsLoading(true);
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM tasks', null,
        (txObj, resultSet) => setTasks(resultSet.rows._array),
        (txObj, error) => console.log('error selecting tasks')
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

  const removeDb = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS tasks', null,
        (txObj, resultSet) => setTasks([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    });
    loadx(!load);
  }

  const updateTaskState = (id) => {
    let existingTasks=[...tasks];
    const indexToUpdate = existingTasks.findIndex(task => task.id === id);
    if (existingTasks[indexToUpdate].taskState==0){
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [1, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 1;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else if(existingTasks[indexToUpdate].taskState==1){
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [2, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 2;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else if(existingTasks[indexToUpdate].taskState==2){
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [3, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 3;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else {
      db.transaction(tx=> {
        tx.executeSql('UPDATE tasks SET taskState = ? WHERE id = ?', [0, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 0;
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
  };

  const Task = ({item}) => {
    return(
        <View style={styles.taskcontainer}>
          <Pressable onPress={()=> updateTaskState(item.id)}>
            <MaterialCommunityIcons name={item.taskState===0 ? 'checkbox-blank-outline' : (
              item.taskState===1 ? 'checkbox-intermediate' : (
              item.taskState===2 ? 'checkbox-blank' :
              'arrow-right-bold-box-outline')
            )} size={35} />
          </Pressable>
          <View style={styles.tasktext}>
            <Text style={styles.tasktext}>
              {item.task}
            </Text>
          </View>
        </View>
    )
  };

  const data = tasks.filter(c=>c.day==thisDay);

  const DeleteItem = ({ id }) => (
    <View style={{flex: 1,justifyContent: 'center', alignItems: 'flex-end', paddingRight: 25, backgroundColor:'darkred'}}>
      <Pressable onPress={ () =>
        db.transaction(tx=> {
          tx.executeSql('DELETE FROM states WHERE id = ?', [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(task => task.id !==id);
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log(error)
          );       
        })  
      }>
          <Feather name="trash-2" size={25} color={'white'}/>
      </Pressable> 
    </View>
  );


  return (
    <>
      <View style={styles.container}>
        <View style={styles.tasktitle}>
          <Text style={styles.titletext}>
            TODAY'S TASKS
          </Text>
        </View>
        <SwipeListView data={data} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
                renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
                rightOpenValue={-80}
                disableRightSwipe={true}
                closeOnRowBeginSwipe={true}/>
      </View>
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} />
      </ TouchableOpacity> 
      <NewTask
      addModalVisible={addModalVisible===true}
      setAddModalVisible={setAddModalVisible}
      load={load}
      loadx={loadx}
      db={db}
      tasks={tasks}
      setTasks={setTasks}
      />
    </>
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
    backgroundColor: 'white',
    paddingLeft: 20,
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
