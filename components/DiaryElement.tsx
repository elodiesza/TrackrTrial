import React, {useState, useEffect} from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView, Pressable } from 'react-native';
import {container, colors} from '../styles';
import { MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';


const DiaryElement = ({ db, year, month, day, diary, setDiary, load, loadx}) => {
    const {control, handleSubmit, reset} = useForm();
    const [updatenotesDisplay, setUpdatenotesDisplay] = useState(false);
    const [displayedDiary, setDisplayedDiary] = useState('');

    useEffect(() => {
        setUpdatenotesDisplay(false);
        setDisplayedDiary(diary.filter(c=>(c.year==year && c.month==month && c.day==day)).length>0?diary.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.notes)[0]:'');
    }, [,diary,day]);

    const UpdateDiary = async (data) => {
        let existingdiary = [...diary]; 
        if(diary.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0){
            console.warn('enters if');
            db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO diary (year, month, day, notes) VALUES (?, ?, ?, ?)',
                  [year, month, day, data.notes],
                  (txtObj, stateResultSet) => {
                    const newState = {
                      id: stateResultSet.insertId,
                        year: year,
                        month: month,
                        day: day,
                        notes: data.notes
                    };
                    existingdiary.push(newState);
                    setDiary(existingdiary); 
                    loadx(!load);
                  }
                );
            });
        }
        else {
            let diaryId = existingdiary.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
            let diaryIndex = existingdiary.findIndex(c => c.id === diaryId);
            db.transaction(tx=> {
                tx.executeSql('UPDATE diary SET notes = ? WHERE year= ? AND month=? AND day=?', 
                [data.notes, year, month, day],
                  (txObj, resultSet2) => {
                    if (resultSet2.rowsAffected > 0) {
                      existingdiary[diaryIndex].notes = data.notes;
                      setDiary(existingdiary);
                      loadx(!load);
                    }
                  },
                  (txObj, error) => console.log('Error updating data', error)
                );
            });
        }
        setUpdatenotesDisplay(false);
    };

    

    return (
        <View style={[container.body,{justifyContent:'center', backgroundColor:colors.primary.white}]}>
            <View style={[styles.textBox,{borderColor:  updatenotesDisplay ? colors.primary.defaultdark : colors.primary.blue}]}>
                <View style={{flex:1, margin:10, flexDirection:'row'}}>
                    <ScrollView style={{flex:1}}>
                        <View style={{flex:1, display: updatenotesDisplay? "none" : "flex"}}>
                            <Text style={{color: colors.primary.defaultdark}}>
                                {displayedDiary}
                            </Text>
                        </View>
                        <View style={{flex:1, display: updatenotesDisplay ? "flex" : "none"}}>
                            <Controller
                                    control= {control}
                                    name="notes"
                                    render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                                        <>
                                    <TextInput
                                        value={displayedDiary}
                                        defaultValue={diary.filter(c=>(c.year==year && c.month==month && c.day==day)).length>0 ? diary.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.notes)[0] : ''}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        multiline={true}
                                        placeholder={"What did you do today ?"}
                                        style={{flex:1,borderColor: error ? 'red' : '#e8e8e8'}}
                                    />
                                    {error && (
                                        <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
                                    )}
                                    </>
                                )}
                            />
                        </View>
                        
                    </ScrollView>
                    <View style={{alignItems:'center'}}>
                        <Pressable style={{display: updatenotesDisplay? "none":"flex"}} onPress={()=>setUpdatenotesDisplay(!updatenotesDisplay)}>
                            <MaterialCommunityIcons name="fountain-pen-tip" size={40} color={colors.primary.blue} />
                        </Pressable>
                        <Pressable style={{display: updatenotesDisplay? "flex":"none"}} onPress={()=>setUpdatenotesDisplay(!updatenotesDisplay)}>
                            <MaterialIcons name="cancel" size={40} color={colors.primary.blue} />
                        </Pressable>
                        <Pressable onPress={handleSubmit(UpdateDiary)} style={{display: updatenotesDisplay ? "flex" : "none"}}>
                            <Feather name="send" size={32} color={colors.primary.blue} />
                        </Pressable>
                    </View>
                </View>
                <View style={{width: '100%', padding:15, height:60, flexDirection:'row', alignItems:'center'}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{width:40,height:40, borderColor: colors.primary.blue, borderWidth:1, backgroundColor: colors.primary.white, marginRight:10}}/>
                        <View style={{width:40,height:40, borderColor: colors.primary.blue, borderWidth:1, backgroundColor: colors.primary.white, marginRight:10}}/>
                        <View style={{width:40,height:40, borderColor: colors.primary.blue, borderWidth:1, backgroundColor: colors.primary.white, marginRight:10}}/>
                    </View>
                    <MaterialCommunityIcons name="camera" size={35} color={colors.primary.blue} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textBox: {
        width:"90%",
        height: 150,
        backgroundColor: colors.white,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        borderWidth: 2,
    }
});

export default DiaryElement;