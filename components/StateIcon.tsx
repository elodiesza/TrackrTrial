import React from 'react';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StateIcon = ( {taskState, setTaskState, item} ) => {

    const clickTask = () => {
        if (taskState==0){
          setTaskState(1);
        }
        else if (taskState==1){
          setTaskState(2);
        }
        else if (taskState==2){
          setTaskState(3);
        }
        else if (taskState==3){
          setTaskState(0);
        }
      };

    return (
      <Pressable onPress={clickTask}>
        <MaterialCommunityIcons name={taskState===0 ? 'checkbox-blank-outline' : (
            taskState===1 ? 'checkbox-intermediate' : (
                taskState===2 ? 'checkbox-blank' :
                'arrow-right-bold-box-outline')
          )} size={35} />
      </Pressable>
    );
};

export default StateIcon;