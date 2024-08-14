import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getSets, toggleStarredSet, getStarredSets } from '../../services/db';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Home() {
  const [sets, setSets] = useState([]);
  const [starredSets, setStarredSets] = useState({});
  const [reloadSets, setReloadSets] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      fetchStarredSets();
      fetchSets();
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

  const handleSetPress = (setId) => {
    navigation.navigate('learnMode', { setId });
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

  const renderSetItem = ({ item }) => (
    <TouchableOpacity
      style={styles.setItem}
      onPress={() => handleSetPress(item.id)}
    >
      <View style={styles.setItemContent}>
        <View>
          <Text style={styles.setName}>Name: {item.name}</Text>
          <Text style={styles.setCategory}>Category: {item.category}</Text>
        </View>
        <TouchableOpacity onPress={() => handleStarPress(item.id)}>
          <Icon
            name="star"
            size={24}
            color={starredSets[item.id] ? '#ffcc00' : 'gray'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StudyPal!</Text>
      <Text style={styles.subTitle}>Choose a set:</Text>
      <FlatList
        data={sets}
        renderItem={renderSetItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.setList}
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
  subTitle: {
    fontSize: 24,
    marginBottom: 20,
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
});
