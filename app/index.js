import 'expo-router/entry';
import { useEffect } from 'react';
import { initializeDatabase } from '../services/db';
import { Redirect } from 'expo-router';

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return <Redirect href="/(tabs)" />
}
