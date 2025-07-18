/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { createContext, useEffect } from 'react';
import { StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import InitialRoute from './src/router/InitialRoute';
import BleManager from 'react-native-ble-manager';

export const AppContext = createContext(BleManager);

function App() {
    useEffect(() => {
        init();
        async function init() {
            BleManager.enableBluetooth().then(async () => {
                await requestPermissions();
                BleManager.start({ showAlert: false }).then(() => {
                    
                });
            });
        }
    }, []);

    async function requestPermissions() {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            ]);
        }
    }

  return (
      <AppContext.Provider value={BleManager}>
          <NavigationContainer>
              <InitialRoute />
          </NavigationContainer>
      </AppContext.Provider>
  );
}

export default App;
