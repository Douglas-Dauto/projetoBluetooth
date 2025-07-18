import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Chat from '../components/Chat';

function ChatScreen({ route }) {
    const { id } = route.params;

    return (
        <SafeAreaView>
            <Chat id={id} />
        </SafeAreaView>
    );
}

export default ChatScreen;