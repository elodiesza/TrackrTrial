import React, { useEffect, useState } from 'react';
import { TouchableOpacity,View,Text } from 'react-native';
import { colors } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import WeatherData from '../constants/Weather';
import uuid from 'react-native-uuid';
import { set } from 'react-hook-form';

function UpdateWeather({db, weather, setWeather, year, month, day, load, loadx}) {

    const [selectedWeather, setSelectedWeather] = useState(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0? 'add-circle-outline':weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.weather)[0]);
    const [selectedId, setSelectedId] = useState(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0? -1:WeatherData.filter(c=>c.weather==weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.weather)[0]).map(c=>c.id)[0]);

    useEffect(() => {
        if(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.weather)[0]==undefined){
            setSelectedWeather('add-circle-outline');
            setSelectedId(-1);
        }
        else{
            setSelectedWeather(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.weather)[0]);
            setSelectedId(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0? -1:WeatherData.filter(c=>c.weather==weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.weather)[0]).map(c=>c.id)[0]);
        }
    }, [day,weather]);



    const changeWeather = () => {
        let existingweather=[...weather];
        const newWeather = WeatherData.filter(c=>c.id==(selectedId==5?0:selectedId+1)).map(c=>c.weather)[0];
        if(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0){    
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO weather (id,weather,year,month,day) values (?,?,?,?,?)',
                [uuid.v4(),newWeather,year,month,day],
                (txtObj,resultSet)=> {    
                    existingweather.push({id:uuid.v4(),weather:newWeather,year:year,month:month,day:day});
                    setWeather(existingweather);
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
            });
        }
        else {
            const id=weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
            const indexToUpdate = existingweather.findIndex(c => c.id == id);
            db.transaction(tx=> {
                tx.executeSql('UPDATE weather SET weather = ? WHERE id = ?', [newWeather, id],
                (txObj, resultSet) => {
                    existingweather[indexToUpdate].weather = newWeather;
                    setWeather(existingweather);
                },
                (txObj, error) => console.log('Error updating data', error)
                );
            });
        }
        loadx(!load);
    };

  return (
    <TouchableOpacity onPress={()=>{changeWeather()}} style={{width:100, justifyContent:'center', alignItems:'center'}}>
        <Ionicons name={selectedWeather} size={50} color={selectedWeather=='add-circle-outline'?colors.primary.blue:colors.primary.black}/>
    </TouchableOpacity>
  );
};

export default UpdateWeather;
