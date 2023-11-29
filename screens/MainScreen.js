import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSudoku } from 'sudoku-gen';
import '../translation';
import Language from "../components/Language";
import Difficulty from "../components/Difficulty";
import Toast from 'react-native-toast-message';


function MainScreen({ navigation }) {
    const { t, i18n } = useTranslation();
    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [difficultyModalVisible, setDifficultyModalVisible] = useState(false)

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng).then(() => setLanguageModalVisible(false));
    };

    const fetchNewBoard = async (selectedDifficulty) => {
        try {
            const { puzzle, solution, difficulty } = getSudoku(selectedDifficulty);

            const formattedBoard = puzzle.split('').map(val => (val === '-' ? 0 : parseInt(val)));
            const formattedSolution = solution.split('').map(val => parseInt(val));

            const board = [];
            const solutionBoard = [];
            while(formattedBoard.length) board.push(formattedBoard.splice(0, 9));
            while(formattedSolution.length) solutionBoard.push(formattedSolution.splice(0, 9));

            const storedBoardsJson = await AsyncStorage.getItem('sudokuBoards');
            let storedBoards = storedBoardsJson ? JSON.parse(storedBoardsJson) : {};

            const newBoard = {
                board: board,
                solution: solutionBoard
            };

            storedBoards[difficulty].push(newBoard);
            await AsyncStorage.setItem('sudokuBoards', JSON.stringify(storedBoards));
            Toast.show({
                type: 'success',
                text1: t('newboard'),
                position: 'bottom',
                bottomOffset: 50,
                visibilityTime: 2000
            })

        } catch (error) {
            console.error("Error adding new board: ", error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sudoku</Text>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => navigation.navigate('Difficulty')}
            >
                <Text style={styles.buttonText}>{t('start')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => setDifficultyModalVisible(true)}
            >
                <Text style={styles.buttonText}>{t('generate')}</Text>
            </TouchableOpacity>
            <Difficulty
                isVisible={difficultyModalVisible}
                onDifficultySelect={(difficulty) => {
                    fetchNewBoard(difficulty);
                    setDifficultyModalVisible(false);
                }}
                onClose={() => setDifficultyModalVisible(false)}
            />
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => navigation.navigate('HowToPlay')}
            >
                <Text style={styles.buttonText}>{t('howtoplay')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => setLanguageModalVisible(true)}
            >
                <Text style={styles.buttonText}>{t('settings')}</Text>
            </TouchableOpacity>

            <Language
                isVisible={languageModalVisible}
                onClose={() => setLanguageModalVisible(false)}
                onChangeLanguage={changeLanguage}
            />
            <Toast/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        fontSize: 40,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: 'none',
        borderRadius: 10,
        width: 250,
        height: 80,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 24,
    },
});

export default MainScreen;


