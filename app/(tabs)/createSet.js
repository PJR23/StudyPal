import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { createSet, getSets, deleteSet, toggleStarredSet, getStarredSets } from '../../services/db';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function CreateSet() {
  const navigation = useNavigation();
  const [setName, setSetName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [sets, setSets] = useState([]);
  const [starredSets, setStarredSets] = useState({});
  const [reloadSets, setReloadSets] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchSets();
      fetchStarredSets();
    }
  }, [isFocused, reloadSets]);

  const fetchSets = async () => {
    try {
      await getSets((fetchedSets) => {
        fetchedSets.sort((a, b) => {
          if (starredSets[b.id] && !starredSets[a.id]) return 1;
          if (starredSets[a.id] && !starredSets[b.id]) return -1;
          return 0;
        });
        setSets(fetchedSets);
      });
    } catch (error) {
      console.error('Error fetching sets:', error);
    }
  };

  const fetchStarredSets = async () => {
    try {
      const starredSetsData = await getStarredSets();
      setStarredSets(starredSetsData);
    } catch (error) {
      console.error('Error fetching starred sets:', error);
    }
  };

  const handleCreateSet = async () => {
    try {
      if (!setName.trim()) {
        setError('Please enter a name for the set.');
        return;
      }

      await createSet(setName, category, (updatedSets, setId) => {
        console.log(`Set with ID ${setId} was successfully created.`);
        setReloadSets(!reloadSets);
        setSetName('');
        setCategory('');
      });
    } catch (error) {
      console.error('Error creating set:', error);
      if (error.message.includes('UNIQUE constraint failed: sets.name')) {
        setError('A set with this name already exists.');
      } else {
        setError('Error creating set.');
      }
    }
  };

  const handleDeleteSet = async (setId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this set?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteSet(setId, (updatedSets) => {
                console.log(`Set with ID ${setId} was successfully deleted.`);
                setReloadSets(!reloadSets);
              });
            } catch (error) {
              console.error('Error deleting set:', error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditSet = (setId) => {
    navigation.navigate('createCard', { setId });
  };

  const handleStarPress = async (setId) => {
    try {
      const newStarredState = !starredSets[setId];
      await toggleStarredSet(setId, newStarredState);
      setStarredSets((prevStarredSets) => ({
        ...prevStarredSets,
        [setId]: newStarredState,
      }));
      setReloadSets(!reloadSets);
    } catch (error) {
      console.error('Error toggling starred set:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.setItem}>
      <View style={styles.setItemContent}>
        <View>
          <Text style={styles.setName}>Name: {item.name}</Text>
          <Text style={styles.setCategory}>Category: {item.category}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEditSet(item.id)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteSet(item.id)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleStarPress(item.id)}>
            <Icon
              name="star"
              size={24}
              color={starredSets[item.id] ? '#ffcc00' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a set</Text>
      <Text style={styles.label}>Set Name:</Text>
      <TextInput
        style={styles.input}
        value={setName}
        onChangeText={(text) => setSetName(text)}
        placeholder="Enter name"
      />
      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={(text) => setCategory(text)}
        placeholder="Enter category"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={[styles.createButton]} onPress={handleCreateSet}>
        <Text style={styles.buttonText}>Create Set</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Existing Sets</Text>
      <FlatList
        data={sets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.setList}
        extraData={reloadSets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 3,
    borderColor: 'grey',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  setList: {
    width: '100%',
  },
  setItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  setItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  setCategory: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
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
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7399c7',
    marginTop: 20,
  },
});
