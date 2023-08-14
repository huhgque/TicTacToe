import { useEffect } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

let navigationGlob:any = undefined

const PlayerReady = ()=>{
    navigationGlob.navigate("Game")
}
const RoomDetail = ({route,navigation}:any)=>{
    navigationGlob = navigation
    const {roomId} = route.params
    useEffect(()=>{
        
    },[])
    return (
        <View>
            <View style={styles.playerInfoContainer}>
                <Text>Player 1 info</Text>
                <Text>Player 2 info</Text>
            </View>
            <View>
                <Pressable>
                    <Text>Leave room</Text>
                </Pressable>
                <Pressable onPress={PlayerReady}>
                    <Text>Ready</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    playerInfoContainer:{

    }
})

export default RoomDetail