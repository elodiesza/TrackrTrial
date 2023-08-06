import React, { useEffect, useState } from 'react';
import { TouchableOpacity,View,Text } from 'react-native';
import { colors } from '../styles';
import { Ionicons } from '@expo/vector-icons';
import WeatherData from '../constants/Weather';
import uuid from 'react-native-uuid';

function UpdateWeather({db, weather, setWeather, year, month, day}) {
    const initialWeather= weather.filter(c=>(c.year==year&&c.month==month&&c.day==day)).length==0?'cloud-outline': weather.filter(c=>(c.year==year&&c.month==month&&c.day==day)).map(c=>c.weather)[0];
    const initialWeatherId=WeatherData.filter(c=>c.weather==initialWeather).map(c=>c.id)[0];
    const [selectedId, setSelectedId] = useState(weather.filter(c=>(c.year==year&&c.month==month&&c.day==day)).length==0?-1:initialWeatherId);
    const [selectedWeather, setSelectedWeather] = useState(initialWeather);

    useEffect(() => {
        setSelectedWeather(
            selectedId==-1?'cloud-outline':
            WeatherData.filter(c=>c.id==selectedId).map(c=>c.weather)[0]);
    },[,selectedId]);

    const changeWeather = () => {
        let existingweather=[...weather];
        if(weather.filter(c=>(c.year==year && c.month==month && c.day==day)).length==0){    
            db.transaction((tx) => {
                tx.executeSql('INSERT INTO weather (id,weather,year,month,day) values (?,?,?,?,?)',
                [uuid.v4(),selectedWeather,year,month,day],
                (txtObj,resultSet)=> {    
                    existingweather.push({id:uuid.v4(),weather:selectedWeather,year:year,month:month,day:day});
                    setWeather(existingweather);
                    console.warn('Insert completed')
                },
                (txtObj, error) => console.warn('Error inserting data:', error)
                );
            });
        }
        else {
            const id=weather.filter(c=>(c.year==year && c.month==month && c.day==day)).map(c=>c.id)[0];
            const indexToUpdate = existingweather.findIndex(c => c.id == id);
            db.transaction(tx=> {
                tx.executeSql('UPDATE weather SET weather = ? WHERE id = ?', [selectedWeather, id],
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                    existingweather[indexToUpdate].weather = selectedWeather;
                    setWeather(existingweather);
                    }
                },
                (txObj, error) => console.log('Error updating data', error)
                );
            });
        }
    };

  return (
    <TouchableOpacity onPress={()=>{changeWeather();setSelectedId(selectedId==5?0:selectedId+1);}} style={{width:100, justifyContent:'center', alignItems:'center'}}>
            <View style={{display:selectedId==-1?"flex":"none"}}>
                <Ionicons name={selectedWeather} size={60} color={colors.primary.gray}/>
            </View>
            <View style={{display:selectedId==-1?"none":"flex"}}>
                <Ionicons name={selectedWeather} size={60} color={colors.primary.blue}/>
            </View>
    </TouchableOpacity>
  );
};

export default UpdateWeather;
