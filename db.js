import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('example.db');

const useDatabase = () => {
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [states, setStates] = useState([]);
  const [staterecords, setStaterecords] = useState([]);
  const [scales, setScales] = useState([]);
  const [scalerecords, setScalerecords] = useState([]);
  const [times, setTimes] = useState([]);
  const [diary, setDiary] = useState([]);
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState([]);


  useEffect(() => {
    setIsLoading(true);
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, type INTEGER, tag INTEGER, place INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM habits ORDER BY place,day;', null,
      (txObj, resultSet) => setHabits(resultSet.rows._array),
      (txObj, error) => console.log('error selecting habits')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT, color TEXT, UNIQUE(tag))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tags', null,
      (txObj, resultSet) => setTags(resultSet.rows._array),
      (txObj, error) => console.log('error selecting tags')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, tag INTEGER, time TEXT, section TEXT, UNIQUE(task,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', null,
      (txObj, resultSet) => setTasks(resultSet.rows._array),
      (txObj, error) => console.log('error selecting habits')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS moods (id INTEGER PRIMARY KEY AUTOINCREMENT, mood TEXT, year INTEGER, month INTEGER, day INTEGER,UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM moods', null,
      (txObj, resultSet) => setMoods(resultSet.rows._array),
      (txObj, error) => console.log('error selecting habits')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sleep (id INTEGER PRIMARY KEY AUTOINCREMENT, sleep INTEGER, wakeup INTEGER, year INTEGER, month INTEGER, day INTEGER, type INT, UNIQUE(sleep,year,month,day),UNIQUE(wakeup,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sleep', null,
      (txObj, resultSet) => setSleep(resultSet.rows._array),
      (txObj, error) => console.log('error selecting habits')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, item TEXT, color TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM states', null,
      (txObj, resultSet) => setStates(resultSet.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS staterecords (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, item TEXT, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM staterecords', null,
      (txObj, resultSet) => setStaterecords(resultSet.rows._array),
      (txObj, error) => console.log('error selecting state records')
      );
    });
  
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS scales (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, min INTEGER, max INTEGER, mincolor TAXT, maxcolor TEXT, unit TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scales', null,
      (txObj, resultSet) => setScales(resultSet.rows._array),
      (txObj, error) => console.log('error selecting scales')
      );
    });
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS scalerecords (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, value INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scalerecords', null,
      (txObj, resultSet) => setScalerecords(resultSet.rows._array),
      (txObj, error) => console.log('error selecting stale records')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS times (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, min INTEGER, max INTEGER, mincolor TAXT, maxcolor TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM times', null,
      (txObj, resultSet) => setTimes(resultSet.rows._array),
      (txObj, error) => console.log('error selecting times')
      );
    });
  
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS diary (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER, month INTEGER, day INTEGER, notes TEXT, img1 TEXT, img2 TEXT, img3 TEXT, img4 TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM diary', null,
      (txObj, resultSet) => setDiary(resultSet.rows._array),
      (txObj, error) => console.log('error selecting diary')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sections (id INTEGER PRIMARY KEY AUTOINCREMENT, section TEXT, track TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sections', null,
      (txObj, resultSet) => setSections(resultSet.rows._array),
      (txObj, error) => console.log('error selecting section')
      );
    });
 
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS progress (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, track TEXT, list TEXT, progress INTEGER, rate INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM progress', null,
      (txObj, resultSet) => setProgress(resultSet.rows._array),
      (txObj, error) => console.log('error selecting progress')
      );
    });

    setIsLoading(false);
  
  },[load]);

  // Return the states and any relevant functions that you want to access from App.js
  return {
    isLoading,
    habits,
    tasks,
    tags,
    moods,
    sleep,
    states,
    staterecords,
    scales,
    scalerecords,
    times,
    diary,
    load,
    db,
    sections,
    progress,
    loadx,
    setHabits,
    setTasks,
    setTags,
    setMoods,
    setSleep,
    setStates,
    setStaterecords,
    setScales,
    setScalerecords,
    setTimes,
    setDiary,
    setDb,
    setIsLoading,
    setSections,
    setProgress,
  };
};

export default useDatabase;