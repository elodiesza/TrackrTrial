import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import NewTask from '../modal/NewTask';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import Color from './Color';
import { container} from '../styles';


const width = Dimensions.get('window').width;

function TodayTasks({db, tasks, setTasks, tags, setTags, load, loadx, date, setDate}) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const day = today.getDate();

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  
  useEffect(() => {
  
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
      });
  
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM logs', null,
        (txObj, resultSet) => setLogs(resultSet.rows._array),
        (txObj, error) => console.log('error selecting states')
        );
      });
      setIsLoading(false);
    },[load]);
    
    useEffect(() => {
      if (!isLoading && tasks.length > 0 && logs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined) {
        if(logs.length > 0){
        let existingLogs = [...logs];  
        if(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined && isLoading==false){
          db.transaction(tx => {
            tx.executeSql('INSERT INTO logs (year,month,day) values (?,?,?)',[year,month,day],
              (txtObj,resultSet)=> {    
                existingLogs.push({ id: resultSet.insertId, year:year, month:month, day:day});
                setLogs(existingLogs);                      
              },
            );
          });
          let lastLogIndex = logs.length-1;
          let lastLog = logs[lastLogIndex];
          let existingTasks=[...tasks];

          let existingRecurringTasks=(existingTasks.length==0)? '':existingTasks.filter(c=>(c.recurring==1 && c.year==lastLog.year && c.month==lastLog.month && c.day==lastLog.day));
          existingLogs=[];

          if (lastLog!==undefined) {
            console.warn('enters');
            var daysBetweenLastAndToday = Math.floor((today.getTime() - new Date(lastLog.year,lastLog.month,lastLog.day).getTime())/(1000*60*60*24));
            console.warn(daysBetweenLastAndToday);
            for(var j=1;j<daysBetweenLastAndToday+1;j++){
              console.warn('enters');
              var newDate= new Date(new Date(lastLog.year,lastLog.month,lastLog.day).getTime()+j*1000*60*60*24);
              console.warn(newDate);
              console.warn(existingRecurringTasks.length);
              for (var i=0; i<existingRecurringTasks.length;i++){    
                console.warn('enters');  
                let newTask=existingRecurringTasks[i].task;
                console.warn(existingRecurringTasks[i].task);
                let copyTag=existingRecurringTasks[i].tag;
                let copyTime=existingRecurringTasks[i].time;
                db.transaction(tx => {
                  tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring,tag,time) values (?,?,?,?,?,?,?,?)',[newTask,newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,1,copyTag,copyTime],
                    (txtObj,resultSet)=> {   
                      existingTasks.push({ id: resultSet.insertId, task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:newDate.getDate(), taskState:0, recurring:1, tag:copyTag, time:copyTime});
                      setTasks(existingTasks);
                    },
                  );
                });
              }
            }
            setTasks(existingTasks);
          }
        }
        }
        else {
          let existingLogs = [...logs];  
          if(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined && isLoading==false){
            db.transaction(tx => {
              tx.executeSql('INSERT INTO logs (year,month,day) values (?,?,?)',[year,month,day],
                (txtObj,resultSet)=> {    
                  existingLogs.push({ id: resultSet.insertId, year:year, month:month, day:day});
                  setLogs(existingLogs);
                },
              );
            });
          }
        }
      }
    },[isLoading, logs]);

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
  }

  const addLog = () => {
    let existingLogs = [...logs];  
      console.warn('creates new log');
      db.transaction(tx => {
        tx.executeSql('INSERT INTO logs (year,month,day) values (?,?,?)',[year,month,day-1],
          (txtObj,resultSet)=> {    
            existingLogs.push({ id: resultSet.insertId, year:year, month:month, day:day-1});
            setLogs(existingLogs);
          },
        );
      });
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
  const removeTodayLog = () => {
    let existingLogs = [...logs];
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM logs WHERE day = ?',
        [day],
        (txObj, resultSet) => {
          setLogs(existingLogs.filter(c=>c.day!=day)),
          console.log('Log deleted successfully');
        },
        (txObj, error) => {
          // Handle error
          console.log('Error deleting logs:', error);
        }
      );
    });
  };

  const updateTaskState = (id) => {
    let existingTasks=[...tasks];
    const indexToUpdate = existingTasks.findIndex(task => task.id === id);
    let postponedTask = existingTasks[indexToUpdate].task;
    let nextDay= new Date(Math.floor(today.getTime()+(1000*60*60*24)));
    let nextDayYear = nextDay.getFullYear();
    let nextDayMonth = nextDay.getMonth();
    let nextDayDay = nextDay.getDate();
    let copyTag=existingTasks[indexToUpdate].tag;
    let copyTime=existingTasks[indexToUpdate].time;
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
          tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring,tag,time) values (?,?,?,?,?,?,?,?)',[postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0,copyTag,copyTime],
            (txtObj,resultSet)=> {   
              existingTasks.push({ id: resultSet.insertId, task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, taskState:0, recurring:0, tag:copyTag, time:copyTime});
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
    let taskTime= item.time=="null"? "":moment(item.time).format('HH:mm');
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
          <View style={{width:60,height:45,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
              <Text style={{fontSize:10}}>{taskTime=="Invalid date"?"":taskTime}</Text>
          </View>
          <View style={{flex:1}}>
            <Color color={tags.filter(c=>c.id==item.tag).map(c=>c.color)[0]} />
          </View>
        </View>
    )
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
      <View style={container.body}>
        <View style={container.subcategory}>
          <Text style={container.subcategorytext}>
            TODAY'S TASKS
          </Text>
        </View>
        <SwipeListView style={styles.dailyTasks} data={dailyData} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-80}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        <View style={container.subcategory}>
          <Text style={container.subcategorytext}>
            DAILY RECURRING TASKS
          </Text>
        </View>
        <SwipeListView style={styles.recurringTasks} data={recurringData} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-80}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        {/*<Button title='Add yesterdayLog' onPress={addLog} />
        <Button title='remove Todays log' onPress={removeTodayLog} />
        <Button title='remove Tasks' onPress={removeDb} />
  <Button title='remove Logs' onPress={removelogDb} />*/}
      </View>
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} />
      </ TouchableOpacity> 
      <NewTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tags={tags}
        setTags={setTags}
      />
    </>
  );
}
export default TodayTasks;

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