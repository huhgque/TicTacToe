import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native'
import commonStyle from './assets/commonstyle'
import EncryptedStorage from 'react-native-encrypted-storage'
import { useEffect, useState } from 'react'
// let rooms = [{id:1,name:"player",playerCount:1},{id:2,name:"player",playerCount:1},{id:3,name:"player",playerCount:1}]
let navigationGlob:any = undefined
const Room = ({navigation}:any)=>{
    const [rooms,setRooms] = useState<any[]>([])
    const createRoom = async ()=>{
        const token = await EncryptedStorage.getItem("user_session")
        const tryCreateGame = await fetch("http://10.0.2.2:3000/rooms",{headers:{
            "authorization":"Bearer "+token,
        },method:"POST"})
        if(tryCreateGame.status == 201){
            const json = await tryCreateGame.json() 
            navigation.navigate("Game",{roomId:json})
        }else{
            console.log(tryCreateGame);
        }
    }
    useEffect(()=>{
        const callAsync = async ()=>{
            const token = await EncryptedStorage.getItem("user_session")
            const roomfet = await fetch("http://10.0.2.2:3000/rooms",{headers:{
                "authorization":"Bearer "+token
            }})
            if(roomfet.status == 200){
                const rooms = await roomfet.json()
                console.log(rooms);
                setRooms(rooms)
            }else{
                Alert.alert("Err status",await roomfet.text())
                console.log(roomfet);
            }
        }
        callAsync()
    },[])
    navigationGlob = navigation
    const listRoom = rooms.map( (t)=>RenderRoom(t) )
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Join other player</Text>
            </View>
            <ScrollView horizontal contentContainerStyle={styles.listRoom}>
                {listRoom}
            </ScrollView>
            <View style={styles.roomButtonContainer}>
                <Pressable style={
                    ({pressed})=>[{
                        backgroundColor: pressed ? 'gray':'#DBE2EF'
                    },styles.roomCreate]
                    } onPress={createRoom}>
                    <Text>Create room</Text>
                </Pressable>
                <Pressable style={({pressed})=>[{
                        backgroundColor: pressed ? 'gray':commonStyle.primarybg.backgroundColor
                    },styles.roomMatching]}>
                    <Text>Random match</Text>
                </Pressable>
                <Pressable style={({pressed})=>[{
                        backgroundColor: pressed ? 'gray':'#DBE2EF'
                    },styles.roomJoin]}>
                    <Text>Join room</Text>
                </Pressable>
            </View>
        </View>
    )
}

const RenderRoom = (table:any)=>{
    return (
            <Pressable onPress={ () => navigationGlob.navigate("Game",{roomId:table._id})} style={ ({pressed})=>[
                    {backgroundColor:pressed?'rgba(206, 240, 240, 1)':'rgba(230, 255, 255, 1)'},
                    styles.room]} 
                    key={table._id}>
                <Text style={styles.textCenter}>{table.host}'s room {table._id}</Text>
                <Text style={styles.textCenter}>1/2</Text>
                <Text style={styles.textCenter}>Join</Text>
            </Pressable>

    )
}

const styles = StyleSheet.create({
    roomButtonContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignContent:'center'
    },
    roomCreate:{
        ...commonStyle.button,
        // backgroundColor:'#DBE2EF',
    },
    roomJoin:{
        ...commonStyle.button,
        // backgroundColor:'#DBE2EF',
    },
    roomMatching:{
        ...commonStyle.button,
        // ...commonStyle.primarybg
    },
    textCenter:{
        textAlign:'center'
    },
    container:{
    },
    title:{
        textAlign:'center',
        padding:10
    },
    listRoom:{
        width:'100%',
        justifyContent:'space-between'
    },
    room:{
        borderWidth:1,
        borderColor:'rgba(2, 118, 120, 1)',
        padding:10,
        width:'30%',
        textAlign:'center'
    },
})
export default Room