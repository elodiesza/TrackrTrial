import { View, Modal,FlatList, TextInput, TouchableWithoutFeedback, SafeAreaView, Text, Pressable, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { container,colors } from '../styles';
import moment from 'moment';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MoodIcons } from '../constants/MoodIcons';

const DaySummary = ({modalVisible, setModalVisible, year, month, day, habits, states, staterecords, scales, scalerecords, sleep, moods, diary, weather, daysinmonth }) => {

    const thisdayWeather = weather.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.weather)[0];
    const moodIcon = MoodIcons.filter(c=>c.name==moods.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.mood)[0]).map(c=>c.icon)[0];
    const moodColor = MoodIcons.filter(c=>c.name==moods.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.mood)[0]).map(c=>c.color)[0]
    const goSleep1 = sleep.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.sleep)[0];
    const wakeUp = sleep.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.wakeup)[0];
    const goSleep2 = sleep.filter(c=>(c.year==year&&c.month==(day==daysinmonth?(month==11?0:month+1):month)&&c.day==(day==daysinmonth?1:day+1))).map(c=>c.sleep)[0];
    const sleepTime = wakeUp==undefined||goSleep1==undefined?0:wakeUp-goSleep1+24;
    const dayTime = wakeUp==undefined||goSleep2==undefined?0:24-wakeUp-(24-goSleep2);
    const sumTime = (sleepTime+dayTime)==0?1:(sleepTime+dayTime);
    const sleepColor = sleep.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.color)[0];
    const diaryNotes = diary.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.notes)[0];

    return (
        <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    > 
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPressOut={() => {setModalVisible(!setModalVisible)}} activeOpacity={1}>
        <TouchableWithoutFeedback>
          <View style={[container.modal,{width:'90%'}]}>
                <View style={{flexDirection:'row', alignItems:'center', width:'100%', height:40, justifyContent:'flex-end'}}>
                    <Ionicons name={thisdayWeather} size={30} style={{marginRight:5}}/>
                    <Text style={{fontSize:18}}>{moment(new Date(year,month,day)).format("ddd, MMMM Do YYYY")}</Text>
                </View>
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between', alignItems:'center'}}>
                    <View style={[container.body,{height:30,width:'100%',flexDirection:'row'}]}>
                        <FlatList
                            data={habits.filter(c=>(c.productive==false && c.year==year&&c.month==month&&c.day==day&&c.state==true))}
                            renderItem={({item}) =>{
                                const itemColor=habits.filter(c=>(c.productive==false && c.name==item.name)).map(c=>c.color)[0];
                                const itemIcon=habits.filter(c=>(c.productive==false && c.name==item.name)).map(c=>c.icon)[0];
                                return(
                                    <TouchableOpacity style={{marginHorizontal:2}}>
                                        <View style={{position:'absolute'}}>
                                        <Ionicons name={itemIcon} size={30} color={itemColor}/>
                                        </View>
                                        <Ionicons name={itemIcon+'-outline'} size={30} color={colors.primary.black}/>
                                    </TouchableOpacity> 
                            )}}
                            keyExtractor={(item, index) => item.id.toString()}
                            horizontal={true}
                        />
                        <View>
                          <View style={{borderRadius: 15,position:'absolute',width:30, height:30,backgroundColor:colors.primary.black}}/>
                          <MaterialCommunityIcons name={moodIcon==undefined?'circle':moodIcon} size={30} color={moodColor==undefined?colors.primary.white:moodColor}/>
                        </View>
                    </View>
                </View>
                <View style={{width:'100%', marginTop:10}}>
                  <FlatList
                    data={[1,2,3,4]}
                    renderItem={({item}) =>(
                      <View style={{width:50,  height:50, marginRight:5, backgroundColor:colors.primary.white, borderWidth:1,borderColor:colors.primary.black}}/>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal={true}
                  />
                  <View style={{padding:10,borderRadius:10,width:'100%', height:200, marginTop:10, backgroundColor:colors.primary.white, borderWidth:1,borderColor:colors.primary.black}}>
                      <Text style={{textAlign:'justify'}}>{diaryNotes}</Text>
                  </View>
                </View> 
                <View style={{marginTop:10,width:'100%',flexDirection:'row', alignItems:'center'}}>
                    <Ionicons name="moon" size={20} style={{marginRight:10}}/>
                    <Text>{goSleep1}</Text>
                    <View style={{marginHorizontal:10,height:10, flex:sleepTime/sumTime, backgroundColor:sleepColor==undefined? colors.primary.gray:sleepColor}}/>
                    <Text>{wakeUp}</Text>
                    <View style={{marginHorizontal:10,height:10, flex:dayTime/sumTime, backgroundColor:colors.primary.default}}/>
                    <Text>{goSleep2}</Text>
                </View>
          </View> 
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>

    );
};

export default DaySummary;