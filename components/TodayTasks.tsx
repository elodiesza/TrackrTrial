import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import NewTask from '../modal/NewTask';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import Color from './Color';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function TodayTasks({tags, setTags}) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const day = today.getDate();

  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [taskState, setTaskState] = useState<number>(0);

  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [date, setDate] = useState(today);

  
  useEffect(() => {
      setIsLoading(true);
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM tasks', null,
        (txObj, resultSet) => setTasks(resultSet.rows._array),
        (txObj, error) => console.log('error selecting tasks')
        );
      });

      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
      });
  
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM logs', null,
        (txObj, resultSet) => setLogs(resultSet.rows._array),
        (txObj, error) => console.log('error selecting states')
        );
      });

      console.warn(tasks);
      setIsLoading(false);
    },[load]);
    
    useEffect(() => {
      let existingLogs = [...logs];  
      db.transaction(tx => {
        tx.executeSql('INSERT INTO logs (year,month,day) values (?,?,?)',[year,month,day],
          (txtObj,resultSet)=> {    
            existingLogs.push({ id: resultSet.insertId, year:year, month:month, day:day});
            setLogs(existingLogs);
          },
        );
      });

      let lastLogIndex = existingLogs.indexOf(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0])-1;
      let lastLog = existingLogs[lastLogIndex];
      existingLogs=[];

      if (lastLog!==undefined) {
        var daysBetweenLastAndToday = Math.floor((today.getTime() - new Date(lastLog.year,lastLog.month,lastLog.day).getTime())/(1000*60*60*24));
        let existingTasks=[...tasks];
        let existingRecurringTasks=existingTasks.filter(c=>(c.recurring==1 && c.year==lastLog.year && c.month==lastLog.month && c.day==lastLog.day));
        for(var j=1;j<daysBetweenLastAndToday+1;j++){
          var newDate= new Date(new Date(lastLog.year,lastLog.month,lastLog.day).getTime()+j*1000*60*60*24);
          for (var i=0; i<existingRecurringTasks.length;i++){      
            let newTask=existingRecurringTasks[i].task;
            db.transaction(tx => {
              tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring) values (?,?,?,?,?,?)',[newTask,newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,1],
                (txtObj,resultSet)=> {   
                  existingTasks.push({ id: resultSet.insertId, task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:newDate.getDate(), taskState:0, recurring:1});
                },
              );
            });
          }
        }
        setTasks(existingTasks);
      }
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
  const removelogDb = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS logs', null,
        (txObj, resultSet) => setLogs([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    });
    loadx(!load);
  }

  const updateTaskState = (id) => {
    let existingTasks=[...tasks];
    const indexToUpdate = existingTasks.findIndex(task => task.id === id);
    let postponedTask = existingTasks[indexToUpdate].task;
    let nextDay= new Date(Math.floor(today.getTime()+(1000*60*60*24)));
    let nextDayYear = nextDay.getFullYear();
    let nextDayMonth = nextDay.getMonth();
    let nextDayDay = nextDay.getDate();
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
      if (existingTasks[indexToUpdate].recurring==0){
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
        db.transaction(tx => {
          tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring) values (?,?,?,?,?,?)',[postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0],
            (txtObj,resultSet)=> {   
              existingTasks.push({ id: resultSet.insertId, task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, taskState:0, recurring:0});
            },
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
      let postponedTaskId = existingTasks.filter(c=>(c.year==nextDayYear && c.month==nextDayMonth && c.day==nextDayDay && c.task==postponedTask)).map(c=>c.id)[0];
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM tasks WHERE id = ?', [postponedTaskId],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingTasks = [...tasks].filter(task => task.id !==postponedTaskId);
              setTasks(existingTasks);
            }
          },
          (txObj, error) => console.log(error)
        );       
      }) 
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
          <View style={{flex:6}}>
            <Text style={styles.tasktext}>
              {item.task}
            </Text>
          </View>
          <View style={{flex:1}}>
            <Color color={tags.filter(c=>c.id==item.tag).map(c=>c.color)[0]} />
          </View>
        </View>
    )
  };

  const NextDay = () => {
    setDate(new Date(date.setDate(date.getDate()+1)));
  };

  const PreviousDay = () => {
    setDate(new Date(date.setDate(date.getDate()-1)));
  };

  const dailyData = tasks.filter(c=>(c.day==date.getDate() && c.recurring==0));
  const recurringData = tasks.filter(c=>(c.day==date.getDate() && c.recurring==1));

  const DeleteItem = ({ id }) => (
    <View style={{flex: 1,justifyContent: 'center', alignItems: 'flex-end', paddingRight: 25, backgroundColor:'darkred'}}>
      <Pressable onPress={ () =>
        db.transaction(tx=> {
          tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
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
        <View style={styles.header}>
          <Pressable onPress={PreviousDay}>
            <Feather name='chevron-left' size={40} />
          </Pressable>
          <Text>
            {moment(date).format('dddd, DD MMMM YYYY')}
          </Text>
          <Pressable onPress={NextDay}>
            <Feather name='chevron-right' size={40}/>
          </Pressable>
        </View>
        <View style={styles.tasktitle}>
          <Text style={styles.titletext}>
            TODAY'S TASKS
          </Text>
        </View>
        <SwipeListView style={styles.dailyTasks} data={dailyData} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-80}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        <View style={styles.tasktitle}>
          <Text style={styles.titletext}>
            DAILY RECURRING TASKS
          </Text>
        </View>
        <SwipeListView style={styles.recurringTasks} data={recurringData} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-80}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        <Button title='remove Tasks' onPress={removeDb} />
        <Button title='remove Logs' onPress={removelogDb} />
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
        tags={tags}
        setTags={setTags}
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
  header:{
    width:width,
    height:40,
    borderBottomWidth:1,
    borderColor:'gray',
    justifyContent:'center',
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center',
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
    textAlignVertical: 'center',
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
  },
  dailyTasks:{
    flex:4,
  },
  recurringTasks:{
    flex:1,
  }
});
