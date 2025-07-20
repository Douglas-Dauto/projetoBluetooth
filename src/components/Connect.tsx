import { Image, ScrollView, Animated, Easing, Pressable, StyleSheet, Text, View, NativeEventEmitter, NativeModules, Alert } from 'react-native';
import Load from '../assets/icons/arrow-clockwise.svg';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../App';
import ButtonMap from './ButtonMap';
import ModalMap from './ModalMap';
import ModalWarn from './ModalWarn';

interface Props {
    navigation: Object
}

function Connect(props: Props) {
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [controlLoad, setControlLoad] = useState<boolean>(false);
    const [devices, setDevices] = useState<Array<{ id: string, name: string, rssi: number }>>([]);
    const [controlModalMap, setControlModalMap] = useState(false);
    const [controlModalWarn, setControlModalWarn] = useState(false);

    const BleManager = useContext(AppContext)!;

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

    const animatedStyleScale = {
        transform: [{ scale: scaleAnim }],
    };

    function searchDevices() {
        Animated.sequence(
            [
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ]
        ).start();

        setControlLoad(true);

        setTimeout(async () => {
            BleManager.getDiscoveredPeripherals().then((devices) => {
                let newDevices: Array<{ id: string, name: string, rssi: number }> = devices.map((device) => { return { id: device.id!, name: device.name!, rssi: device.rssi } });
                newDevices = newDevices.filter((device) => device.name !== null);

                if (newDevices.length <= 0) {
                    setControlModalWarn(true);
                }

                setDevices(newDevices);
            });

            await BleManager.scan([], 5, true);

            setControlLoad(false);
        }, 2000);
    }

    async function connectDevice(id: string) {
        props.navigation.navigate('ChatScreen', { id });
    }

    return (
        <View style={styles.container}>
            <Animated.View style={animatedStyleScale}><Pressable style={styles.buttonConnect} onPress={searchDevices}><Text style={styles.textButtonConnect}>{'search\n devices'}</Text></Pressable></Animated.View>

            <Animated.View style={animatedStyle}>
                {controlLoad && <Load width={70} height={70} style={styles.load} />}
            </Animated.View>

            {!controlLoad && devices.length > 0 && <ButtonMap setControlModalMap={setControlModalMap} />}

            <ScrollView style={styles.scrollDevices}>
                {!controlLoad && devices.length > 0 && devices.map((device, index) => <View key={index} style={styles.containerDevice}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Pressable style={styles.connectDevice} onPress={() => connectDevice(device.id)}><Text style={styles.textConnectDevice}>Connect</Text></Pressable>
                </View>)}
            </ScrollView>

            {controlModalMap && <ModalMap devices={devices} setControlModalMap={setControlModalMap} />}
            {controlModalWarn && <ModalWarn warn={'devices not found'} setControlModalWarn={setControlModalWarn} />}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollDevices: {
        width: '100%',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'gray',
        alignItems: 'center',
        paddingTop: 100
    },
    buttonConnect: {
        width: 140,
        height: 140,
        backgroundColor: 'white',
        borderRadius: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30
    },
    textButtonConnect: {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    load: {
        width: 70,
        height: 70
    },
    containerDevice: {
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        width: '85%',
        borderRadius: 50,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 10,
        alignSelf: 'center'
    },
    deviceName: {
        fontWeight: 500,
        textTransform: 'uppercase',
        flex: 1
    },
    connectDevice: {
        backgroundColor: 'green',
        position: 'absolute',
        right: -15,
        top: -15,
        bottom: -16,
        paddingLeft: 10,
        paddingRight: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textConnectDevice: {
        fontWeight: 500,
        textTransform: 'uppercase',
        color: 'white'
    }
});

export default Connect;