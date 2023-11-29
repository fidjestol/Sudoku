import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import GameScreen from './screens/GameScreen';
import Instructions from './screens/Instructions'
import DifficultyScreen from "./screens/DifficultyScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import sudokuBoards from './assets/boards/boards.json';

const Stack = createStackNavigator();

export default function App() {

    useEffect(() => {
        const initializeBoards = async () => {
            try {
                const storedBoards = await AsyncStorage.getItem('sudokuBoards');
                if (!storedBoards) {
                    await AsyncStorage.setItem('sudokuBoards', JSON.stringify(sudokuBoards));
                }
            } catch (error) {
                console.error("Failed to initialize boards:", error);
            }
        };

        initializeBoards();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Game" component={GameScreen} />
                <Stack.Screen name="Difficulty" component={DifficultyScreen} />
                <Stack.Screen name="HowToPlay" component={Instructions} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
