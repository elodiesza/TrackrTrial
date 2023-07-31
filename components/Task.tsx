import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import Color from './Color';
import { container} from '../styles';


const width = Dimensions.get('window').width;

function Task({db, tasks, setTasks, tags, setTags, sections, date,task, taskState, id ,tag, time, section, trackScreen}) {

  const [isLoading, setIsLoading] = useState(true);

  const updateTaskState = (id) => {
    let existingTasks=[...tasks];
    const indexToUpdate = existingTasks.findIndex(task => task.id === id);
    let postponedTask = existingTasks[indexToUpdate].task;
    let nextDay= new Date(Math.floor(date.getTime()+(1000*60*60*24)));
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
  const taskTime= time=="null"? "":moment(time).format('HH:mm');


  return (
    <View style={container.taskcontainer}>
    <Pressable onPress={()=> updateTaskState(id)}>
      <MaterialCommunityIcons name={taskState===0 ? 'checkbox-blank-outline' : (
        taskState===1 ? 'checkbox-intermediate' : (
        taskState===2 ? 'checkbox-blank' :
        'arrow-right-bold-box-outline')
      )} size={35} />
    </Pressable>
    <View style={{flex:6}}>
      <Text style={container.tasktext}>
        {task}
      </Text>
    </View>
    <View style={{width:60,height:45,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Text style={{fontSize:10}}>{time=="Invalid date"?undefined: time==undefined? undefined:taskTime}</Text>
    </View>
  </View>
  );
}
export default Task;

