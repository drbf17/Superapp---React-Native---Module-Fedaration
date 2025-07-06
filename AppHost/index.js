/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('Registering AppHost components...', {appName});

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('AppHost', () => App);
AppRegistry.registerComponent('apphost', () => App);

console.log('AppHost registration complete');
