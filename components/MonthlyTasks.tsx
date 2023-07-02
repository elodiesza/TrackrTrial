import { FlatList, TouchableOpacity, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState,useEffect } from 'react';
import moment from 'moment';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Color from './Color';
import NewMTask from '../modal/NewMTask';


const width = Dimensions.get('window').width;

export default function MonthlyTasks({db, load, loadx, tags, setTags, year, month, tasks, setTasks}) {
  
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth();
  const day = today.getDate();
  const [isLoading, setIsLoading] = useState(true);
  const [mtasks, setMTasks] = useState([]);
  const [mlogs, setMLogs] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [date, setDate] = useState(today);
  
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS mtasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, tag INTEGER, time TEXT, UNIQUE(task,year,month,day))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mtasks', null,
      (txObj, resultSet) => setMTasks(resultSet.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS mlogs (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mlogs', null,
      (txObj, resultSet) => setMLogs(resultSet.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });
    setIsLoading(false);
  },[load]);

  useEffect(() => {
  
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS mlogs (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM mlogs', null,
      (txObj, resultSet) => setMLogs(resultSet.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });
    setIsLoading(false);
  },[load]);
  
  useEffect(() => {
    if (!isLoading && mtasks.length > 0 && mlogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined) {
      if(mlogs.length > 0){
      let existingLogs = [...mlogs];  
      if(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined && isLoading==false){
        db.transaction(tx => {
          tx.executeSql('INSERT INTO mlogs (year,month,day) values (?,?,?)',[year,month,day],
            (txtObj,resultSet)=> {    
              existingLogs.push({ id: resultSet.insertId, year:year, month:month, day:day});
              setMLogs(existingLogs);                      
            },
          );
        });
        let lastLogIndex = mlogs.length-1;
        let lastLog = mlogs[lastLogIndex];
        let existingTasks=[...mtasks];

        let existingRecurringTasks=(existingTasks.length==0)? '':existingTasks.filter(c=>(c.recurring==1 && c.year==lastLog.year && c.month==lastLog.month && c.day==lastLog.day));
        existingLogs=[];

        if (lastLog!==undefined) {

          var daysBetweenLastAndToday = Math.floor((today.getTime() - new Date(lastLog.year,lastLog.month,lastLog.day).getTime())/(1000*60*60*24));
          for(var j=1;j<daysBetweenLastAndToday+1;j++){
            var newDate= new Date(new Date(lastLog.year,lastLog.month,lastLog.day).getTime()+j*1000*60*60*24);
            for (var i=0; i<existingRecurringTasks.length;i++){    
              let newTask=existingRecurringTasks[i].task;
              let copyTag=existingRecurringTasks[i].tag;
              let copyTime=existingRecurringTasks[i].time;
              db.transaction(tx => {
                tx.executeSql('INSERT INTO mtasks (task,year,month,day,taskState,recurring,tag,time) values (?,?,?,?,?,?,?,?)',[newTask,newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,1,copyTag,copyTime],
                  (txtObj,resultSet)=> {   
                    existingTasks.push({ id: resultSet.insertId, task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:newDate.getDate(), taskState:0, recurring:1, tag:copyTag, time:copyTime});
                    setMTasks(existingTasks);
                  },
                );
              });
            }
          }
          setMTasks(existingTasks);
        }
      }
      }
      else {
        let existingLogs = [...mlogs];  
        if(existingLogs.filter(c=>(c.year==year && c.month==month && c.day==day))[0]==undefined && isLoading==false){
          db.transaction(tx => {
            tx.executeSql('INSERT INTO mlogs (year,month,day) values (?,?,?)',[year,month,day],
              (txtObj,resultSet)=> {    
                existingLogs.push({ id: resultSet.insertId, year:year, month:month, day:day});
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
    let toTransfer = mtasks.filter(c=>(c.id==id))[0];
    console.warn(toTransfer);
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring,tag,time) values (?,?,?,?,?,?,?,?)',[toTransfer.task,thisYear,thisMonth,day,toTransfer.taskState,0,toTransfer.tag,null],
      (txtObj,resultSet)=> {    
        existingTasks.push({ id: resultSet.insertId, task: toTransfer.task, year:thisYear, month:thisMonth,day:day, taskState:toTransfer.taskState, recurring:0, tag:toTransfer.tag, time:null});
        setTasks(existingTasks);
      },
      (txtObj, error) => console.warn('Error inserting data:', error)
      );
    })
    db.transaction(tx => {
      tx.executeSql('DELETE FROM mtasks WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingTasks = [...mtasks].filter(task => task.id !== id);
            setMTasks(existingTasks);
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
          tx.executeSql('DELETE FROM mtasks WHERE id = ?', [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...mtasks].filter(task => task.id !== id);
                setMTasks(existingTasks);
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

  const removeDb = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS mtasks', null,
        (txObj, resultSet) => setMTasks([]),
        (txObj, error) => console.log('error selecting tasks')
      );
    });
    loadx(!load);
  }
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
    let existingTasks=[...mtasks];
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
        tx.executeSql('UPDATE mtasks SET taskState = ? WHERE id = ?', [1, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 1;
              setMTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else if(existingTasks[indexToUpdate].taskState==1){
      db.transaction(tx=> {
        tx.executeSql('UPDATE mtasks SET taskState = ? WHERE id = ?', [2, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 2;
              setMTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
    }
    else if(existingTasks[indexToUpdate].taskState==2){
      if (existingTasks[indexToUpdate].recurring==0){
        db.transaction(tx=> {
          tx.executeSql('UPDATE mtasks SET taskState = ? WHERE id = ?', [3, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingTasks[indexToUpdate].taskState = 3;
                setMTasks(existingTasks);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
        db.transaction(tx => {
          tx.executeSql('INSERT INTO mtasks (task,year,month,day,taskState,recurring,tag,time) values (?,?,?,?,?,?,?,?)',[postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0,copyTag,copyTime],
            (txtObj,resultSet)=> {   
              existingTasks.push({ id: resultSet.insertId, task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, taskState:0, recurring:0, tag:copyTag, time:copyTime});
            },
          );
        });
      }
      else {
        db.transaction(tx=> {
          tx.executeSql('UPDATE mtasks SET taskState = ? WHERE id = ?', [0, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingTasks[indexToUpdate].taskState = 0;
                setMTasks(existingTasks);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
    }
    else {
      db.transaction(tx=> {
        tx.executeSql('UPDATE mtasks SET taskState = ? WHERE id = ?', [0, id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              existingTasks[indexToUpdate].taskState = 0;
              setMTasks(existingTasks);
            }
          },
          (txObj, error) => console.log('Error updating data', error)
        );
      });
      let postponedTaskId = existingTasks.filter(c=>(c.year==nextDayYear && c.month==nextDayMonth && c.day==nextDayDay && c.task==postponedTask)).map(c=>c.id)[0];
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM mtasks WHERE id = ?', [postponedTaskId],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingTasks = [...mtasks].filter(task => task.id !==postponedTaskId);
              setMTasks(existingTasks);
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
          <View style={{width:60,height:45,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
          </View>
          <View style={{flex:1}}>
            <Color color={tags.filter(c=>c.id==item.tag).map(c=>c.color)[0]} />
          </View>
        </View>
    )
  };

  const dailyData = mtasks.filter(c=>(c.year==year && c.month==month && c.recurring==0));
  const recurringData = mtasks.filter(c=>(c.year==year && c.month==month && c.recurring==1));

  return (
    <>
      <View style={styles.container}>
        <View style={styles.tasktitle}>
          <Text style={styles.titletext}>
            MONTHLY TASKS
          </Text>
        </View>
        <SwipeListView style={styles.dailyTasks} data={dailyData} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-100}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        <View style={styles.tasktitle}>
          <Text style={styles.titletext}>
            MONTHLY RECURRING TASKS
          </Text>
        </View>
        <SwipeListView style={styles.recurringTasks} data={recurringData} scrollEnabled={true} renderItem={({ item }) => <Task item={item} />} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-80}
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
        mtasks={mtasks}
        setMTasks={setMTasks}
        tags={tags}
        setTags={setTags}
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