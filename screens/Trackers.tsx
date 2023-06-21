import { StyleSheet, Modal, TouchableWithoutFeedback, Alert, Pressable, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import DaysInMonth from '../components/DaysInMonth';
import IndicatorTableTitle from '../components/IndicatorTableTitle';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import NewIndicator from '../modal/NewIndicator';
import IndicatorMenu from '../modal/IndicatorMenu';

const width = Dimensions.get('window').width;

const Trackers = () => {

  var today = new Date();
  var month = today.getMonth();
  var year = today.getFullYear();
  var nbDaysThisMonth = DaysInMonth(today);

  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [states, setStates] = useState([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  
    useEffect(() => {
      setIsLoading(true);
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM states', null,
        (txObj, resultSet) => setStates(resultSet.rows._array),
        (txObj, error) => console.log('error selecting states')
        );
      });
      setIsLoading(false);
    },[load]);

    if (isLoading) {
      return (
        <View>
          <Text> Is Loading...</Text>
        </View>
      )
    }

    const removeDb = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS states', null,
          (txObj, resultSet) => setStates([]),
          (txObj, error) => console.log('error selecting states')
        );
      });
      loadx(!load);
    }

    const deleteState = (name) => {
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM states WHERE name = ?', [name],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingStates = [...states].filter(state => state.name !==name);
              setStates(existingStates);
            }
          },
          (txObj, error) => console.log(error)
        );       
      });      
    };

    const updateState = (id) => {
      let existingStates=[...states];
      const indexToUpdate = existingStates.findIndex(state => state.id === id);
      if (existingStates[indexToUpdate].state==0){
        db.transaction(tx=> {
          tx.executeSql('UPDATE states SET state = ? WHERE id = ?', [1, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingStates[indexToUpdate].state = 1;
                setStates(existingStates);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
      else {
        db.transaction(tx=> {
          tx.executeSql('UPDATE states SET state = ? WHERE id = ?', [0, id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                existingStates[indexToUpdate].state = 0;
                setStates(existingStates);
              }
            },
            (txObj, error) => console.log('Error updating data', error)
          );
        });
      }
    };

    const showStates = (ind) => {
      const filteredStates = states.filter(c=>c.name==ind);
      return filteredStates.map((state,index) => {
        return ( 
          <View key={index}>
            <TouchableOpacity onPress={()=> updateState(state.id)}>
              <View style={[styles.cell, { backgroundColor : filteredStates[index].state==1 ? 'black' : 'white' }]} />
            </TouchableOpacity>
          </View>
        )
      })
    }
    

    const showTitle = (ind) => {
      return  (
        <View style={{flex:1}}>
          <Pressable style={{height: 87,transform: [{skewX: '-45deg'}], left:43, backgroundColor:'red'}}>
            <IndicatorTableTitle name={ind.item} modalVisible={modalVisible} setModalVisible={setModalVisible}/>
          </Pressable>
          {showStates(ind.item)}
          <IndicatorMenu
            data={ind.item}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            index={ind.id}
            month={month}
            year={year}
          />
        </View>
      )   
    }

    const showNumber = (day) => {
      return  (
          <View style={{width:25,height:25, justifyContent:'center'}}>
            <Text style={{textAlign:'right', marginRight: 3, textAlignVertical:'center'}}>{day.item}</Text>
          </View>
        )   
    }

    const allNames = states.filter(c => c.day==1).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

    const listDays = () => {
      var arr= [];
      for (let i=1; i<=nbDaysThisMonth;i++) {
        arr.push(i);
      }
      return (arr);
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Feather name='chevron-left' size={40} style={{right:30}}/>
        <View>
          <Text style={{fontSize:10, textAlign:'center'}}>{moment(new Date(2023,5,1)).format('YYYY')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{moment(new Date(0,5,1)).format('MMMM')}</Text>
        </View>
        <Feather name='chevron-right' size={40} style={{left: 30}}/>
      </View>
      <View style={[styles.container,{width: width}]}>
      <ScrollView nestedScrollEnabled  bounces={false} showsVerticalScrollIndicator={false} style={{flex:1,width:width}}>
        <View style={{flex:1,flexDirection:'row'}}>
          <View>
          <FlatList
            data={listDays()}
            renderItem={(item)=>showNumber(item)}
            keyExtractor={(_, index) => index.toString()}
            style={{marginTop:90,width:25,flexDirection:'row'}}
            />
          </View>
          <FlatList
            horizontal
            data={uniqueNames}
            renderItem={(name)=>showTitle(name)}
            keyExtractor={(name) => name.toString()} //{(_, index) => index.toString()}
          />
        </View>
      </ScrollView >
      </View>
      <Button title='remove Table' onPress={removeDb} />
      <TouchableOpacity onPress={() => setAddModalVisible(true)} style={{justifyContent: 'center', position: 'absolute', bottom:15, right: 15, flex: 1}}>
        <Feather name='plus-circle' size={50} />
      </ TouchableOpacity> 
      <NewIndicator
        addModalVisible={addModalVisible===true}
        setAddModalVisible={setAddModalVisible}
        load={load}
        loadx={loadx}
        db={db}
        states={states}
        setStates={setStates}
      />
    </SafeAreaView>
  );
}

export default Trackers;



const styles = StyleSheet.create({
  container: {
    flex:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cell: {
    width: 25,
    height: 25,
    borderColor: 'black',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBox: {
    position: 'absolute',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    top: 200,
  },
  deleteBox: {
    flex: 1, 
    top: 200,
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 10,
    padding: 15,
  },
  button: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginTop: 20,
  },
});
