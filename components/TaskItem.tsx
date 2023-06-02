import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import moment from 'moment';

const today = moment(new Date()).format('YYYY-MM-DD');

const TaskItem = ( { update, addTodoVisible, setAddTodoVisible, monthly, statex, setStatex, task, year, tag, month, id, state, date, time, color } ) => {

    return (
        <View style={styles.task}>
        <View style={[styles.color, {backgroundColor: color}]}/>
        <View style={{ width: 50, justifyContent: 'center', alignItems: 'flex-start'}}>        
          <Text style={[styles.datetime,{color: date === today && state<2 ? 'orange' : (date < today && state<2 ? 'red' : 'lightgray')}]}>{date !== null ? moment(date).format('MM-DD'):''}</Text>
          <Text style={[styles.datetime,{color: (date === today || date < today) && time < today ? 'red' : 'lightgray'}]}>{time}</Text>
        </View>
        <Pressable onPress={() => setAddTodoVisible(true)} style={{flex:1, alignContent: 'center', justifyContent: 'center'}}>
          <Text style={{margin: 5}}>{task}</Text>        
        </Pressable>
        <View style={{ width: 40, justifyContent: 'center', alignItems: 'flex-end'}}>
        </View>
      </View>
    );
};

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

export default TaskItem;