import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Dimensions, Pressable, ScrollView, FlatList, Text, View, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import DiagIndRaw from '../components/DiagIndRaw';
import Feather from '@expo/vector-icons/Feather';

import { DataStore } from '@aws-amplify/datastore';
import { Indicator } from '../src/models';


const window = Dimensions.get('window');

const datex = new Date();
const currentYear = datex.getFullYear();
const currentMonth = datex.getMonth() + 1;
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

var dateArray = [];
for (var i=1; i<daysInCurrentMonth+1;i++){
  dateArray.push(i);
};

const DayItem = ({ day }) => (
  <View style={{width: 30, height: 25, borderRightWidth: 1, borderRightColor: 'gray'}}>
    <Text style={{textAlign: 'right', margin: 5}}>{day}</Text>
  </View>
);
const renderDayItem = ({ item }) => (
  <DayItem day={item} />
);

//Display Table cells 

function TrackersElement({year, month, statex, setStatex}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [displayStatus, setDisplayStatus] = useState<number>(0)
  const [isDataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    setDataLoading(true)
    const fetchIndicators = async() => {      
      const results = await DataStore.query(Indicator);
      setIndicators(results); 
    }
    fetchIndicators(); 
    setDataLoading(false)
    
      if(indicators.length===0){
    setDisplayStatus(0)
  }  
  else {
    if(indicators.filter(c=>(c.year=== year && c.month=== month)).length===0){
      setDisplayStatus(1)
    }  
    else {
      setDisplayStatus(2)
    }
  }
    
  }, [statex, setModalVisible, indicators.length] );

  const thisMonthInd = indicators.filter(c=>c.year === year && c.month === month)

  const copyInd = () => {
    //if indicators not empty but this month empty copy last month indicators
      const pastIndicators = indicators.filter(c=>(c.year===year && c.month===currentMonth-2 && c.date.includes('-13')));
      for(var j=0; j<pastIndicators.length; j++) {
        addNewIndicator(pastIndicators[j])
      }
      //mettre a jour le display
      setStatex(!statex)
  };


  const addNewIndicator = async (data) => {
    setDataLoading(true)
    for ( var i=1; i<daysInCurrentMonth+1; i++) {
      var indDatex = datex.getFullYear()+'-0'+(datex.getMonth()+1)+'-0'+i;
      if (i>9){
        indDatex = datex.getFullYear()+'-0'+(datex.getMonth()+1)+'-'+i;
      }
      const newIndicator = new Indicator({
        name: data.name,
        date: indDatex,
        state: false,
        index: data.index,
        month: currentMonth-1,
        year: currentYear,
        type: data.type,
        tag: data.tag,
        color: data.color,
      });
      await DataStore.save(newIndicator);
    }
    setDataLoading(false)
    setStatex(!statex)
  }
  


  //Sort indicators by date and created At
  const sortByDate = thisMonthInd => {
    const sorter = (a, b) => {
       return new Date(a.date) - new Date(b.date)
    }
    thisMonthInd.sort(sorter);
 };
 sortByDate(thisMonthInd);
  const sortByCreatedAt = thisMonthInd => {
    const sorter2 = (a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
    thisMonthInd.sort(sorter2);
  };
  sortByCreatedAt(thisMonthInd);

  //Update sort by index (upper code outdated)
  const sortByIndex = thisMonthInd => {
    const sorter3 = (a, b) => {
      return a.index - b.index
    }
    thisMonthInd.sort(sorter3);
  };
  sortByIndex(thisMonthInd);

  const indData = [...new Set(thisMonthInd.map(item => item.name))];

  const CellItem = ({ state, id }) => {
      return(
        <Pressable onPress={async() => {
          const original = await DataStore.query(Indicator, id);
          await DataStore.save(
            Indicator.copyOf(original, updated => {
              updated.state = state===false? true : false
            })
          )
          setStatex(statex === false? false : true)
          setStatex(statex === false? true : false)
          }} style={[styles.cell,{backgroundColor: state === false ? 'white' : 'black'}]} >
        </Pressable> )
  }; 


const TableColumn = ({item}) => (
  <CellItem state={item.state} id={item.id} />
); // returns column of given indicator

const TableCells = ({item,index}) => {
  const colorPicker = (thisMonthInd) => {
    const colorPicked = thisMonthInd.filter(
      (ind) => ind.name === item
    )
    return colorPicked;
  };
  return(
  <View style={{flexDirection: 'column'}}>
    <View style={{height: 87,transform: [{skewX: '-45deg'}]}}>
      <DiagIndRaw indText={item} bgColor={colorPicker(thisMonthInd)[0].color} onPress={() => setModalVisible(item)} />
    </View>  
    <ShowIndModal
      data={item}
      modalVisible={modalVisible === item}
      setModalVisible={setModalVisible}
      index={index}
      month={month}
      year={year}
    />
    <View style={{left:-32}}>
      <FlatList data={thisMonthInd.filter(function(item){
      return item.name == indData[index];
    }).map(function({state,date,id}){
      return {state,date,id};
    })} renderItem={TableColumn} bounces={false} scrollEnabled={false}
    /> 
    </View>
  </View>
)};


  const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={{justifyContent: 'center', alignItems: 'center', flex:1, width: window.width, display: (displayStatus===2? 'none': 'flex')}}>
        <View style={{justifyContent: 'center', position: 'absolute', bottom:30, right: 80, flex: 1}}>
              <Text> Create your first Habit of the month →</Text>  
        </View>
        <Pressable onPress={copyInd} style={[styles.lastMonth, {display: (displayStatus===1? 'flex': 'none')}]}>
          <Text> Copy last month Habits</Text>
        </Pressable>
      </View>
      {/* {isDataLoading ? (
        <Loader />
    ) : ( */}
      <View style={[styles.indTable,{display: (displayStatus===2? 'flex': 'none')}]}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.dataTable}>
            <FlatList data={dateArray} style={{top: 87}} scrollEnabled={false} renderItem={renderDayItem} bounces={false} />
            <FlatList data={indData} contentContainerStyle={{paddingRight:80, minWidth: window.width-30, left:32}} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={TableCells} bounces={false} />
          </View>
        </ScrollView>
      </View>
    {/* )} */}
    </View>
  );
};

