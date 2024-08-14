import { View, TextInput, StyleSheet, Text } from 'react-native';

export default function CardForm({ question, setQuestion, answer, setAnswer }) {
  return (
    <View style={styles.container}>
            <Text style={styles.label}>Kategorie:</Text>

      <TextInput
        style={styles.input}
        placeholder="Frage"
        value={question}
        onChangeText={setQuestion}
      />
            <Text style={styles.label}>Kategorie:</Text>
      <TextInput
        style={styles.input}
        placeholder="Antwort"
        value={answer}
        onChangeText={setAnswer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth:3,
    borderColor: 'grey',
    borderRadius:25,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});