import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import WriteMessage from './WriteMessage';
import ModalWarn from './ModalWarn';

interface Props {
    id: string;
}

function Chat(props: Props) {
    const [messages, setMessages] = useState<Array<{ message: string, isMe: boolean }>>([]);
    const scrollViewRef = useRef<ScrollView>(null);
    const [controlModalWarn, setControlModalWarn] = useState(false);

    useEffect(() => {
        moveScroll();
    }, [messages]);

    function moveScroll() {
        scrollViewRef.current?.scrollTo({
            y: 500,
            animated: true,
        });
    }

    return (
        <>
            <ScrollView style={styles.scroll} ref={scrollViewRef}>
                <View style={styles.container}>
                    {messages.map((obj, index) => <View style={[styles.messageContainer, obj.isMe && styles.alternativeMessageContainer]} key={index}>
                        <Image source={require('../assets/user.png')} width={20} height={20} style={styles.profile} />
                        <Text style={styles.message}>{obj.message}</ Text>
                    </ View>)}
                </View>
            </ScrollView>
            <WriteMessage setControlModalWarn={setControlModalWarn} messages={messages} setMessages={setMessages} moveScroll={moveScroll} idDevice={props.id} />
            {controlModalWarn && <ModalWarn warn={'error sending message'} setControlModalWarn={setControlModalWarn} />}
        </>
    );
}

const styles = StyleSheet.create({
    scroll: {
        height: '87%',
        backgroundColor: 'gray',
    },
    container: {
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 20,
        gap: 15
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
        borderRadius: 50,
        paddingRight: 15,
        paddingLeft: 0,
    },
    alternativeMessageContainer: {
        flexDirection: 'row-reverse',
        paddingRight: 0,
        paddingLeft: 15,
        alignSelf: 'flex-end'
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    message: {
        fontWeight: 500,
        width: 'auto',
        maxWidth: '80%'
    }
});

export default Chat;