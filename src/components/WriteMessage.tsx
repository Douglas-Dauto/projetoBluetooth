import { useContext, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, Pressable, Alert, NativeEventEmitter, NativeModules, } from 'react-native';
import Play from '../assets/icons/play-fill.svg';
import { AppContext } from '../../App';

interface Props {
    messages: Array<{ message: string, isMe: boolean }>;
    setMessages: Function;
    moveScroll: Function;
    idDevice: string;
}

function WriteMessage(props: Props) {
    const [text, setText] = useState('');
    const BleManager = useContext(AppContext)!;

    useEffect(() => {
        const notificationListener = new NativeEventEmitter(NativeModules.BleManager).addListener(
            'BleManagerDidUpdateValueForCharacteristic',
            async ({ value, peripheral, characteristic, service }) => {
                if (value && Array.isArray(value)) {
                    const message = Buffer.from(value).toString('utf-8');
                    props.setMessages([...props.messages, { message: message, isMe: false }]);
                }
            }
        );

        return () => notificationListener.remove();
    }, []);

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

        await BleManager.disconnect(props.idDevice);
        await BleManager.connect(props.idDevice);

        const data = Array.from(new TextEncoder().encode(textParam));

        const peripheralInfo = await BleManager.retrieveServices(props.idDevice);

        const writeableChar = peripheralInfo.characteristics!.find(
            (char) => char.properties.Write || char.properties.WriteWithoutResponse
        );

        BleManager.write(
            props.idDevice,
            writeableChar!.service,
            writeableChar!.characteristic,
            data
        );

        await BleManager.disconnect(props.idDevice);

        props.setMessages([...props.messages, { message: textParam, isMe: true }]);
        setText('');
    }
 
    return (
        <View style={styles.textField}>
            <TextInput placeholder="Type something here" style={styles.input} onChangeText={(textValue) => setText(textValue)} value={text} onPress={() => props.moveScroll()} />
            <Pressable style={styles.buttonSend} onPress={() => sendMessage(text)}><Play width={40} height={40} style={styles.image} /></Pressable>
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
        justifyContent: 'center'
    }
});

export default WriteMessage;