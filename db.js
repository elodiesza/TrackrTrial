import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


const useDatabase = () => {
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [states, setStates] = useState([]);
  const [staterecords, setStaterecords] = useState([]);
  const [scales, setScales] = useState([]);
  const [scalerecords, setScalerecords] = useState([]);
  const [timerecords, setTimerecords] = useState([]);
  const [times, setTimes] = useState([]);
  const [diary, setDiary] = useState([]);
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState([]);
  const [weather, setWeather] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [stickerrecords, setStickerrecords] = useState([]);
  const [analytics, setAnalytics] = useState([]);


  useEffect(() => {
    setIsLoading(true);
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS habits (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, type INTEGER, track INTEGER, place INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM habits ORDER BY place,day;', null,
      (txObj, resultSet) => setHabits(resultSet.rows._array),
      (txObj, error) => console.log('error selecting habits')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tracks (id TEXT PRIMARY KEY, track TEXT, color TEXT, UNIQUE(track))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tracks', null,
      (txObj, resultSet2) => setTracks(resultSet2.rows._array),
      (txObj, error) => console.log('error selecting tracks')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, monthly BOOLEAN, track INTEGER, time TEXT, section TEXT, UNIQUE(task,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', null,
      (txObj, resultSet3) => setTasks(resultSet3.rows._array),
      (txObj, error) => console.log('error selecting tasks')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS moods (id TEXT PRIMARY KEY, mood TEXT, year INTEGER, month INTEGER, day INTEGER,UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM moods', null,
      (txObj, resultSet4) => setMoods(resultSet4.rows._array),
      (txObj, error) => console.log('error selecting moods')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sleep (id TEXT PRIMARY KEY, sleep INTEGER, wakeup INTEGER, year INTEGER, month INTEGER, day INTEGER, type INT, UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sleep', null,
      (txObj, resultSet5) => setSleep(resultSet5.rows._array),
      (txObj, error) => console.log('error selecting sleep')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS states (id TEXT PRIMARY KEY, name TEXT, item TEXT, color TEXT,place INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM states ORDER BY place;', null,
      (txObj, resultSet6) => setStates(resultSet6.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS staterecords (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, item TEXT, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM staterecords ORDER BY day;', null,
      (txObj, resultSet7) => setStaterecords(resultSet7.rows._array),
      (txObj, error) => console.log('error selecting state records')
      );
    });
  
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS scales (id TEXT PRIMARY KEY, name TEXT, min INTEGER, max INTEGER, mincolor TEXT, maxcolor TEXT, unit TEXT, place INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scales ORDER BY place;', null,
      (txObj, resultSet8) => setScales(resultSet8.rows._array),
      (txObj, error) => console.log('error selecting scales')
      );
    });
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS scalerecords (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, value INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scalerecords ORDER BY day;', null,
      (txObj, resultSet9) => setScalerecords(resultSet9.rows._array),
      (txObj, error) => console.log('error selecting stale records')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS times (id TEXT PRIMARY KEY, name TEXT, mincolor TEXT, maxcolor TEXT, place INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM times ORDER BY place', null,
      (txObj, resultSet10) => setTimes(resultSet10.rows._array),
      (txObj, error) => console.log('error selecting times')
      );
    });
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS timerecords (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, hours INTEGER, minutes INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM timerecords ORDER BY day;', null,
      (txObj, resultSet11) => setTimerecords(resultSet11.rows._array),
      (txObj, error) => console.log('error selecting time records')
      );
    });
  
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS diary (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, notes TEXT, img1 TEXT, img2 TEXT, img3 TEXT, img4 TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM diary', null,
      (txObj, resultSet12) => setDiary(resultSet12.rows._array),
      (txObj, error) => console.log('error selecting diary')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS sections (id TEXT PRIMARY KEY, section TEXT, track TEXT)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM sections', null,
      (txObj, resultSet13) => setSections(resultSet13.rows._array),
      (txObj, error) => console.log('error selecting section')
      );
    });
 
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS progress (id TEXT PRIMARY KEY, name TEXT, track TEXT, list TEXT, progress INTEGER, rate INTEGER)')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM progress', null,
      (txObj, resultSet14) => setProgress(resultSet14.rows._array),
      (txObj, error) => console.log('error selecting progress')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS weather (id TEXT PRIMARY KEY, weather TEXT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM weather ORDER BY day;', null,
      (txObj, resultSet) => setWeather(resultSet.rows._array),
      (txObj, error) => console.log('error selecting weather')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS stickers (id TEXT PRIMARY KEY, name TEXT, icon TEXT, color TEXT, UNIQUE(icon,color), UNIQUE(name))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM stickers', null,
      (txObj, resultSet15) => setStickers(resultSet15.rows._array),
      (txObj, error) => console.log('error selecting weather')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS stickerrecords (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, state BOOLEAN, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM stickerrecords ORDER BY day;', null,
      (txObj, resultSet16) => setStickerrecords(resultSet16.rows._array),
      (txObj, error) => console.log('error selecting weather')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS analytics (id TEXT PRIMARY KEY, indicator1 TEXT, type1 TEXT, indicator2 TEXT, type2 TEXT, status INTEGER, UNIQUE(indicator1,indicator2))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM analytics', null,
      (txObj, resultSet17) => setAnalytics(resultSet17.rows._array),
      (txObj, error) => console.log('error selecting analytics')
      );
    });

    setIsLoading(false);
  
  },[load]);

  // Return the states and any relevant functions that you want to access from App.js
  return {
    isLoading,
    habits,
    tasks,
    tracks,
    moods,
    sleep,
    states,
    staterecords,
    scales,
    scalerecords,
    times,
    timerecords,
    diary,
    load,
    db,
    sections,
    progress,
    weather,
    stickers,
    stickerrecords,
    analytics,
    loadx,
    setHabits,
    setTasks,
    setTracks,
    setMoods,
    setSleep,
    setStates,
    setStaterecords,
    setScales,
    setScalerecords,
    setTimes,
    setTimerecords,
    setDiary,
    setDb,
    setIsLoading,
    setSections,
    setProgress,
    setWeather,
    setStickers,
    setStickerrecords,
    setAnalytics,
  };
};

export default useDatabase;