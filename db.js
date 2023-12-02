import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';


const useDatabase = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [habits, setHabits] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [states, setStates] = useState([]);
  const [staterecords, setStaterecords] = useState([]);
  const [scales, setScales] = useState([]);
  const [scalerecords, setScalerecords] = useState([]);
  const [timerecords, setTimerecords] = useState([]);
  const [times, setTimes] = useState([]);
  const [diary, setDiary] = useState([]);
  const [weather, setWeather] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [load, loadx] = useState(0);


  useEffect(() => {
    setIsLoading(true);
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS habits (id TEXT PRIMARY KEY, name TEXT, year INTEGER, month INTEGER, day INTEGER, state BOOLEAN, type INTEGER, productive BOOLEAN, icon TEXT, color TEXT, place INTEGER, UNIQUE(name,year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM habits ORDER BY place,day;', null,
      (txObj, resultSet0) => setHabits(resultSet0.rows._array),
      (txObj, error) => console.log('error selecting habits')
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
      tx.executeSql('CREATE TABLE IF NOT EXISTS states (id TEXT PRIMARY KEY, name TEXT, item TEXT, icon TEXT, color TEXT,place INTEGER)')
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
      tx.executeSql('CREATE TABLE IF NOT EXISTS scales (id TEXT PRIMARY KEY, name TEXT, min INTEGER, max INTEGER, mincolor TEXT, maxcolor TEXT, unit TEXT, icon TEXT, place INTEGER, UNIQUE(name))')
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
      tx.executeSql('CREATE TABLE IF NOT EXISTS times (id TEXT PRIMARY KEY, name TEXT, mincolor TEXT, maxcolor TEXT, icon TEXT, place INTEGER, UNIQUE(name))')
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
      tx.executeSql('CREATE TABLE IF NOT EXISTS diary (id TEXT PRIMARY KEY, year INTEGER, month INTEGER, day INTEGER, notes TEXT, img1 TEXT, img2 TEXT, img3 TEXT, img4 TEXT, UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM diary', null,
      (txObj, resultSet12) => setDiary(resultSet12.rows._array),
      (txObj, error) => console.log('error selecting diary')
      );
    });
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS weather (id TEXT PRIMARY KEY, weather TEXT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
    });
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM weather ORDER BY day;', null,
      (txObj, resultSet13) => setWeather(resultSet13.rows._array),
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
    moods,
    sleep,
    states,
    staterecords,
    scales,
    scalerecords,
    times,
    timerecords,
    diary,
    db,
    weather,
    analytics,
    load,
    setHabits,
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
    setWeather,
    setAnalytics,
    loadx,
  };
};

export default useDatabase;