export default TrackersElement;

const ShowIndModal = ({ month, year, modalVisible, setModalVisible, data, index }) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  return(
  <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setModalVisible(!modalVisible)}} activeOpacity={1}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogBox}>
            <Pressable >
              <Feather name="chevron-left" size={25} color={'gray'}
                onPress={
                  async() => {
                    const current = await DataStore.query(Indicator, (ind) => ind.year('eq', year).month('eq', month).name('eq',data) );
                    const before = await DataStore.query(Indicator, (ind) => ind.year('eq', year).month('eq', month).index('eq', index) );
                    console.warn(current)
                    console.warn(before)
                    for(var i=0; i<current.length+1; i++) {
                      await DataStore.save(
                        Indicator.copyOf(current[i], updated => {
                          updated.index = index!== 0 ? index : index+1;
                        })
                      )
                      await DataStore.save(
                        Indicator.copyOf(before[i], updated => {
                          updated.index = index!== 0 ? index+1 : index;
                        })
                      )
                    }
                    setModalVisible(false);
                  }
                }
              />
            </Pressable>
            <Pressable >
              <Feather name="chevron-right" size={25} color={'gray'}
                onPress={
                  async() => {
                    setModalVisible(false);
                    const current = await DataStore.query(Indicator, (ind) => ind.year('eq', year).month('eq', month).name('eq',data) );
                    const after = await DataStore.query(Indicator, (ind) => ind.year('eq', year).month('eq', month).index('eq', index+2) );
                    for(var i=0; i<current.length+1; i++) {
                      await DataStore.save(
                        Indicator.copyOf(current[i], updated => {
                          updated.index = index!== current.length-1 ? index+2 : index+1;
                        })
                      )
                      await DataStore.save(
                        Indicator.copyOf(after[i], updated => {
                          updated.index = index!== current.length-1 ? index+1 : index+2;
                        })
                      )
                    }
                  }
                }
              />
            </Pressable>
            <Pressable>
              <Feather name="edit" size={25}/>
            </Pressable>
            <Pressable onPress={() => setDeleteModalVisible(true)}>
              <Feather name="trash-2" size={25} color={'darkred'}/>
            </Pressable>
            </View>
            
          </TouchableWithoutFeedback>
        </TouchableOpacity>
        <Modal
              animationType="none"
              transparent={true}
              visible={deleteModalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setDeleteModalVisible(!deleteModalVisible);
              }}
            >
              <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setDeleteModalVisible(!deleteModalVisible)}} activeOpacity={1}>
                <TouchableWithoutFeedback>
                  <View style={styles.deleteBox}>
                    <Text>Are you sure you want to delete</Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{color: '#B9CBCF', fontWeight: 'bold'}}> {data} </Text><Text>?</Text>
                    </View>
                    <Text style={{color: 'gray', fontSize: 10}}>You will not be able to recover your data for this month</Text>
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity onPress={async() => {
                      const place= data.length-(index+1);
                      await DataStore.delete(Indicator, (indicators) => indicators.year('eq', year).month('eq', month).name('eq', data));
                      if(place!== 0){
                        for (var i=index; i<place; i++){
                          const after = await DataStore.query(Indicator, (ind) => ind.year('eq', year).month('eq', month).index('eq',i+2) );
                          for(var j=0; j<after.length; j++){
                            await DataStore.save(
                              Indicator.copyOf(after[j], updated => {
                                updated.index = i+1;
                              })
                            )
                          }
                        } 
                      }
                      setModalVisible(!modalVisible);
                      }} style={[styles.button,{backgroundColor: '#B9CBCF'}]}>
                        <Text>Delete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {setDeleteModalVisible(!deleteModalVisible)}} style={[styles.button,{backgroundColor: '#F4F9FA'}]}>
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
      </Modal>
);};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F9FA',
  },
  indTable: {
    flex: 1,
    flexDirection: 'row',
    height: 100,
  },
  indHeader: {
    flex: 1,
    height: 87,
    flexDirection: 'row',
    left: 60,
  },
  dataTable: {
    flex: 1,
    flexDirection: 'row',
  },
  scroll: {
    flex:1, 
  },
  cell: {
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'lightgray',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
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
  lastMonth: {
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  }
});
