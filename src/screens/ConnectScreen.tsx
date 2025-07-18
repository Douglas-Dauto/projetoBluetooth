import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Connect from '../components/Connect';

function ConnectScreen({ navigation }) {

    return (
        <SafeAreaView>
            <Connect navigation={navigation} />
        </SafeAreaView>
    );
}

export default ConnectScreen;