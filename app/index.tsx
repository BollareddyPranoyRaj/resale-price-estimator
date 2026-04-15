import { router } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Smart resale guidance</Text>
          <Text style={styles.title}>Resale Price Estimator</Text>
          <Text style={styles.subtitle}>
            Search phone brands and models from the API, then request a backend-generated resale
            estimate.
          </Text>

          <Pressable style={styles.button} onPress={() => router.push('/estimate')}>
            <Text style={styles.buttonText}>Start Estimation</Text>
          </Pressable>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Catalog</Text>
            <Text style={styles.infoValue}>API only</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Flow</Text>
            <Text style={styles.infoValue}>Brand to model to estimate</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111f',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 32,
    gap: 20,
  },
  heroCard: {
    backgroundColor: '#0f1b2d',
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 16,
    shadowColor: '#020617',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  eyebrow: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#f8fafc',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#03120a',
    fontSize: 16,
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#111c30',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 6,
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
  },
});
