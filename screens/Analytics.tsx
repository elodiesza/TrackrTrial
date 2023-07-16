import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { container } from '../styles';



function Analytics() {

  return (

      <SafeAreaView style={container.container}>
        <View style={container.header}>
            <Text style={{fontSize:20}}>ANALYTICS</Text>
        </View>
        <View style={container.body}>

        </View>
      </SafeAreaView>
  );
}

export default Analytics;
