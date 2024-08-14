import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity, TextInput } from 'react-native';

import { saveCard, getCards, deleteCard, updateSet, getCardById, updateCard, getSets } from '../../services/db';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

export default function CreateCard() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [cards, setCards] = useState([]);
  const [setName, setSetName] = useState('');
  const [setCategory, setSetCategory] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { setId } = route.params;
  const [editCardId, setEditCardId] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      const fetchedCards = await getCards(setId);
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error getting cards:", error);
    }
  }, [setId]);

  const fetchSetDetails = useCallback(async () => {
    try {
      getSets((sets) => {
        const set = sets.find(set => set.id === setId);
        if (set) {
          setSetName(set.name);
          setSetCategory(set.category);
        } else {
          console.error("Set not found with id:", setId);
        }
      });
    } catch (error) {
      console.error("Error fetching set details:", error);
    }
  }, [setId]);

  const handleRenameSet = async () => {
    try {
      await updateSet(setId, setName, setCategory);
      Alert.alert('Success', 'Set successfully renamed!');
    } catch (error) {
      console.error("Error renaming set:", error);
      Alert.alert('Error', 'An error occurred while renaming the set');
    }
  };

  const loadEditCard = async (cardId) => {
    try {
      const cards = await getCardById(cardId);
      if (cards.length > 0) {
        const card = cards[0];
        setQuestion(card.question);
        setAnswer(card.answer);
        setEditCardId(cardId);
      } else {
        console.error("No card found with id:", cardId);
      }
    } catch (error) {
      console.error("Error loading card to edit:", error);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchSetDetails();
  }, [fetchCards, fetchSetDetails]);

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [fetchCards])
  );

  const handleSave = async () => {
    if (question.trim() && answer.trim()) {
      try {
        if (editCardId) {
          await updateCard(editCardId, question, answer);
          setEditCardId(null);
        } else {
          const updatedCards = await saveCard(question, answer, setId);
          setCards(updatedCards);
        }
        setQuestion('');
        setAnswer('');
        Alert.alert('Success', editCardId ? 'Card updated!' : 'Card saved!');
        fetchCards();
      } catch (error) {
        console.error("Error saving or updating the card:", error);
        Alert.alert('Error', 'An error occurred while saving or updating the card.');
      }
    } else {
      Alert.alert('Error', 'Please enter a question and answer.');
    }
  };

  const handleDeleteCard = async (cardId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteCard(cardId);
              Alert.alert('Success', 'Card deleted!');
              fetchCards();
            } catch (error) {
              console.error("Error deleting the card:", error);
              Alert.alert('Error', 'An error occurred while deleting the card.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditCard = (cardId) => {
    loadEditCard(cardId);
  };

  const renderItem = ({ item }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardText}>Question: {item.question}</Text>
      <Text style={styles.cardText}>Answer: {item.answer}</Text>
      <View style={styles.cardButtons}>
        <TouchableOpacity style={[styles.cardButton, styles.editButton]} onPress={() => handleEditCard(item.id)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cardButton, styles.deleteButton]} onPress={() => handleDeleteCard(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Set</Text>
      <Text style={styles.label}>Set name:</Text>
      <TextInput
        style={styles.input}
        placeholder="New name of the set"
        value={setName}
        onChangeText={text => setSetName(text)}
      />

      <Text style={styles.label}>Set category:</Text>
      <TextInput
        style={styles.input}
        placeholder="New category of the set"
        value={setCategory}
        onChangeText={text => setSetCategory(text)}
      />

      <TouchableOpacity style={[styles.createcardButton]} onPress={handleRenameSet}>
        <Text style={styles.buttonText}>Rename set</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create card</Text>
      <TextInput
        style={styles.input}
        placeholder="Question"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder="Answer"
        value={answer}
        onChangeText={setAnswer}
      />

      <TouchableOpacity style={[styles.createButton]} onPress={handleSave}>
        <Text style={styles.buttonText}>{editCardId ? "Edit card" : "Save card"}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Cards in set</Text>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.cardList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  cardList: {
    width: '100%',
  },
  cardItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
  },
  cardButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  cardButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth:3,
    borderColor: 'grey',
    borderRadius:25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
  },
  createcardButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7399c7',
    marginBottom: 20,
    marginTop: -5,
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7399c7',
    marginBottom: 5,
    marginTop: -5,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
