import { Animated, Easing, Keyboard, TouchableWithoutFeedback, FlatList, Pressable, TouchableOpacity, Text, View, SafeAreaView,Dimensions } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AddSleepLog from './AddSleepLog';
import { container,colors, text } from '../styles';
import DiaryElement from './DiaryElement';
import AddScale from './AddScale';
import AddTime from './AddTime';
import UpdateState from '../modal/UpdateState';
import UpdateWeather from './UpdateWeather';
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import NewIndicator from '../modal/NewIndicator';
import StickerList from './StickerList';
import UpdateHabit from '../modal/UpdateHabit';
import UpdateStatelist from '../modal/UpdateStatelist';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const TodayScreen = ({ db, habits, setHabits, moods, setMoods, sleep, setSleep, 
  year, month, day, scalerecords, setScalerecords, diary, setDiary, 
  staterecords, setStaterecords, states, times, timerecords, scales, setStates, 
  setTimes, setTimerecords, setScales, weather, setWeather, analytics, setAnalytics, load, loadx}) => {

  const referenceElementRef = useRef(null);
  const [referenceElementPosition, setReferenceElementPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const onReferenceElementLayout = () => {
    if (referenceElementRef.current) {
      referenceElementRef.current.measure((x, y, width, height, pageX, pageY) => {
        setReferenceElementPosition({ x: pageX, y: pageY, width, height });
      });
    }
  };

  const completedHabitsLength = habits.filter(c=>(c.productive==true && c.state==true && c.year==year && c.month==month && c.day==day)).length;  

  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [updateStateVisible, setUpdateStateVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [goodpct, setGoodpct] = useState(habits.filter(c=>(c.productive==true && c.state==true && c.type==1 && c.year==year && c.month==month && c.day==day)).length/completedHabitsLength);
  const [badpct, setBadpct] = useState(habits.filter(c=>(c.productive==true && c.state==true && c.type==2 && c.year==year && c.month==month && c.day==day)).length/completedHabitsLength);
  const [neutralpct, setNeutralpct] = useState(habits.filter(c=>(c.productive==true && c.state==true && c.type==0 && c.year==year && c.month==month && c.day==day)).length/completedHabitsLength);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [updateStatelistVisible, setUpdateStatelistVisible] = useState(false);

  useEffect(() => {
    setGoodpct(habits.filter(c=>(c.productive==true && c.state==true && c.type==1 && c.year==year && c.month==month && c.day==day)).length/completedHabitsLength);
    setBadpct(habits.filter(c=>(c.productive==true && c.state==true && c.type==2 && c.year==year && c.month==month && c.day==day)).length/completedHabitsLength);
    setNeutralpct(habits.filter(c=>(c.productive==true && c.state==true && c.type==0 && c.year==year && c.month==month && c.day==day)).length/completedHabitsLength);
  },[habits,day]);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const openKeyboardAnimationValue = new Animated.Value(0);
  const closeKeyboardAnimationValue = new Animated.Value(1);

  const startOpenAnimation = () => {
    Animated.timing(openKeyboardAnimationValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };
  
  const startCloseAnimation = () => {
    Animated.timing(closeKeyboardAnimationValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isKeyboardOpen) {
      startOpenAnimation();
    } else {
      startCloseAnimation();
    }
  }, [isKeyboardOpen]);

useEffect(() => {
  const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
    setIsKeyboardOpen(true);
  });

  const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    setIsKeyboardOpen(false);
  });

  return () => {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
  };
}, []);



  const allNames = habits.filter(c => (c.productive==true &&c.day==1&& c.year==year&& c.month==month)).map((c) => c.name);
  const uniqueNames = [...new Set (allNames)];


    if (isLoading) {
        return (
          <View>
            <Text> Is Loading...</Text>
          </View>
        )
      }


    const updateState = (id) => {
        let existinghabits=[...habits];
        const indexToUpdate = existinghabits.findIndex(state => state.id === id);
        if (existinghabits[indexToUpdate].state==0){
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET state = ? WHERE id = ?', [1, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existinghabits[indexToUpdate].state = 1;
                  setHabits(existinghabits);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
        else {
          db.transaction(tx=> {
            tx.executeSql('UPDATE habits SET state = ? WHERE id = ?', [0, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existinghabits[indexToUpdate].state = 0;
                  setHabits(existinghabits);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
          });
        }
      };

    const scaleNames= [... new Set(scalerecords.map(c=>c.name))];
    const timeNames= [... new Set(timerecords.map(c=>c.name))];
    const scaleCounts= scaleNames.length;



  const HabitGauge = () => {
    return(
      <View style={{width:5, height:'100%', marginHorizontal:10}}>
        <View style={{height:`${badpct * 100}%`, backgroundColor:colors.primary.bad}}/>
        <View style={{height:`${neutralpct * 100}%`, backgroundColor:colors.primary.neutral}}/>
        <View style={{height:`${goodpct * 100}%`, backgroundColor:colors.primary.good}}/>
      </View>
    )
  }

  const ClickableParallelogram = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={()=>updateState(item.id)} onLongPress={()=>{setSelectedHabit(item.name);setChangeModalVisible(true);}}>
        <View style={{marginRight:8}}>
          <View style={[container.parallelogram,{backgroundColor:item.state==false?colors.primary.white:item.type==2?colors.primary.bad:item.type==0?colors.primary.neutral:colors.primary.good,
          borderWidth:item.state==false?1:0, borderColor:colors.primary.blue}]}/>
          <View style={container.parallelogramTextLayer}>
            <Ionicons name={item.icon} size={16} color={colors.primary.white} style={{margin:2}}/>
            <Ionicons name={`${item.icon}`+'-outline'} size={16} color={item.state==false?colors.primary.blue:colors.primary.black} style={{margin:2, position:'absolute',display:item.state==true?'none':'flex'}}/>
            <Text style={[text.regular,{color:item.state==true?colors.primary.white:colors.primary.blue, textAlign:'left', fontSize:10}]} numberOfLines={1}>{item.name}</Text>
          </View>
          <UpdateHabit
            changeModalVisible={changeModalVisible}
            setChangeModalVisible={setChangeModalVisible}
            db={db}
            data={habits.filter(c=>(c.name==selectedHabit))[0]}
            type={'habit'}
            update={habits}
            setUpdate={setHabits}
            update2={undefined}
            setUpdate2={undefined}
            load={load}
            loadx={loadx}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={[container.body,{justifyContent:'center', alignItems:'center'}]}>
      <View style={{width:width, flexDirection:'row', left:5, justifyContent:'center', alignItems:'center'}}>
        <MaterialCommunityIcons name="emoticon-outline" size={40} color={colors.primary.blue} style={{marginLeft:10}}/>
        <AddSleepLog db={db} sleep={sleep} setSleep={setSleep} year={year} month={month} day={day} setSleepModalVisible={undefined} sleepModalVisible={undefined}/>
        {weather.length!==0 &&
          <UpdateWeather db={db} weather={weather} setWeather={setWeather} year={year} month={month} day={day}/>    
        } 
        {weather.length==0 &&
          <TouchableOpacity onPress={()=>{
            let existingweather=[...weather];
            db.transaction((tx) => {
              tx.executeSql('INSERT INTO weather (id,weather,year,month,day) values (?,?,?,?,?)',
              [uuid.v4(),'sunny-outline',year,month,day],
              (txtObj,resultSet)=> {    
                  existingweather.push({id:uuid.v4(),weather:'sunny-outline',year:year,month:month,day:day});
                  setWeather(existingweather);
              },
              (txtObj, error) => console.warn('Error inserting data:', error)
              );
          });
          }} style={{width:100, justifyContent:'center', alignItems:'center'}}>
            <Ionicons name={'add-circle-outline'} size={50} color={colors.primary.blue}/>
          </TouchableOpacity>
        }
      </View>
      <View style={{height:110,width:'90%',flexDirection:'row'}}>
          <FlatList
            data={habits.filter(c=>(c.productive==true && c.year==year && c.month==month && c.day==day))}
            renderItem={({item})=>ClickableParallelogram({item})}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{paddingHorizontal: 30}}
          />
        <View style={{height:100,width:10,justifyContent:'center'}}>
          <HabitGauge/>
        </View>
      </View>
      <View style={{flex:1, width:width, flexDirection:'row'}}>
        <View style={{flex:1,marginLeft:10, marginBottom:10}}>
          <FlatList
            data={[... new Set(states.map(c=>c.name))]}
            renderItem={(item)=>
              <View style={{flexDirection:'row', height:40, marginRight:20, justifyContent:'flex-start', alignContent:'center', alignItems:'center'}}>
                <Pressable ref={referenceElementRef} onPress={()=>{setUpdateStateVisible(true);setSelectedName(item.item); onReferenceElementLayout();}}  
                style={[container.color,{marginLeft:10, borderWidth:1, borderColor: colors.primary.blue,
                backgroundColor: states.filter(c=>c.item==staterecords.filter(c=>(c.year==year && c.month==month && c.day==day && c.name==item.item)).map(c=>c.item)[0]).map(c=>c.color)[0]}]}/>
                <View style={{display: updateStateVisible? 'flex':'none'}}>
                  <UpdateState 
                    db={db}
                    staterecords={staterecords}
                    setStaterecords={setStaterecords}
                    states={states}
                    setStates={setStates}
                    name={selectedName}
                    updateStateVisible={updateStateVisible}
                    setUpdateStateVisible={setUpdateStateVisible}
                    year={year}
                    month={month}
                    day={day}
                    referenceElementPosition={referenceElementPosition}
                  />
                </View>
                <Pressable onLongPress={()=>{setSelectedHabit(item.item);setUpdateStatelistVisible(true);}}>
                  <Text style={[text.regular,{left:5}]}>{item.item}</Text>
                </Pressable>
                <UpdateStatelist
                  updateStatelistVisible={updateStatelistVisible}
                  setUpdateStatelistVisible={setUpdateStatelistVisible}
                  db={db}
                  data={states.filter(c=>(c.name==selectedHabit))[0]}
                  states={states}
                  setStates={setStates}
                  staterecords={staterecords}
                  setStaterecords={setStaterecords}
                  load={load}
                  loadx={loadx}
                />
              </View>}
            keyExtractor={(name) => (name!==null && name!==undefined) ? name.toString():''} 
          />
        </View>
        <View style={{flex:1}}>
          <FlatList
            data={[...scaleNames, ...timeNames]}
            renderItem={[...scaleNames, ...timeNames].length!==0?({item,index})=>
            index<scaleCounts? 
            <AddScale name={item} scales={scales} scalerecords={scalerecords} 
            setScalerecords={setScalerecords} db={db} year={year} month={month} day={day}
            setScaleModalVisible={undefined} load={load} loadx={loadx}/> : <AddTime name={item} times={times} timerecords={timerecords} 
            setTimerecords={setTimerecords} db={db} year={year} month={month} day={day} 
             setTimeModalVisible={undefined}/>
            :undefined}
            keyExtractor={(_, index) => index.toString()} 
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <Animated.View
            style={
              {
                marginBottom: isKeyboardOpen
                  ? openKeyboardAnimationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, height * 3 / 10],
                    })
                  : closeKeyboardAnimationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [height * 3 / 10, 10],
                    }),
                height:180, width:width
              }
            }
          >
        <View style={{bottom:5,height:30, marginHorizontal:20, flexDirection:'row'}}>
          <StickerList db={db} habits={habits} setHabits={setHabits} year={year} month={month} day={day} load={load} loadx={loadx}/>
          <Ionicons onPress={()=>setAddModalVisible(true)} name="add-circle-outline" size={30} color={colors.primary.blue}/>
        </View>
        <NewIndicator
          addModalVisible={addModalVisible===true}
          setAddModalVisible={setAddModalVisible}
          db={db}
          habits={habits}
          setHabits={setHabits}
          states={states}
          setStates={setStates}
          staterecords={staterecords}
          setStaterecords={setStaterecords}
          scales={scales} setScales={setScales} 
          scalerecords={scalerecords} setScalerecords={setScalerecords}
          times={times} setTimes={setTimes}
          timerecords={timerecords} setTimerecords={setTimerecords}
          load={load} loadx={loadx}
        />
        <DiaryElement 
          db={db}
          diary={diary}
          setDiary={setDiary}
          year={year}
          month={month}
          day={day}
          load={load}
          loadx={loadx}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

export default TodayScreen;
