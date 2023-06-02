import { StyleSheet, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import DaysInMonth from '../components/DaysInMonth';
import IndicatorTableTitle from '../components/IndicatorTableTitle';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';


const width = Dimensions.get('window').width;

const Trackers = () => {

  var today = new Date();
  var nbDaysThisMonth = DaysInMonth(today);

  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [currentName, setCurrentName] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [states, setStates] = useState([]);

    useEffect(() => {

      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, UNIQUE(name,year,month,day))')
      });

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

    const removeDb2 = () => {
      db.transaction(tx => {
        tx.executeSql('DROP TABLE IF EXISTS states', null,
          (txObj, resultSet) => setStates([]),
          (txObj, error) => console.log('error selecting states')
        );
      });
      loadx(!load);
    }


    const addState = () => {
      setIsLoading(true);
      let existingStates = [...states];    
      for (let i=1; i<=nbDaysThisMonth; i++) {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO states (name,year,month,day,state) values (?,?,?,?,?)',[currentName,2023,6,i,0],
          (txtObj,resultSet)=> {    
            existingStates.push({ id: resultSet.insertId, name: currentName, year:2023, month:6, day:i, state:0});
            setStates(existingStates);
            console.log('Data inserted susccesfully');
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
        );
      });
      }
      setIsLoading(false);
    loadx(!load);
    }

    const deleteState = (id) => {
      db.transaction(tx=> {
        tx.executeSql('DELETE FROM states WHERE id = ?', [id],
          (txObj, resultSet) => {
            if (resultSet.rowsAffected > 0) {
              let existingStates = [...states].filter(state => state.id !==id);
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
//<Text>{ind.item}</Text>
    const showTitle = (ind) => {
      return  (
          <View style={{flex:1}}>
            <View style={{height: 87,transform: [{skewX: '-45deg'}]}}>
              <IndicatorTableTitle name={ind.item}/>
            </View>
            {showStates(ind.item)}
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
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </ScrollView >
      </View>
      <Button title='remove Table' onPress={removeDb2} />
      <View style={styles.minicontainer}>
        <Text>Insert new Indicator</Text>
        <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />
        <Button title="Add Name" onPress={(currentName!==undefined ? (currentName!==(null||'')? (currentName.includes(' ')? false: true):false):false) ? addState : console.log('please enter a name')}/>
      </View> 
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
  minicontainer: {
    flex:2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  cell: {
    width: 25,
    height: 25,
    borderColor: 'black',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
