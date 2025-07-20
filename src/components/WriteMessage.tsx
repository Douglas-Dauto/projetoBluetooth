import { useContext, useEffect, useRef, useState } from 'react';
import { Easing, Keyboard, Image, StyleSheet, Text, TextInput, View, Pressable, Alert, NativeEventEmitter, NativeModules, Animated, } from 'react-native';
import Play from '../assets/icons/play-fill.svg';
import Load from '../assets/icons/arrow-clockwise.svg';
import { AppContext } from '../../App';
import { Buffer } from 'buffer';

interface Props {
    messages: Array<{ message: string, isMe: boolean }>;
    setMessages: Function;
    moveScroll: Function;
    idDevice: string;
    setControlModalWarn: Function;
}

function WriteMessage(props: Props) {
    const [text, setText] = useState('');
    const [controlLoad, setControlLoad] = useState<boolean>(false);
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const BleManager = useContext(AppContext)!;

    useEffect(() => {
        const removeListener = BleManager.onDidUpdateValueForCharacteristic(
            ({ value }) => {
                if (value && Array.isArray(value)) {
                    const message = Buffer.from(value).toString('utf-8');
                    const messages = props.messages;
                    messages.push({ message: message, isMe: false });
                    props.setMessages([...messages]);
                }
            }
        );

        return () => removeListener.remove();
    }, [props.messages]);

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [rotateAnim]);

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    const animatedStyle = {
        transform: [{ rotate: rotateInterpolate }],
    };

    //await BleManager.connect(props.idDevice);
    //const peripheralInfo = await BleManager.retrieveServices(props.idDevice);

    //const notifyChar = peripheralInfo.characteristics!.find(
    //    (char) => char.properties.Notify === 'Notify'
    //);

    //await BleManager.startNotification(
    //    props.idDevice,
    //    notifyChar.service,
    //    notifyChar.characteristic
    //);

    //await BleManager.disconnect(props.idDevice);

    async function sendMessage(textParam: string) {
        if (textParam.length === 0) {
            return;
        }

        try {
            setControlLoad(true);

            await BleManager.connect(props.idDevice);

            const data = Array.from(new TextEncoder().encode(textParam));

            const peripheralInfo = await BleManager.retrieveServices(props.idDevice);

            const writeableChar = peripheralInfo.characteristics!.find(
                (char) => char.properties.Write || char.properties.WriteWithoutResponse
            );

            const writeableCharNotify = peripheralInfo.characteristics!.find(
                (char) => char.properties.Notify
            );

            BleManager.startNotification(props.idDevice, writeableCharNotify!.service, writeableCharNotify!.characteristic);

            BleManager.write(
                props.idDevice,
                writeableChar!.service,
                writeableChar!.characteristic,
                data
            );

            const messages = props.messages;
            messages.push({ message: textParam, isMe: true });
            props.setMessages([...messages]);
        } catch (e) {
            Keyboard.dismiss();
            props.setControlModalWarn(true);
        }

        //await BleManager.disconnect(props.idDevice);

        setText('');
        setControlLoad(false);
    }
 
    return (
        <View style={styles.textField}>
            <TextInput placeholder="Type something here" style={styles.input} onChangeText={(textValue) => setText(textValue)} value={text} onPress={() => props.moveScroll()} />
            <Pressable style={styles.buttonSend} onPress={() => sendMessage(text)}>{!controlLoad && <Play width={40} height={40} style={styles.image} />}
                <Animated.View style={[animatedStyle, styles.viewLoad]}>
                    {controlLoad && <Load width={50} height={50} style={styles.load} />}
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    textField: {
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
    },
    input: {
        width: '85%'
    },
    image: {
        width: 40,
        height: 40,
        marginLeft: 4
    },
    buttonSend: {
        width: 45,
        height: 45,
        backgroundColor: 'gray',
        borderRadius: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    viewLoad: {
        position: 'absolute',
    },
    load: {
        width: 50,
        height: 50
    }
});

export default WriteMessage;