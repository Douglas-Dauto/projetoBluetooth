import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectScreen from '../screens/ConnectScreen';
import ChatScreen from '../screens/ChatScreen';

function InitialRoute() {
    const RootStack = createNativeStackNavigator();

    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={'ConnectScreen'}>
            <RootStack.Screen name="ConnectScreen" component={ConnectScreen} />
            <RootStack.Screen name="ChatScreen" component={ChatScreen} />
        </RootStack.Navigator>
    );
}

export default InitialRoute;