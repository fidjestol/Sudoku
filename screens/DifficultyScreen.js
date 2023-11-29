import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import '../translation';

function DifficultyScreen({ navigation }) {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => navigation.navigate('Game', { difficulty: 'easy' })}
            >
                <Text style={styles.buttonText}>{t('easy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => navigation.navigate('Game', { difficulty: 'medium' })}
            >
                <Text style={styles.buttonText}>{t('medium')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => navigation.navigate('Game', { difficulty: 'hard' })}
            >
                <Text style={styles.buttonText}>{t('hard')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 10,
        paddingVertical: 60,
        paddingHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 300,
    },
    buttonText: {
        fontSize: 26,
        color: '#000',
    },
});

export default DifficultyScreen;
