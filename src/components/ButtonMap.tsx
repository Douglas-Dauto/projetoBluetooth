import { Image, SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';

interface Props {
    setControlModalMap: Function
}

function ButtonMap(props: Props) {

    return (
        <Pressable style={styles.container} onPress={() => props.setControlModalMap(true)}>
            <Text style={styles.text}>{'heat map'}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    text: {
        fontWeight: 500,
        textTransform: 'uppercase',
        textAlign: 'center'
    }
});

export default ButtonMap;