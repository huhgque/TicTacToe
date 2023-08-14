import { NavigationContainer } from "@react-navigation/native"
import Home from "./src/Home"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Room from "./src/Room"
import RoomDetail from "./src/RoomDetail"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Profile from "./src/Profile"
import Setting from "./src/Setting"
import Start from "./src/Start"
import Game from "./src/Game"
import Login from "./src/auth/Login"
import Register from "./src/auth/Register"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

const App = ()=>{
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={Home}></Stack.Screen>
        <Stack.Screen name="Login" component={Login}></Stack.Screen>
        <Stack.Screen name="Register" component={Register}></Stack.Screen>
        <Stack.Screen name="Room" component={Room}></Stack.Screen>
        <Stack.Screen name="RoomDetail" component={RoomDetail}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
        <Stack.Screen name="Setting" component={Setting}></Stack.Screen>
        <Stack.Screen name="Start" component={Start}></Stack.Screen>
        <Stack.Screen name="Game" component={Game}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App