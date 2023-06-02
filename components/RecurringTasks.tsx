import { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { View, Pressable, Text, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import TaskItem from './TaskItem';

const today = moment(new Date()).format('YYYY-MM-DD');

function RecurringTasks({addTodoVisible, setAddTodoVisible, month, statex, setStatex}) {

  const [taskState, setTaskState] = useState<Number>(0);

  //sort by time and then by date

  
  
  const StateIcon = ({state}) => {
    return(
      <MaterialCommunityIcons name={state===0 ? 'checkbox-blank-outline' : (
        state===1 ? 'checkbox-intermediate' : (
          state===2 ? 'checkbox-blank' :
            'arrow-right-bold-box-outline')
      )} size={35} />
    )
  }

  const renderTaskItem = ({ item }) => (
    <TaskItem update={true} addTodoVisible={addTodoVisible} setAddTodoVisible={setAddTodoVisible} monthly={true} statex={statex} setStatex={setStatex} year={item.year} month={item.month} tag={item.tag} task={item.task} state={item.state} id={item.id} date={item.date} time={item.time} color={item.color} />
  );
  const DeleteItem = ({ id }) => (
    <View style={{flex: 1,justifyContent: 'center', alignItems: 'flex-end', paddingRight: 25, backgroundColor:'darkred'}}>
          <Feather name="trash-2" size={25} color={'white'}/>
    </View>
  );
  const renderDeleteItem = ({ item }) => (
    <DeleteItem id={item.id} />
  );


  return (
    <>
        <SwipeListView data={[]} scrollEnabled={true} renderItem={renderTaskItem} 
        renderHiddenItem={renderDeleteItem} bounces={false} 
        rightOpenValue={-80}
        disableRightSwipe={true}
        closeOnRowBeginSwipe={true}/>
    </>
    
  );
};

export default RecurringTasks;


const styles = StyleSheet.create({
  task: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  datetime: {
    textAlign: 'left',
    color: 'lightgray',
  },
  color: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'lightgray',
    margin: 10,
  },
});