import { Pressable, StyleSheet, Text, View } from "react-native";

const Start = ({ navigation }: any) => {
    return (
        <View style={styles.view}>
            <View style={{ width: '100%' }}>
                <Pressable style={ ({pressed}) =>[{
                    backgroundColor: pressed ? 'rgba(77, 211, 255, 1)':'rgba(120, 222, 255, 1)',
                    },styles.startButton] } 
                    onPress={ ()=>navigation.navigate('Room') }>
                    <Text style={{ textAlign: 'center' }}>Start</Text>
                </Pressable>
                <Pressable style={ ({pressed}) =>[{
                    backgroundColor: pressed ? 'rgba(77, 211, 255, 1)':'rgba(120, 222, 255, 1)',
                },styles.startButton] } onPress={ ()=>navigation.navigate('Login') }>
                    <Text style={{ textAlign: 'center' }}>Login</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex:1,
        justifyContent: "center", 
        alignContent: 'center'
    },
    startButton: { 
        alignSelf: 'center', 
        width: 150, 
        height: 80,
        borderRadius:10, 
        alignContent:'center',
        justifyContent:'center',
        textTransform:'uppercase'
    }
})
export default Start