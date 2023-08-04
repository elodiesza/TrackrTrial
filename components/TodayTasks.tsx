import { TouchableOpacity, Button, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import NewTask from '../modal/NewTask';
import { Feather } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { container, colors } from '../styles';
import Task from './Task';
import uuid from 'react-native-uuid';


const width = Dimensions.get('window').width;

function TodayTasks({db, tasks, setTasks, tracks, setTracks, load, loadx, date, sections}) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const day = today.getDate();

  console.warn(tasks);

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  
  useEffect(() => {
  
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS logs (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
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
            tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',[ uuid.v4(),year,month,day],
              (txtObj,resultSet)=> {    
                existingLogs.push({ id: uuid.v4(), year:year, month:month, day:day});
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
            var daysBetweenLastAndToday = Math.floor((today.getTime() - new Date(lastLog.year,lastLog.month,lastLog.day).getTime())/(1000*60*60*24));
            for(var j=1;j<daysBetweenLastAndToday+1;j++){
              var newDate= new Date(new Date(lastLog.year,lastLog.month,lastLog.day).getTime()+j*1000*60*60*24);
              for (var i=0; i<existingRecurringTasks.length;i++){    
                let newTask=existingRecurringTasks[i].task;
                let copytrack=existingRecurringTasks[i].track;
                let copyTime=existingRecurringTasks[i].time;
                db.transaction(tx => {
                  tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,track,time, section) values (?,?,?,?,?,?,?,?,?,?)',
                  [ uuid.v4(),newTask,newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),0,1,copytrack,copyTime,undefined],
                    (txtObj,resultSet)=> {   
                      existingTasks.push({ id: uuid.v4(), task: newTask, year:newDate.getFullYear(), month:newDate.getMonth(), day:newDate.getDate(), taskState:0, recurring:1, track:copytrack, time:copyTime, section: undefined});
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
              tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',
              [ uuid.v4(),year,month,day],
                (txtObj,resultSet)=> {    
                  existingLogs.push({ id: uuid.v4(), year:year, month:month, day:day});
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
      db.transaction(tx => {
        tx.executeSql('INSERT INTO logs (id,year,month,day) values (?,?,?,?)',[ uuid.v4(),year,month,day-1],
          (txtObj,resultSet)=> {    
            existingLogs.push({ id: uuid.v4(), year:year, month:month, day:day-1});
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

  const dailyData = tasks.filter(c=>(c.day==date.getDate() && c.recurring==0 && c.monthly==false));
  const recurringData = tasks.filter(c=>(c.day==date.getDate() && c.recurring==1 && c.monthly==false));

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
        <SwipeListView 
          data={dailyData} 
          scrollEnabled={true} 
          renderItem={({ item }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
          sections={sections} date={date} task={item.task} taskState={item.taskState} id={item.id} track={item.track} 
          time={item.time} section={item.section} trackScreen={false}/>} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} 
          bounces={false} 
          rightOpenValue={-80}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
        <View style={container.subcategory}>
          <Text style={container.subcategorytext}>
            DAILY RECURRING TASKS
          </Text>
        </View>
        <SwipeListView 
          data={recurringData} 
          scrollEnabled={true} 
          renderItem={({ item }) => <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
          sections={sections} date={date} task={item.task} taskState={item.taskState} id={item.id} track={item.track} 
          time={item.time} section={undefined} trackScreen={false}/>} 
          renderHiddenItem={({ item }) => <DeleteItem id={item.id} />} bounces={false} 
          rightOpenValue={-80}
          disableRightSwipe={true}
          closeOnRowBeginSwipe={true}
        />
                <Button title='remove Tasks' onPress={removeDb} />
       {/* <Button title='Add yesterdayLog' onPress={addLog} />
        <Button title='remove Todays log' onPress={removeTodayLog} />

        <Button title='remove Logs' onPress={removelogDb} /> */}
      </View>
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} color={colors.primary.blue} />
      </TouchableOpacity> 
      <NewTask
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        db={db}
        tasks={tasks}
        setTasks={setTasks}
        tracks={tracks}
        track={undefined}
        section={undefined}
        pageDate={date}
        tracksScreen={false}
      />
    </>
  );
}
export default TodayTasks;
