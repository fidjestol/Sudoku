import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Board from '../components/Board';
import NumberPad from '../components/NumberPad';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import '../translation';

function GameScreen({ route }) {
    const { t } = useTranslation();
    const { difficulty } = route.params;
    const [selectedCell, setSelectedCell] = useState(null);
    const [initialBoard, setInitialBoard] = useState([]);
    const [solutionBoard, setSolutionBoard] = useState([]);
    const [userBoard, setUserBoard] = useState();
    const [highlightedCells, setHighlightedCells] = useState(
        new Array(9).fill(null).map(() => new Array(9).fill(false))
    );
    const [errorBlock, setErrorBlock] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const storedBoardsString = await AsyncStorage.getItem('sudokuBoards');
                if (storedBoardsString) {
                    const storedBoards = JSON.parse(storedBoardsString);

                    const randomIndex = Math.floor(Math.random() * storedBoards[difficulty].length);
                    const selectedBoard = storedBoards[difficulty][randomIndex];

                    setInitialBoard(selectedBoard.board);
                    setSolutionBoard(selectedBoard.solution);
                    setUserBoard(selectedBoard.board);
                }
            } catch (error) {
                console.error("Failed to fetch the board:", error);
            }
        };

        fetchBoards();
    }, [difficulty]);

    const handleNumberInput = (num) => {
        if (isValidCell()) {
            const newUserBoard = JSON.parse(JSON.stringify(userBoard));
            newUserBoard[selectedCell.row][selectedCell.col] = num;
            setUserBoard(newUserBoard);
        }
    };

    const handleHighlight = () => {
        if (isValidCell()) {
            const newHighlightedCells = JSON.parse(JSON.stringify(highlightedCells));
            newHighlightedCells[selectedCell.row][selectedCell.col] = !newHighlightedCells[selectedCell.row][selectedCell.col];
            setHighlightedCells(newHighlightedCells);
        }
    };

    const handleDelete = () => {
        if (isValidCell()) {
            const newUserBoard = JSON.parse(JSON.stringify(userBoard));
            newUserBoard[selectedCell.row][selectedCell.col] = 0;
            setUserBoard(newUserBoard);
        }
    };

    const handleReset = () => {
        setUserBoard(initialBoard)
    }

    const flashErrorBlock = (block) => {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            setErrorBlock(flashCount % 2 === 0 ? block : null);
            flashCount++;
            if (flashCount > 5) {
                clearInterval(flashInterval);
                setErrorBlock(null);
            }
        }, 300);
    };

    const alertCorrectSolution = () => {
        alert(t('correct'));
    }

    const checkSolution = () => {
        let isSolutionCorrect = true;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++){
                if (userBoard[i][j] !== solutionBoard[i][j]) {
                    isSolutionCorrect = false;
                    const blockStartRow = Math.floor(i / 3) * 3;
                    const blockStartCol = Math.floor(j / 3) * 3;
                    flashErrorBlock({row: blockStartRow, col: blockStartCol});
                    return;
                }
            }
        }
        alertCorrectSolution();
    }


    const isValidCell = () => {
        return !!(selectedCell && initialBoard[selectedCell.row][selectedCell.col] === 0);

    }


    return (
        <View style={styles.container}>
            <Board
                board={userBoard}
                initialBoard={initialBoard}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                highlightedCells={highlightedCells}
                errorBlock={errorBlock}
            />
            <NumberPad
                onNumberInput={handleNumberInput}
                onHighlight={handleHighlight}
                onDelete={handleDelete}
                onReset={handleReset}
            />
            <View style={styles.button_container}>
                <TouchableOpacity onPress={handleReset} style={styles.button}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={checkSolution} style={styles.button}>
                    <Text style={styles.buttonText}>{t('check')}</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    button_container: {
        width: '98%',
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 20,
        marginBottom: 10
    },
    button: {
        justifyContent: 'center',
        alignContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 5,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 20,
    }
});

export default GameScreen;
