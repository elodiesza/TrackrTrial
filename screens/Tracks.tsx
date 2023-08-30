import { View, Text, Button, TouchableOpacity, Dimensions, StyleSheet, Pressable, SafeAreaView, FlatList } from 'react-native';
import Tab from '../components/Tab';
import { colors, container, paleColor } from '../styles';
import { useEffect, useState } from 'react';
import { Feather, MaterialIcons, Entypo, Ionicons} from '@expo/vector-icons';
import NewSection from '../modal/NewSection';
import NewTask from '../modal/NewTask';
import Task from '../components/Task';
import { SwipeListView } from 'react-native-swipe-list-view';
import ProgressBar from '../components/ProgressBar';
import NewProgress from '../modal/NewProgress';
import NewTrack from '../modal/NewTrack';
import NewStatus from '../modal/NewStatus';
import Status from '../components/Status';

const width = Dimensions.get('window').width;

function Tracks({tracks, setTracks, db, sections, setSections, tasks, setTasks, progress, setProgress, statuslist, setStatuslist, statusrecords, setStatusrecords}) {

    const today= new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const day = today.getDate();
    const tabstitles =[... new Set(tracks.map(c => c.track))];
    const tabstitleslength = tabstitles.length;
    const [selectedTab, setSelectedTab] = useState(tabstitles.length==0?undefined:tabstitles[tabstitleslength-1]);
    const [selectedTabColor, setSelectedTabColor] = useState(selectedTab==undefined? colors.primary.default:tracks.filter(c=>c.track==selectedTab).map(c=>c.color)[0]);
    const [newSectionVisible, setNewSectionVisible] = useState(false);
    const [newTrackVisible, setNewTrackVisible] = useState(false);
    const [newTaskVisible, setNewTaskVisible] = useState(false);
    const [newProgressVisible, setNewProgressVisible] = useState(false);
    const [newStatusVisible, setNewStatusVisible] = useState(false);
    const [selectedSection, setSelectedSection] = useState('');
    const [showSection, setShowSection] = useState(true);
    const [showArchive, setShowArchive] = useState(false);

    const arrowArray = () => {
        let arrowArray = [];
        const sectionLength = sections.filter(c=>c.track==selectedTab).length;
        for (let i=0; i<sectionLength; i++) {
            arrowArray.push({'index':i, 'arrow':true});
        }
        return arrowArray;
    }
    const [arrow, setArrow] = useState(arrowArray());

    const updateArrowAtIndex = (index, newArrowValue) => {
        setArrow(prevArrowArray => {
            return prevArrowArray.map(item => {
                if (item.index === index) {
                    return { ...item, arrow: newArrowValue };
                }
                return item;
            });
        });
    };

    useEffect(() => {
        setArrow(arrowArray());
        setSelectedTabColor(selectedTab==undefined? colors.primary.default:tracks.filter(c=>c.track==selectedTab).map(c=>c.color)[0]);
        setSelectedSection(sections.filter(c=>c.track==selectedTab).map(c=>c.section)[0]);
    }, [selectedTab,tracks]);

    const TransferDaily = (id) => {
        let existingTasks = [...tasks];
        const toTransfer = existingTasks.map(c=>c.id).findIndex(c=>c==id);
        db.transaction(tx=> {
            tx.executeSql('UPDATE tasks SET year = ?, month=?, day=? WHERE id= ?', [thisYear,thisMonth,day, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingTasks[toTransfer].year = thisYear;
                  existingTasks[toTransfer].month = thisMonth;
                  existingTasks[toTransfer].day = day;
                  setTasks(existingTasks);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
            );
        });
    }

    const TransferArchive = (id,reverse) => {
        let existingrecords = [...statusrecords];
        const toTransfer = existingrecords.map(c=>c.id).findIndex(c=>c==id);
        db.transaction(tx=> {
            tx.executeSql('UPDATE statusrecords SET archive=? WHERE id= ?', [reverse?false:true, id],
              (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                  existingrecords[toTransfer].archive = reverse?false:true;
                  setStatusrecords(existingrecords);
                }
              },
              (txObj, error) => console.log('Error updating data', error)
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
                        let existingTasks = [...tasks].filter(c => c.id !== id);
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

    const ArchiveTaskSwipeItem = ({ id }) => (
            <View style={{ paddingRight:10, justifyContent: 'center', alignItems: 'flex-end', flex: 1, backgroundColor: 'darkred' }}>
                <Pressable onPress={() => 
                db.transaction(tx => {
                tx.executeSql('DELETE FROM tasks WHERE id = ?', [id],
                    (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let existingTasks = [...tasks].filter(c => c.id !== id);
                        setTasks(existingTasks);
                    }
                    },
                    (txObj, error) => console.log(error)
                );
                })}>
                    <Feather name="trash-2" size={25} color={'white'} />
                </Pressable>
            </View>
    );      

    const ProgressSwipeItem = ({ id }) => (
        <View style={{ paddingRight:10, justifyContent: 'center', alignItems: 'flex-end', flex: 1, backgroundColor: 'darkred' }}>
            <Pressable onPress={() => 
                db.transaction(tx => {
                    tx.executeSql('DELETE FROM progress WHERE id = ?', [id],
                        (txObj, resultSet) => {
                        if (resultSet.rowsAffected > 0) {
                            let existingProgress = [...progress].filter(c => c.id !== id);
                            setProgress(existingProgress);
                        }
                        },
                        (txObj, error) => console.log(error)
                    );
                })}>
                <Feather name="trash-2" size={25} color={'white'} />
            </Pressable>
        </View>
    );

    const StatusSwipeItem = ({ id, reverse }) => (
        <View style={{ flex: 1, backgroundColor: 'green', flexDirection: 'row' }}>
            <View style={{ width: width - 50, paddingRight: 12, justifyContent: 'center', alignItems: 'flex-end', backgroundColor: colors.primary.yellowgreen }}>
                <Pressable onPress={()=>TransferArchive(id,reverse)}>
                    <Feather name="archive" size={25} color={'white'} />
                </Pressable>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: 'darkred' }}>
                <Pressable onPress={() => 
                db.transaction(tx => {
                tx.executeSql('DELETE FROM statusrecords WHERE id = ?', [id],
                    (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        let existingrecords = [...statusrecords].filter(c => c.id !== id);
                        setStatusrecords(existingrecords);
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

    const DeleteTrack = () => {
        const id = tracks.filter((c) => c.track == selectedTab).map((c) => c.id)[0];
        db.transaction(
            (tx) => {
            tx.executeSql(
                'DELETE FROM sections WHERE track = ?',
                [id],
                (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let existingSections = [...sections].filter((c) => c.track !== selectedTab);
                    setSections(existingSections);
                }
                },
                (txObj, error) => console.log(error)
            );
            }
        );

        db.transaction(
            (tx) => {
            tx.executeSql(
                'DELETE FROM tasks WHERE track = ?',
                [id],
                (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let existingTasks = [...tasks].filter((c) => c.track !== selectedTab);
                    setTasks(existingTasks);
                }
                },
                (txObj, error) => console.log(error)
            );
            }
        );

        db.transaction(
            (tx) => {
            tx.executeSql(
                'DELETE FROM tracks WHERE id = ?',
                [id],
                (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let existingTracks = [...tracks].filter((c) => c.id !== id);
                    setTracks(existingTracks);
                    setSelectedTab(existingTracks.map(c=>c.track)[0]);
                }
                },
                (txObj, error) => console.log(error)
            );
            }
        );
        setSelectedTabColor(colors.pale.default);
    };

    const DeleteSection = () => {
        const id= sections.filter(c=>c.section==selectedSection).map(c=>c.id)[0];
        db.transaction(tx=> {
            tx.executeSql('DELETE FROM sections WHERE id = ?', [id],
            (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let existingSections = [...sections].filter(c=>c.id!==id);
                    setSections(existingSections);
                  }
            },
            (txObj, error) => console.log(error)
            );       
        })  
        const taskid= tasks.filter(c=>c.section==selectedSection).map(c=>c.id)[0];
        db.transaction(tx=> {
            tx.executeSql('DELETE FROM tasks WHERE id = ?', [taskid],
            (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let existingTasks = [...tasks].filter(c=>(c.section!==selectedSection));
                    setTasks(existingTasks);
                  }
            },
            (txObj, error) => console.log(error)
            );       
        })   
        const progressid= progress.filter(c=>c.section==selectedSection).map(c=>c.id)[0];
        db.transaction(tx=> {
            tx.executeSql('DELETE FROM progress WHERE id = ?', [progressid],
            (txObj, resultSet) => {
                if (resultSet.rowsAffected > 0) {
                    let existingProgress = [...progress].filter(c=>(c.section!==selectedSection));
                    setProgress(existingProgress);
                  }
            },
            (txObj, error) => console.log(error)
            );       
        })    
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
                <View style={{ display: selectedTab==undefined? "none":"flex", width: "100%", height: 35, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <View style={{justifyContent: 'center', alignItems: 'flex-end', marginVertical: 2, marginHorizontal: 2 }}>
                        <TouchableOpacity>
                            <Feather onPress={()=>DeleteTrack()} name='trash-2' size={30} color={colors.primary.blue} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'flex-end', marginVertical: 2, marginHorizontal: 2 }}>
                        <TouchableOpacity onPress={()=>setNewSectionVisible(true)}>
                            <Feather name='plus-circle' size={30} color={colors.primary.blue} />
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    data={sections.filter(c=>c.track==selectedTab)} 
                    renderItem={({item,index}) => 
                    <View>
                        <View style={[container.section,{flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor: paleColor(selectedTabColor)}]}> 
                            <Text>{item.section}</Text>
                            <Pressable onPress={()=>updateArrowAtIndex(index,false)} style={{display:arrow.filter(c=>c.index==index).map(c=>c.arrow)[0]==true?"flex":"none",position:'absolute',right:10}}>
                                <MaterialIcons name="keyboard-arrow-down" size={25}/>
                            </Pressable>
                            <Pressable onPress={()=>updateArrowAtIndex(index,true)}  style={{display:arrow.filter(c=>c.index==index).map(c=>c.arrow)[0]==false?"flex":"none",position:'absolute',right:10}}>
                                <MaterialIcons name="keyboard-arrow-up" size={25}/>
                            </Pressable>
                        </View>
                        <View style={{display: arrow.filter(c=>c.index==index).map(c=>c.arrow)[0]==true?'flex':'none'}}>
                        <SwipeListView
                            data={tasks.filter(c=>(c.section==item.section && c.track==selectedTab && c.taskState!==2 ))}
                            renderItem={({item,index}) =>
                            <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
                            sections={sections} date={undefined} section={item.section} task={item.task} 
                            taskState={item.taskState} time={undefined} track={selectedTab} id={item.id} trackScreen={true} archive={false}/>
                            }
                            renderHiddenItem={({ item }) => <TaskSwipeItem id={item.id} />} 
                            bounces={false} 
                            rightOpenValue={-100}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                        />
                        <SwipeListView
                            data={progress.filter(c=>(c.list==item.section && c.track==selectedTab && c.progress!==100))}
                            renderItem={({item,index}) =>
                            <ProgressBar db={db} name={item.name} progress={progress} setProgress={setProgress} value={item.progress} id={item.id} color={selectedTabColor}/>
                            }
                            renderHiddenItem={({ item }) => <ProgressSwipeItem id={item.id} />} 
                            bounces={false} 
                            rightOpenValue={-50}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                        />
                        <SwipeListView
                            data={statusrecords.filter(c=>(c.section==item.section && c.track==selectedTab && c.archive==false))}
                            renderItem={({item,index}) =>
                            <Status db={db} name={item.name} list={item.list} statuslist={statuslist} statusrecords={statusrecords} setStatusrecords={setStatusrecords} number={item.number} id={item.id}/>
                            }
                            renderHiddenItem={({ item }) => <StatusSwipeItem id={item.id} reverse={false}/>} 
                            bounces={false} 
                            rightOpenValue={-100}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                        />
                        <View style={{flex:1, backgroundColor: colors.primary.white, flexDirection:'row', justifyContent:'flex-end'}}>
                            <TouchableOpacity onPress={()=>{DeleteSection();setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Feather name='trash-2' size={30} color={colors.primary.blue} />
                            </TouchableOpacity>  
                            <TouchableOpacity onPress={()=>{setNewStatusVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Entypo name="progress-full" size={30} color={colors.primary.blue} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setNewProgressVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Entypo name="progress-two" size={30} color={colors.primary.blue} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setNewTaskVisible(true);setSelectedSection(item.section)}} style={{justifyContent: 'center', alignItems:'flex-end',marginVertical:2, marginHorizontal:2}}>
                                <Feather name='check-square' size={30} color={colors.primary.blue} />
                            </TouchableOpacity> 
                        </View>
                        </View>
                        <NewTask addModalVisible={newTaskVisible} setAddModalVisible={setNewTaskVisible} db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} track={selectedTab} section={selectedSection} pageDate={undefined} tracksScreen={true}/>
                        <NewProgress addModalVisible={newProgressVisible} setAddModalVisible={setNewProgressVisible} db={db} progress={progress} setProgress={setProgress} track={selectedTab} section={selectedSection}/>
                        <NewStatus newStatusVisible={newStatusVisible} setNewStatusVisible={setNewStatusVisible} db={db} statuslist={statuslist} setStatuslist={setStatuslist} statusrecords={statusrecords} setStatusrecords={setStatusrecords} selectedTab={selectedTab} selectedSection={selectedSection}/>
                    </View>
                    }
                    keyExtractor= {(item,index) => index.toString()}
                    contentContainerStyle={{width:"100%"}}
                    showsHorizontalScrollIndicator={false}
                />
                <NewSection db={db} sections={sections} setSections={setSections} track={selectedTab} newSectionVisible={newSectionVisible} setNewSectionVisible={setNewSectionVisible}/>
                <NewTrack db={db} tracks={tracks} setTracks={setTracks} newTrackVisible={newTrackVisible} setNewTrackVisible={setNewTrackVisible} setSelectedTab={setSelectedTab} setSelectedTabColor={setSelectedTabColor}/>
            </View>
            <View>
                <View style={[container.section,{flexDirection: 'row', justifyContent:'flex-start', alignItems: 'center', backgroundColor: paleColor(selectedTabColor)}]}> 
                    <Text>ARCHIVES</Text>
                    <Pressable onPress={()=>setShowArchive(true)} style={{display:showArchive==false?"flex":"none",position:'absolute',right:10}}>
                        <MaterialIcons name="keyboard-arrow-up" size={25}/>
                    </Pressable>
                    <Pressable onPress={()=>setShowArchive(false)}  style={{display:showArchive==true?"flex":"none",position:'absolute',right:10}}>
                        <MaterialIcons name="keyboard-arrow-down" size={25}/>
                    </Pressable>
                </View>
                <View style={{display: showArchive==true?"flex":"none",maxHeight:200,justifyContent:'flex-start'}}>
                    <SwipeListView
                            data={tasks.filter(c=>(c.track==selectedTab && c.taskState==2 ))}
                            renderItem={({item,index}) =>
                            <Task db={db} tasks={tasks} setTasks={setTasks} tracks={tracks} setTracks={setTracks} 
                            sections={sections} date={undefined} section={item.section} task={item.task} 
                            taskState={item.taskState} time={undefined} track={selectedTab} id={item.id} trackScreen={false} archive={true}/>
                            }
                            renderHiddenItem={({ item }) => <ArchiveTaskSwipeItem id={item.id} />} 
                            bounces={false} 
                            rightOpenValue={-50}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                    />
                    <SwipeListView
                            data={progress.filter(c=>(c.track==selectedTab && c.progress==100))}
                            renderItem={({item,index}) =>
                                <View style={{height:40,width:width,backgroundColor:colors.primary.white,flexDirection:'row'}}>
                                    <View style={{width:width-140,justifyContent:'center',paddingLeft:10}}>
                                        <Text>{item.name}</Text>
                                    </View>
                                    <FlatList
                                    horizontal
                                    data={[{'name':item.name,'rate':1},{'name':item.name,'rate':2},{'name':item.name,'rate':3},{'name':item.name,'rate':4},{'name':item.name,'rate':5}]}
                                    renderItem={({ item,index }) => 
                                        <Pressable onPress={()=>{
                                            let existingprogress = [...progress]; 
                                            const id=progress.filter(c=>(c.name==item.name && c.track==selectedTab)).map(c=>c.id)[0];
                                            const progressIndex = progress.findIndex(c=>(c.name==item.name && c.track==selectedTab));
                                            db.transaction(tx=> {
                                                tx.executeSql('UPDATE progress SET rate = ? WHERE id=?', [item.rate,id],
                                                    (txObj, resultSet) => {
                                                    if (resultSet.rowsAffected > 0) {
                                                        existingprogress[progressIndex].rate = item.rate;
                                                        setProgress(existingprogress);
                                                    }
                                                    },
                                                    (txObj, error) => console.log('Error updating data', error)
                                                );
                                            });
                                        }} style={{justifyContent:'center'}}>
                                            <Ionicons name="star" size={25} color={item.rate<=progress.filter(c=>(c.track==selectedTab&&c.name==item.name)).map(c=>c.rate)[0]?selectedTabColor:'transparent'}/>
                                            <View style={{position:'absolute'}}>
                                                <Ionicons name="star-outline" size={25} />
                                            </View>
                                        </Pressable>
                                    }
                                    contentContainerStyle={{width:130}}
                                    scrollEnabled={false}
                                    />
                                </View>
                            }
                            renderHiddenItem={({ item }) => <ProgressSwipeItem id={item.id} />} 
                            bounces={false} 
                            rightOpenValue={-50}
                            disableRightSwipe={true}
                            closeOnRowBeginSwipe={true}
                            keyExtractor= {(item,index) => index.toString()}
                    />
                    <SwipeListView
                        data={statusrecords.filter(c=>(c.track==selectedTab && c.archive==true))}
                        renderItem={({item,index}) =>
                        <Status db={db} name={item.name} list={item.list} statuslist={statuslist} statusrecords={statusrecords} setStatusrecords={setStatusrecords} number={item.number} id={item.id}/>
                        }
                        renderHiddenItem={({ item,index }) => <StatusSwipeItem id={item.id} reverse={true}/>} 
                        bounces={false} 
                        rightOpenValue={-100}
                        disableRightSwipe={true}
                        closeOnRowBeginSwipe={true}
                        keyExtractor= {(item,index) => index.toString()}
                    />
                </View>
                    
            </View>
        </SafeAreaView>
    );
}

export default Tracks;
