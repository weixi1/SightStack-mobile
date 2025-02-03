import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Rules: React.FC = () => {
    const [isDescriptionVisible1, setDescriptionVisible1] = useState<boolean>(false);
    const [isDescriptionVisible2, setDescriptionVisible2] = useState<boolean>(false);
    const [isDescriptionVisible3, setDescriptionVisible3] = useState<boolean>(false);

    const toggleDescription1 = () => {
        setDescriptionVisible1(!isDescriptionVisible1);
    };
    const toggleDescription2 = () => {
        setDescriptionVisible2(!isDescriptionVisible2);
    };
    const toggleDescription3 = () => {
        setDescriptionVisible3(!isDescriptionVisible3);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Game Rules</Text>
            <View style={styles.listContainer}>
                <View style={styles.listItem}>
                    <Text style={styles.icon}>🐣</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Pick Your Grade 🎓</Text>
                        <TouchableOpacity onPress={toggleDescription1}>
                            <Text style={styles.description}>
                                {isDescriptionVisible1 ? 'Tap to hide description' : 'Tap to show description'}
                            </Text>
                        </TouchableOpacity>
                        {isDescriptionVisible1 && (
                            <Text style={styles.description}>Tap to choose your grade level and get ready to play!</Text>
                        )}
                    </View>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.icon}>🧩</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Fix the Word</Text>
                        <TouchableOpacity onPress={toggleDescription2}>
                            <Text style={styles.description}>
                                {isDescriptionVisible2 ? 'Tap to hide description' : 'Tap to show description'}
                            </Text>
                        </TouchableOpacity>
                        {isDescriptionVisible2 && (
                            <Text style={styles.description}>Drag and drop the scrambled letters to put them in the correct order and make a word. You can do it!</Text>
                        )}
                    </View>
                </View>
                <View style={styles.listItem}>
                    <Text style={styles.icon}>⭐</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Daily Game Mode</Text>
                        <TouchableOpacity onPress={toggleDescription3}>
                            <Text style={styles.description}>
                                {isDescriptionVisible3 ? 'Tap to hide description' : 'Tap to show description'}
                            </Text>
                        </TouchableOpacity>
                        {isDescriptionVisible3 && (
                            <Text style={styles.description}>Want a quick challenge? Try the Daily Game! You can even play across different grade levels—how many can you solve? 🎉</Text>
                        )}
                    </View>
                </View>
            </View>
            <Text style={styles.footer}>Show us how smart you are! ✨</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#003366',
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold', // 加粗
        color: '#fff',
        marginBottom: 30,
    },
    listContainer: {
        width: '100%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 20,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    icon: {
        fontSize: 32,
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold', // 加粗
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#444',
        marginTop: 5,
    },
    footer: {
        fontSize: 18,
        fontWeight: 'bold', // 加粗
        color: '#fff',
        marginTop: 30,
        textAlign: 'center',
    },
});

export default Rules;
