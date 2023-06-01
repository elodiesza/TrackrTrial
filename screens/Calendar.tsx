import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function App() {
  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();

  var days = [];

  const GetDaysInMonth = (month) => {
    var date = new Date(thisYear, thisMonth, 1);
    var firstDay = date.getDay();
    if (firstDay == 0) {
      for (let i=0; i<6; i++) {
        days.push(0);
      }
      while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
      }
    }
    else {
      for (let i=1; i<firstDay; i++) {
        days.push(0);
      }
      while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
      }
    }

    return days;
  }

  var daysLength = GetDaysInMonth(thisMonth).length;

  var line1 = GetDaysInMonth(thisMonth).slice(0,7);
  var line2 = GetDaysInMonth(thisMonth).slice(7,14);
  var line3 = GetDaysInMonth(thisMonth).slice(14,21);
  var line4 = GetDaysInMonth(thisMonth).slice(21,28);
  var line5 = () => { 
    let list=[];
    if (daysLength>28) {
        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(thisMonth)[29+i]);
        }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }
  var line6 = () => { 
    let list=[];
    if (daysLength>35) {

        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(thisMonth)[36+i]);
        }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }

  var daysLines = [line1,line2,line3,line4,line5(),line6()];


  const CalendarCell = (date) => {
    return(
      <View style={styles.calendarCell}>
        <Text>{date}</Text>
      </View>
    )
  }

  const CalendarLine = (line) => {
    return (
      <View style={styles.container}>
          <FlatList
            data={line}
            renderItem={({item}) => CalendarCell(item)}
            keyExtractor={item => item.id}
            horizontal={true}
          />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{alignContent:'center', justifyContent:'center', flex:1}}>
          <Text>JUNE</Text>  
        </View> 
      </View>
      <View style={styles.calendarContainer}></View>
      <FlatList
        data={daysLines}
        renderItem={({item}) => CalendarLine(item)}
        keyExtractor={item => item.id}
      />
      <View style={styles.footer}>
        <Text>HEY</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  calendarCell: {
    alignContent: 'center',
    justifyContent: 'center',
    flex:1,
    height: (windowHeight*8/10)/6,
    borderWidth:1,
    borderColor: 'black',
    backgroundColor: 'white',
    width: windowWidth/7,
  },
  header: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  calendarContainer: {
    flex:8,
    alignContent: 'center',
    justifyContent: 'center',
  },
  footer: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  }
});
