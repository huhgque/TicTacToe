import AsyncStorage from "@react-native-async-storage/async-storage"
import { useState } from "react"
import { StyleSheet, Text, View , TextInput, Pressable } from "react-native"
import EncryptedStorage from "react-native-encrypted-storage"
import commonStyle from "../assets/commonstyle"

const Login = ({navigation}:any)=>{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleLogin =  async ()=>{
        let loginReq = await fetch("http://10.0.2.2:3000/auth/login",{
            method:"POST",
            body:JSON.stringify({email,password}),
            headers:{"Content-Type":"application/json"}
        })
        if(loginReq.status === 201){
            let data = await loginReq.json()
            const token = data["access_token"]
            console.log(token);
            EncryptedStorage.setItem("user_session",token)
            let userInfoFetch = await fetch("http://10.0.2.2:3000/users/user-info",{headers:{
                "authorization":"Bearer "+token,
                "content-type":"application/json"
            },method:"GET"})
            if(userInfoFetch.status === 200){
                let userInfo = await userInfoFetch.json()
                AsyncStorage.setItem("user",JSON.stringify(userInfo))
                navigation.navigate("Home")
            }
        }
    }

    return (
        <View>
            <View>
                <Text>Email</Text>
                <TextInput placeholder="Email" value={email} onChangeText={e => setEmail(e)}></TextInput>
                <Text aria-label="error"></Text>
            </View>
            <View>
                <Text>Password</Text>
                <TextInput placeholder="Password" secureTextEntry={true} value={password} onChangeText={e => setPassword(e)}></TextInput>
                <Text aria-label="error"></Text>
            </View>
            <View>
                <Pressable >
                    <Text style={styles.loginButton} onPress={handleLogin}>Login</Text>
                </Pressable>
                <Pressable>
                    <Text style={styles.registerButton}>Register</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bg:{
    },
    loginButton: {
        ...commonStyle.primarybg,
        ...commonStyle.button,
    },
    registerButton: {
        ...commonStyle.button,
        ...commonStyle.secondarybg
    },
})
export default Login