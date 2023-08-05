import { FlatList, Button, TouchableOpacity, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState,useEffect } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Feather } from '@expo/vector-icons';
import NewMTask from '../modal/NewMTask';
import { container } from '../styles';
import Task from './Task';
import uuid from 'react-native-uuid';


const width = Dimensions.get('window').width;

export default function MonthlyTasks({db, load, loadx, tracks, setTracks, year, month, tasks, setTasks}) {
  
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();
  const thisDay = today.getDate();
  const [isLoading, setIsLoading] = useState(true);
  const [mlogs, setMLogs] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS mlogs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mlogs', null,
      (txObj, resultSet) => setMLogs(resultSet.rows._array),
      (txObj, error) => console.log('error selecting mlogs')
      );
    });
    setIsLoading(false);
  },[load]);

  
  useEffect(() => {
    if (!isLoading && tasks.filter(c=>c.monthly==true).length > 0 && mlogs.filter(c=>(c.year==year && c.month==month))[0]==undefined) {
      if(mlogs.length > 0){
      let existingLogs = [...mlogs];  
      if(existingLogs.filter(c=>(c.year==year && c.month==month))[0]==undefined && isLoading==false){
        db.transaction(tx => {
          tx.executeSql('INSERT INTO mlogs (id,year,month) values (?,?,?)',[year,month],
            (txtObj,resultSet)=> {    
              existingLogs.push({ id: uuid.v4(), year:year, month:month});
              setMLogs(existingLogs);                      
            },
          );
        });
        let lastLogIndex = mlogs.length-1;
        let lastLog = mlogs[lastLogIndex];
        let existingTasks=[...tasks.filter(c=>c.monthly==true)];

        let existingRecurringTasks=(existingTasks.length==0)? '':existingTasks.filter(c=>(c.recurring==1 && c.year==lastLog.year && c.month==lastLog.month));
        existingLogs=[];

        if (lastLog!==undefined) {

          var monthsBetweenLastAndToday = (year-lastLog.year)*12+(month-lastLog.month);
          for(var j=0;j<monthsBetweenLastAndToday;j++){
            var newDate=new Date(lastLog.year,lastLog.month+j,1);
            for (var i=0; i<existingRecurringTasks.length;i++){    
              let newTask=existingRecurringTasks[i].task;
              let copytrack=existingRecurringTasks[i].track;
              let copyTime=existingRecurringTasks[i].time;
              db.transaction(tx => {
                tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,monthly,track,time) values (?,?,?,?,?,?,?,?,?,?)',
                [uuid.v4(),newTask,newDate.getFullYear(),newDate.getMonth(),1,0,1,true,copytrack,copyTime],
                  (txtObj,resultSet)=> {   
                    existingTasks.push({ id: uuid.v4(), task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:1, taskState:0, recurring:1, monthly: true, track:copytrack, time:copyTime});
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
        let existingLogs = [...mlogs];  
        if(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==thisDay))[0]==undefined && isLoading==false){
          db.transaction(tx => {
            tx.executeSql('INSERT INTO mlogs (id,year,month,day) values (?,?,?,?)',[uuid.v4(),year,month,thisDay],
              (txtObj,resultSet)=> {    
                existingLogs.push({ id: uuid.v4(), year:year, month:month, day:thisDay});
                setMLogs(existingLogs);
              },
            );
          });
        }
      }
    }
  },[isLoading, mlogs]);

  const TransferDaily = (id) => {
    let existingTasks = [...tasks];
    let toTransfer = tasks.filter(c=>(c.id==id))[0];
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,monthly,track,time,section) values (?,?,?,?,?,?,?,?,?,?,?)',
      [ uuid.v4(),toTransfer.task,thisYear,thisMonth,thisDay,toTransfer.taskState,0,false,toTransfer.track,undefined, undefined],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: uuid.v4(), task: toTransfer.task, year:thisYear, month:thisMonth, day:thisDay, taskState:toTransfer.taskState, recurring:0, monthly: false, track:toTransfer.track, time:undefined, section:undefined});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    })
    db.transaction(tx => {
      tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
        (txObj, resultSet2) => {
          if (resultSet2.rowsAffected > 0) {
            let existingTasks = [...tasks].filter(task => task.id !== id);
            setTasks(existingTasks);
          }
        },
        (txObj, error) => console.log(error)
      );
    })
  }

  const DeleteItem = ({ id }) => (
    <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
      <View style={{ width: width - 50, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: 'yellowgreen' }}>
        <Pressable onPress={()=>TransferDaily(id)}>
          <Feather name="calendar" size={25} color={'white'} />
        </Pressable>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
        <Pressable onPress={() => 
        db.transaction(tx => {
          tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(task => task.id !== id);
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log(error)
          );
        })}>
          <Feather name="trash-2" size={25} color={'white'} />
        </Pressable>
      </View>
    </View>
  );


  const removelogDb = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS mlogs', null,
        (txObj, resultSet) => setMLogs([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    });
    loadx(!load);
  }

  const updateTaskState = (id) => {
    let existingTasks=[...tasks.filter(c=>c.monthly==true)];
    const indexToUpdate = existingTasks.findIndex(task => task.id === id);
    let postponedTask = existingTasks[indexToUpdate].task;
    let nextDay= new Date(Math.floor(today.getTime()+(1000*60*60*24)));
    let nextDayYear = nextDay.getFullYear();
    let nextDayMonth = nextDay.getMonth();
    let nextDayDay = nextDay.getDate();
    let copytrack=existingTasks[indexToUpdate].track;
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
          tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring, monthly,track,time) values (?,?,?,?,?,?,?,?,?,?)',
          [ uuid.v4(),postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0,true,copytrack,copyTime],
            (txtObj,resultSet)=> {   
              existingTasks.push({ id:  uuid.v4(), task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, taskState:0, recurring:0, track:copytrack, time:copyTime});
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

  const dailyData = tasks.filter(c=>(c.year==year && c.month==month && c.recurring==0 && c.monthly==true));
  const recurringData = tasks.filter(c=>(c.year==year && c.month==month && c.recurring==1 && c.monthly==true));

  return (
    <>
      <View style={container.body}>
        <View style={container.subcategory}>
          <Text style={container.subcategorytext}>
            MONTHLY TASKS
          </Text>
        </View>
        <SwipeListView 
          style={styles.dailyTasks} 
          data={dailyData} 
          scrollEnabled={true} 
          renderItem={({ item }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
          sections={undefined} date={new Date(year,month,1)} task={item.task} taskState={item.taskState} id={item.id} track={undefined} 
          time={undefined} section={undefined} trackScreen={false}/>} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-100}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        <View style={container.subcategory}>
          <Text style={container.subcategorytext}>
            MONTHLY RECURRING TASKS
          </Text>
        </View>
        <SwipeListView 
          style={styles.recurringTasks} 
          data={recurringData} 
          scrollEnabled={true} 
          renderItem={({ item }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
          sections={undefined} date={new Date(year,month,1)} task={item.task} taskState={item.taskState} id={item.id} track={undefined} 
          time={undefined} section={undefined} trackScreen={false}/>} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-100}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
      </View>
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} />
      </ TouchableOpacity> 
      <NewMTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tracks={tracks}
        setTracks={setTracks}
        year={year}
        month={month}
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