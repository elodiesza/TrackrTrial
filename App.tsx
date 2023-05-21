import { StyleSheet, Text, View } from 'react-native';
import Trackers from './screens/Trackers';

export default function App() {
  return (
    <View style={styles.container}>
      <Trackers/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
