import { Image, SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import ArrowDown from '../assets/icons/caret-down-fill.svg';
import Close from '../assets/icons/x-lg.svg';
import { useEffect, useState } from 'react';
import HeatMap from './HeatMap';

interface Props {
    devices: Array<{ id: string, name: string, rssi: number }>
    setControlModalMap: Function
}

function ModalMap(props: Props) {
    const [devices, setDevices] = useState(props.devices);
    const [controlSelectDeviceButton, setControlSelectDeviceButton] = useState(false);
    const [controlMap, setControlMap] = useState<boolean>(false);
    const [deviceSignal, setDeviceSignal] = useState<number>(0);

    function selectDevice(signal: number) {
        setControlMap(true);
        setDeviceSignal(signal);
        setControlSelectDeviceButton(!controlSelectDeviceButton);
    }

    function showDevices() {
        setControlMap(false);
        setControlSelectDeviceButton(!controlSelectDeviceButton);
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.containerSelectDevice}>
                    <Pressable style={styles.selectDevice} onPress={() => showDevices()}><Text style={styles.textSelectDevice}>Select device</Text><ArrowDown width={15} height={15} style={styles.arrowDown} /></Pressable>

                    {controlSelectDeviceButton && <View>
                        {devices.map((device, index) => <Pressable onPress={() => selectDevice(device.rssi)}><Text key={index} style={styles.textOptionsDevices}>{device.name}</Text></Pressable>)}
                    </View>}
                </View>

                <Pressable style={styles.containerExit} onPress={() => {
                    setControlMap(false);
                    props.setControlModalMap(false);
                }}>
                    <Close width={18} height={18} />
                </Pressable>

                <HeatMap controlMap={controlMap} deviceSignal={deviceSignal} />
            </View>

            <View style={styles.containerBg}></View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '70%',
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 20,
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-40%' }],
        zIndex: 2
    },
    containerSelectDevice: {
        width: '80%',
        padding: 20,
        position: 'absolute',
        zIndex: 3
    },
    selectDevice: {
        backgroundColor: 'gray',
        width: 135,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 4,
        marginBottom: 8
    },
    textSelectDevice: {
        textAlign: 'center',
        color: 'white',
        textTransform: 'uppercase',
        fontSize: 11,
        fontWeight: 500
    },
    arrowDown: {
        marginTop: .5
    },
    textOptionsDevices: {
        backgroundColor: 'gray',
        color: 'white',
        borderRadius: 20,
        padding: 15,
        marginBottom: 8
    },
    containerExit: {
        backgroundColor: 'gray',
        width: 49,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        position: 'absolute',
        top: 20,
        right: 20
    },
    containerBg: {
        width: '100%',
        height: '100%',
        backgroundColor: 'gray',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1
    }
});

export default ModalMap;