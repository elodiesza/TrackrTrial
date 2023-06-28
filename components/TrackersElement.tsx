import { StyleSheet, Modal, TouchableWithoutFeedback, Alert, Pressable, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import IndicatorTableTitle from '../components/IndicatorTableTitle';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import NewIndicator from '../modal/NewIndicator';
import IndicatorMenu from '../modal/IndicatorMenu';

const width = Dimensions.get('window').width;

export default function TrackersElement({db, year, month, load, loadx, setStates, states, tags, setTags}) {

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


    const removeDb = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS states', null,
          (txObj, resultSet) => setStates([]),
          (txObj, error) => console.log('error deleting states')
        );
      });
      loadx(!load);
    }
    const removeTagsDb = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS tags', null,
          (txObj, resultSet) => setTags([]),
          (txObj, error) => console.log('error deleting tags')
        );
      });
      loadx(!load);
    }


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
      const filteredStates = states.filter(c=>(c.name==ind && c.year==year && c.month==month));
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
      return (
        <View>
          <Pressable style={{ height: 75, transform: [{ skewX: '-45deg' }], left: 37 }}>
            <IndicatorTableTitle name={ind.item} tags={tags} states={states} setModalVisible={setModalVisible}/>
          </Pressable>
          {showStates(ind.item)}
          <IndicatorMenu
            data={ind.item}
            modalVisible={modalVisible === ind.item}
            setModalVisible={setModalVisible}
            index={ind.id}
            month={month}
            year={year}
            db={db}
            setStates={setStates}
            states={states}
            loadx={loadx}
            load={load}
          />
        </View>
      );
    };
    
    
    

    const showNumber = (day) => {
      return  (
          <View style={{width:25,height:25, justifyContent:'center'}}>
            <Text style={{textAlign:'right', marginRight: 3, textAlignVertical:'center'}}>{day.item}</Text>
          </View>
        )   
    }

    const allNames = states.filter(c => (c.day==1, c.year==year, c.month==month)).map((c) => c.name);
    const uniqueNames = [...new Set (allNames)];

    const listDays = () => {
      var arr= [];
      for (let i=1; i<=DaysInMonth(year,month);i++) {
        arr.push(i);
      }
      return (arr);
    }

  return (
    <SafeAreaView style={styles.container}>
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
      <Button title='remove Indicators' onPress={removeDb} />
      <Button title='remove Tags' onPress={removeTagsDb} />
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
        tags={tags}
        setTags={setTags}
      />
    </SafeAreaView>
  );
}


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