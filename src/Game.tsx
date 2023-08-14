import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { styled, withExpoSnack } from "nativewind"
import React, { useCallback, useEffect, useState } from "react"
import { Alert, BackHandler, Pressable, StyleSheet, Text, View } from "react-native"
import EncryptedStorage from "react-native-encrypted-storage"
import { Socket, io } from "socket.io-client"
import AwesomeAlert from "react-native-awesome-alerts"
type GameMove = {
    player: String
    xCord: Number
    yCord: Number
    turn: Number
}
const ViewS = styled(View)
const TextS = styled(Text)
const Game = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const { roomId } = route.params as any
    const [user, setUser] = useState<any>()
    const [otherUser, setOtherUser] = useState<any>()
    const [turn, setTurn] = useState(0)
    const [socket, setSocket] = useState<Socket>()
    const [socketmsg, setSocketMsg] = useState("")
    const [move, setMove] = useState<GameMove[]>([])
    const [allowClick, setAllowClick] = useState(true)
    const [alertPlayerJoin,setJoinAlert] = useState(false)
    const [alertPlayerLeave,setLeaveAlert] = useState(false)
    const [gameRule, setGameRule] = useState({
        gameId: roomId,
        gameMode: "3x3",
        gameTileX: 3,
        gameTileY: 3,
        maxTile: 3 * 3
    })
    useFocusEffect(
        useCallback(() => {
            const token = EncryptedStorage.getItem("user_session")
            const sk = io("http://10.0.2.2:3000/game-socket", {
                auth: {
                    token: token
                }
            })
            const load = async () => {
                await GetUserInfo()
                await initsocket()
                let connectToGame = { gameId: gameRule.gameId }
                sk.emitWithAck('getGame', JSON.stringify(connectToGame))
            }
            const initsocket = async () => {
                setSocket(sk)
                sk?.on('connect', () => {
                    setSocketMsg(sk?.connected.toString())
                })
                sk?.on('connect_error', (error: any) => {
                    console.log("no server");
                })
                sk?.on('disconnect', (msg: any) => {
                    // console.log(msg);
                })
                sk?.on('playerMove', (data: any) => {
                    setSocketMsg(data)
                    const turn: GameMove = JSON.parse(data)
                    setMove([...move, turn])
                    console.log("player move : \n");
                    console.log(turn.xCord);
                })
                sk?.on('gameStateChange', (data: any) => {
                    Alert.alert("Game finish", data, [
                        {
                            text: 'Ask me later',
                            onPress: () => console.log('Ask me later pressed'),
                        },
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                    ])
                })
                sk.on('playerConnect', (data: any) => {
                    setOtherUser(JSON.parse(data))
                    setJoinAlert(true)
                })
                return sk
            }
            const GetUserInfo = async () => {
                const userstring = await AsyncStorage.getItem('user')
                setUser(JSON.parse(userstring ? userstring : ''))
            }
            load()
            return () => {
                sk.disconnect()
            }
        }, [])
    )

    const PressTile = async (xCord: number, yCord: number) => {
        let body = {
            gameId: gameRule.gameId,
            userId: user._id,
            xCord,
            yCord,
        }
        try {
            let res = await socket?.emitWithAck("playerMove", JSON.stringify(body))
            console.log(res);
        } catch (e) {
            console.log(e);
        }

    }
    const RenderTile = (xCord: number, yCord: number) => {
        const key = xCord + yCord * gameRule.gameTileY
        const [checked, setCheck] = useState<Boolean>(false)
        const [playerMark, setPlayerMark] = useState(-1)
        const [canClick, setCanClick] = useState(true)
        useEffect(() => {
            let findTile: GameMove | undefined = move.find(t => (t.xCord == xCord && t.yCord == yCord))
            if (findTile) {
                setCheck(true)
                setPlayerMark(findTile.player == user._id ? 0 : 1)
                setCanClick(false)
            }
        }, [move])
        return (
            <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(220, 220, 220, 0.8)' : 'white' }, styles.tile]} key={key}
                onPress={e => canClick && allowClick ? PressTile(xCord, yCord) : null}>
                <ViewS style={styles.tileText}>
                    <TextS style={{ textAlign: 'center' }}>
                        {checked ? (playerMark == 0 ? 'X' : 'O') : ''}
                    </TextS>
                    <TextS style={styles.floatCord}>{xCord}:{yCord}</TextS>
                </ViewS>
            </Pressable>
        )
    }
    const RenderGameArea = () => {
        let area: React.JSX.Element[] = []
        for (let indexY = 0; indexY < gameRule.gameTileY; indexY++) {
            for (let indexX = 0; indexX < gameRule.gameTileX; indexX++) {
                area.push(RenderTile(indexX, indexY))
            }
        }
        return area
    }
    return (
        <ViewS className="h-full">
            <ViewS style={styles.gameContainer}>
                {RenderGameArea()}
            </ViewS>
            <ViewS className="flex flex-row absolute bottom-0">
                <ViewS className="absolute w-full flex justify-items-center align-middle mt-3 z-10">
                    <TextS className="text-center text-red-500">VS</TextS>
                </ViewS>
                <ViewS id="player1" className="text-center basis-1/2 border z-0">
                    <TextS className="text-center">{user?.displayName}</TextS>
                    <TextS className="text-center">(You)</TextS>
                    {/* <TextS className="text-center">Connectivity:<Text>Connected</Text></TextS> */}
                </ViewS>
                <ViewS id="player2" className="text-center basis-1/2 border z-0">
                    <TextS className="text-center">{otherUser?.displayName}</TextS>
                    {/* <TextS className="text-center">Connectivity:<Text>Connected</Text></TextS> */}
                </ViewS>
            </ViewS>
            <AwesomeAlert
                show={alertPlayerJoin}
                showProgress={false}
                title={otherUser?.displayName+" has join the room"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Got it!"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setJoinAlert(false)
                }}
            />
            <AwesomeAlert
                show={alertPlayerLeave}
                showProgress={false}
                title={otherUser?.displayName+" has leave the room"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText="Got it!"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setLeaveAlert(false)
                }}
            />
        </ViewS>
    )
}


const styles = StyleSheet.create({
    gameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    tile: {
        width: "33%",
        aspectRatio: 1,
        justifyContent: 'center',
        borderWidth: 1
    },
    tileText: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center'
    },
    floatCord: {
        position: "absolute",
        top: 0,
        left: 0
    }
})


export default Game