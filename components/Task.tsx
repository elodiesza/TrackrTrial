import { StyleSheet, Button, TouchableOpacity, Text, View, Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import { container} from '../styles';
import Color from './Color';
import { colors } from '../styles';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

function Task({db, tasks, setTasks, tracks, setTracks, sections, date,task, taskState, id ,track, time, section, trackScreen, archive}) {


  const updateTaskState = () => {
    let existingTasks=[...tasks];
    let indexToUpdate = existingTasks.findIndex(c => c.id === id);
    let postponedTask = existingTasks[indexToUpdate].task;
    let nextDay= date==undefined? undefined:new Date(Math.floor(date.getTime()+(1000*60*60*24)));
    let nextDayYear = date==undefined? undefined:nextDay.getFullYear();
    let nextDayMonth = date==undefined? undefined:nextDay.getMonth();
    let nextDayDay = date==undefined? undefined:nextDay.getDate();
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
      if (existingTasks[indexToUpdate].recurring==0 && date!==undefined){
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
          tx.executeSql('INSERT INTO tasks (id,task,year,month,day,taskState,recurring,track,time, section) values (?,?,?,?,?,?,?,?,?,?)',
          [ uuid.v4(),postponedTask,nextDayYear,nextDayMonth,nextDayDay,0,0,copytrack,copyTime, section],
            (txtObj,resultSet)=> {   
              existingTasks.push({ id: uuid.v4(), task: postponedTask, year: nextDayYear, month:nextDayMonth, day:nextDayDay, taskState:0, recurring:0, track:copytrack, time:copyTime, section:section});
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
    <Pressable onPress={()=> updateTaskState()}>
      <MaterialCommunityIcons name={taskState===0 ? 'checkbox-blank-outline' : (
        taskState===1 ? 'checkbox-intermediate' : (
        taskState===2 ? 'checkbox-blank' :
        'arrow-right-bold-box-outline')
      )} size={35} />
    </Pressable>
    <View style={{flex:6}}>
      <Text style={{marginLeft:5,display:(section==undefined || trackScreen)?"none":"flex",color:colors.primary.defaultdark, fontWeight:'bold'}}>
        {section} >
      </Text>        
      <Text style={container.tasktext}>
        {task}
      </Text>
    </View>
    <View style={{display:time==undefined?"none":"flex",width:60,height:45,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Text style={{fontSize:10, right:10}}>{time=="Invalid date"?undefined: time==undefined? undefined:taskTime}</Text>
    </View>
    <View style={{display:(trackScreen==true && date!==undefined||null)?"flex":"none",width:60,height:45,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
        <Text style={{fontSize:10, right:10}}>transfered</Text>
    </View>
    <View style={{display: (track==undefined || trackScreen==true || archive)? "none":"flex",width:45,height:45,justifyContent:'center', alignContent:'center', alignItems:'flex-end'}}>
      <Color color={tracks.filter(c=>c.track==track).map(c=>c.color)[0]}/>
    </View>
  </View>
  );
}
export default Task;

