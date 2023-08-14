import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import Setting from './Setting';
import Start from './Start';

const Tab = createBottomTabNavigator()
function Home({ navigation }:any) {
  return (
        <Tab.Navigator screenOptions={{headerShown:false}} initialRouteName='Start'>
          <Tab.Screen name='Profile' component={Profile}></Tab.Screen>
          <Tab.Screen name='Start' component={Start}></Tab.Screen>
          <Tab.Screen name='Settings' component={Setting}></Tab.Screen>
        </Tab.Navigator>
  );
}

export default Home