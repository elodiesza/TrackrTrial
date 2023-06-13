import { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { View, Pressable, Text, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import moment from 'moment';
import TaskItem from './TaskItem';

const today = moment(new Date()).format('YYYY-MM-DD');

function TodoToday({addTodoVisible, setAddTodoVisible, month, year, monthly, statex, setStatex}) {


  //sort by time and then by date
  const sortByTime = todo => {
    const sorter1 = (a, b) => {
      return new Date(a.time) - new Date(b.time)
    }
    todo.sort(sorter1);
  };
  sortByTime(todo);
  const sortByDate = todo => {
    const sorter = (a, b) => {
      return new Date(a.date) - new Date(b.date) 
    }
    todo.sort(sorter);
  };
  sortByDate(todo);
  const distantFuture = new Date(8640000000000000)
  const sorted = todo.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : distantFuture
    const dateB = b.date ? new Date(b.date) : distantFuture
    return dateA.getTime() - dateB.getTime()
  })

    //Keep only this month non recurring tasks
    const thisMonthTodo = (todo) => {
        var filteredTodo = todo.filter(
          (task) => task.recurrence === false
        ).filter(
          (task) => task.month === month
        ).filter(
          (task) => task.year === year
        );
      if(monthly===false){
        filteredTodo = filteredTodo.filter(
          (task) => task.date === today
        );        
      }
      return filteredTodo;
    };


  const renderTaskItem = ({ item }) => (
    <TaskItem update={true} addTodoVisible={addTodoVisible} setAddTodoVisible={setAddTodoVisible} monthly={false} statex={statex} setStatex={setStatex} task={item.task} year={item.year} month={item.month} state={item.state} id={item.id} date={item.date} time={item.time} color={item.color} tag={item.tag} />
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
                <SwipeListView data={[]} scrollEnabled={true} renderItem={renderTaskItem} 
                renderHiddenItem={renderDeleteItem} bounces={false} 
                rightOpenValue={-80}
                disableRightSwipe={true}
                closeOnRowBeginSwipe={true}/>
  );
};

export default TodoToday;


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