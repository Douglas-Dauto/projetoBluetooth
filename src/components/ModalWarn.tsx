import { Image, SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import ArrowDown from '../assets/icons/caret-down-fill.svg';
import Close from '../assets/icons/x-lg.svg';
import { useEffect, useState } from 'react';
import HeatMap from './HeatMap';

interface Props {
    setControlModalWarn: Function
    warn: string
}

function ModalWarn(props: Props) {

    return (
        <>
            <View style={styles.container}>
                <Pressable style={styles.containerExit} onPress={() => {
                    props.setControlModalWarn(false);
                }}>
                    <Close width={18} height={18} />
                </Pressable>

                <Text style={styles.textWarn}>{props.warn}</Text>
            </View>

            <View style={styles.containerBg}></View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '30%',
        backgroundColor: 'white',
        position: 'absolute',
        borderRadius: 20,
        top: '50%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-40%' }],
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
    },
    textWarn: {
        fontWeight: 500,
        textTransform: 'uppercase',
        fontSize: 20
    }
});

export default ModalWarn;