import React from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { getColor } from '../utils/getColor';

const data: number[][] = Array.from({ length: 6 }, () =>
    Array.from({ length: 10 }, () => Math.random())
);

interface Props {
    controlMap: boolean
    deviceSignal: number
}

const HeatMap = (props: Props) => {
    const cellSize = 100;
    const rows = 3;
    const cols = 3;
    const svgWidth = cols * cellSize;
    const svgHeight = rows * cellSize;
    
    return (
        <View style={styles.container}>
            <Svg width={svgWidth} height={svgHeight}>
                {data.map((row, i) =>
                    row.map((value, j) => {
                        const control = Math.floor(Math.random() * 2) + 1;
                        let color = '';

                        if (props.controlMap) {
                            if (control <= 1) {
                                color = getColor((props.deviceSignal) + Math.floor(Math.random() * 20) + 1)
                            } else {
                                color = getColor((props.deviceSignal) - Math.floor(Math.random() * 20) + 1)
                            }
                        } else {
                            color = getColor((-100))
                        }

                        const lastDecision = props.controlMap && i === 1 && j === 1 ? getColor(props.deviceSignal) : color;

                        return (
                            <Rect
                                key={`${i}-${j}`}
                                x={j * cellSize}
                                y={i * cellSize}
                                width={cellSize}
                                height={cellSize}
                                fill={lastDecision}
                                stroke="white"
                                strokeWidth={1}
                            />
                        )
                    })
                )}
            </Svg>

            <Text style={styles.text}>signal strength</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 100
    },
    text: {
        textTransform: 'uppercase',
        width: 'auto',
        fontWeight: 500,
        marginTop: 10
    }
});

export default HeatMap;