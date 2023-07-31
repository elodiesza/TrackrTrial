import { View, Text, Button, TouchableOpacity, Dimensions, StyleSheet, Pressable, SafeAreaView, FlatList } from 'react-native';
import Tab from '../components/Tab';
import { colors, container, paleColor } from '../styles';
import { useEffect, useState } from 'react';
import { Feather, MaterialIcons, Entypo} from '@expo/vector-icons';
import NewSection from '../modal/NewSection';
import NewTask from '../modal/NewTask';
import Task from '../components/Task';
import { SwipeListView } from 'react-native-swipe-list-view';
import ProgressBar from '../components/ProgressBar';
import NewProgress from '../modal/NewProgress';
import NewTrack from '../modal/NewTrack';


const width = Dimensions.get('window').width;

function Tracks({tracks, setTracks, db, sections, setSections, tasks, setTasks, progress, setProgress}) {

    const today= new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const day = today.getDate();


    const tabstitles =[... new Set(tracks.map(c => c.track))];
    const tabstitleslength = tabstitles.length;
    const [selectedTab, setSelectedTab] = useState(tabstitles[tabstitleslength-1]);
    const [selectedTabColor, setSelectedTabColor] = useState(tracks.filter(c=>c.track==selectedTab).map(c=>c.color)[0]);
    const [lighterColor, setLighterColor] = useState(paleColor(selectedTabColor));
    const [newSectionVisible, setNewSectionVisible] = useState(false);
    const [newTrackVisible, setNewTrackVisible] = useState(false);
    const [newTaskVisible, setNewTaskVisible] = useState(false);
    const [newProgressVisible, setNewProgressVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('');

    useEffect(()=>{
        setSelectedTabColor(tracks.filter(c=>c.track==selectedTab).map(c=>c.color)[0]);
        setLighterColor(paleColor(selectedTabColor));
    },[selectedTab, tracks])

    const TransferDaily = (id) => {
        let existingTasks = [...tasks];
        let toTransfer = tasks.filter(c=>(c.id==id))[0];
        db.transaction((tx) => {
          tx.executeSql('INSERT INTO tasks (task,year,month,day,taskState,recurring,track,time) values (?,?,?,?,?,?,?,?)',[toTransfer.task,thisYear,thisMonth,day,toTransfer.taskState,0,toTransfer.track,null],
          (txtObj,resultSet)=> {    
            existingTasks.push({ id: resultSet.insertId, task: toTransfer.task, year:thisYear, month:thisMonth,day:day, taskState:toTransfer.taskState, recurring:0, track:toTransfer.track, time:null});
            setTasks(existingTasks);
          },
          (txtObj, error) => console.warn('Error inserting data:', error)
          );
        })
        db.transaction(tx => {
          tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
            (txObj, resultSet) => {
              if (resultSet.rowsAffected > 0) {
                let existingTasks = [...tasks].filter(task => task.id !== id);
                setTasks(existingTasks);
              }
            },
            (txObj, error) => console.log(error)
          );
        })
    }

    const deletetracks = () => {
        db.transaction(tx => {
          tx.executeSql('DROP TABLE IF EXISTS tracks', null,
            (txObj, resultSet) => setTracks([]),
            (txObj, error) => console.log('error deleting tracks')
          );
        });
      }

    const TaskSwipeItem = ({ id }) => (
        <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
            <View style={{ width: width - 50, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: colors.primary.yellowgreen }}>
                <Pressable onPress={()=>TransferDaily(id)}>
                <Feather name="calendar" size={25} color={'white'} />
                </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
                <Pressable onPress={() => 
                db.transaction(tx => {
                tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
                    (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let existingTasks = [...tasks].filter(task => task.id !== id);
                        setTasks(existingTasks);
                    }
                    },
                    (txObj, error) => console.log(error)
                );
                })}>
                <Feather name="trash-2" size={25} color={'white'} />
                </Pressable>
            </View>
        </View>
      );


    const TabItem = ({item,index, selected}) => {
        return (
            <Pressable onPress={()=>setSelectedTab(item.track)} style={{position:'relative', marginLeft:-50, bottom:selected, zIndex:selected==-1?1:0}}>
                <Tab color={paleColor(item.color)} title={item.track} onPress={()=>setSelectedTab(item.track)}/>
            </Pressable>
        );
    };

    return (

        <SafeAreaView style={container.container}>
            <View style={[container.header,{borderBottomWidth:0}]}>
                <Text style={{fontSize:20}}>TRACKS</Text>
            </View>
            <View style={{height:41, zIndex:1, bottom:-1, flexDirection:'row'}}>
                <FlatList
                    data={tracks}
                    renderItem={({item,index}) =>  <TabItem item={item} index={index} selected={selectedTab==item.track?-1:0} />}
                    horizontal={true}
                    keyExtractor= {(item,index) => index.toString()}
                    contentContainerStyle={{flexDirection:'row-reverse',left:30}}
                    showsHorizontalScrollIndicator={false}
                />
                <TouchableOpacity style={{flex:1,justifyContent: 'center', bottom:50, position: 'absolute', right: 15}}>
                    <Feather onPress={()=>setNewTrackVisible(true)} name='plus-circle' size={40} color={colors.primary.blue} />
                </TouchableOpacity> 
            </View>
            <View style={[container.body,{borderTopWidth:1, justifyContent:'flex-start', borderTopColor: colors.primary.black, backgroundColor: paleColor(selectedTabColor)}]}>  
                <FlatList
                    data={sections.filter(c=>c.track==selectedTab)}
                    renderItem={({item,index}) => 
                    <View>
                        <View style={[container.section,{flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor: paleColor(selectedTabColor)}]}> 
                            <Text>{item.section}</Text>
                            <Pressable style={{position:'absolute',right:10}}>
                                <MaterialIcons name="keyboard-arrow-down" size={25}/>
                            </Pressable>
                        </View>
                        <SwipeListView
                            data={tasks.filter(c=>c.section==item.section)}
                            renderItem={({item,index}) =>
                            <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
                            sections={sections} date={undefined} section={item.section} task={item.task} 
                            taskState={item.taskState} time={undefined} track={item.track} id={index} trackScreen={true}/>
                            }
                            renderHiddenItem={({ item }) => <TaskSwipeItem id={item.id} />} 
                            bounces={false} 
                            rightOpenValue={-100}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                        />
                        <SwipeListView
                            data={progress.filter(c=>(c.list==item.section && c.track==selectedTab))}
                            renderItem={({item,index}) =>
                            <ProgressBar db={db} name={item.name} progress={progress} setProgress={setProgress} value={item.progress} id={item.id} color={selectedTabColor}/>
                            }
                            renderHiddenItem={({ item }) => <TaskSwipeItem id={item.id} />} 
                            bounces={false} 
                            rightOpenValue={-100}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                        />
                        <View style={{flex:1, backgroundColor: colors.primary.white, flexDirection:'row', justifyContent:'flex-end'}}>
                            <TouchableOpacity style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Feather name='plus-circle' size={30} color={colors.primary.blue} />
                            </TouchableOpacity> 
                            <TouchableOpacity onPress={()=>{setNewProgressVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Entypo name="progress-two" size={30} color={colors.primary.blue} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setNewTaskVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Feather name='check-square' size={30} color={colors.primary.blue} />
                            </TouchableOpacity> 
                        </View>
                        <NewTask addModalVisible={newTaskVisible} setAddModalVisible={setNewTaskVisible} db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} track={selectedTab} section={selectedSection} pageDate={undefined} tracksScreen={true}/>
                        <NewProgress addModalVisible={newProgressVisible} setAddModalVisible={setNewProgressVisible} db={db} progress={progress} setProgress={setProgress} track={selectedTab} section={selectedSection}/>
                    </View>
                    }
                    keyExtractor= {(item,index) => index.toString()}
                    contentContainerStyle={{width:"100%"}}
                    showsHorizontalScrollIndicator={false}
                />
                <View style={{width:"100%", height:60, justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{justifyContent: 'center', bottom:10, position: 'absolute', right: 15, flex: 1}}>
                        <Feather onPress={()=>setNewSectionVisible(true)} name='plus-circle' size={40} color={colors.primary.blue} />
                    </TouchableOpacity> 
                </View>
                <NewSection db={db} sections={sections} setSections={setSections} track={selectedTab} newSectionVisible={newSectionVisible} setNewSectionVisible={setNewSectionVisible}/>
                <Button title="delete tracks" onPress={deletetracks}/>
                <NewTrack db={db} tracks={tracks} setTracks={setTracks} newTrackVisible={newTrackVisible} setNewTrackVisible={setNewTrackVisible} setSelectedTab={setSelectedTab}/>
            </View>
        </SafeAreaView>
    );
}

export default Tracks;
