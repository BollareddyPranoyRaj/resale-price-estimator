import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { EstimateResult } from '@/lib/api';

export default function ResultScreen() {
  const params = useLocalSearchParams<{ result?: string }>();
  const parsedResult = safeParseResult(params.result);

  if (!parsedResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyState}>
          <Text style={styles.title}>No result found</Text>
          <Text style={styles.subtitle}>Please create a new estimate to view the result.</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/estimate')}>
            <Text style={styles.primaryButtonText}>Go to Estimate</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>{parsedResult.categoryLabel}</Text>
        <Text style={styles.title}>{parsedResult.modelLabel}</Text>
        <Text style={styles.subtitle}>
          {parsedResult.brandLabel} · {capitalize(parsedResult.condition)} condition
        </Text>

        <View style={styles.sourcePill}>
          <Text style={styles.sourcePillText}>Backend estimate</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Estimated resale price</Text>
          <Text style={styles.priceValue}>Rs. {parsedResult.estimatedPrice}</Text>
          <Text style={styles.rangeText}>
            Range: Rs. {parsedResult.minPrice} to Rs. {parsedResult.maxPrice}
          </Text>
          {parsedResult.launchPrice ? (
            <Text style={styles.supportingText}>Launch price reference: Rs. {parsedResult.launchPrice}</Text>
          ) : null}
          {parsedResult.storage ? (
            <Text style={styles.supportingText}>Storage profile used: {parsedResult.storage}</Text>
          ) : null}
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Original price</Text>
            <Text style={styles.metricValue}>Rs. {parsedResult.originalPrice}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Depreciation</Text>
            <Text style={styles.metricValue}>{parsedResult.depreciationPercent}%</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Resale score</Text>
            <Text style={styles.metricValue}>{parsedResult.resaleScore}/100</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Age</Text>
            <Text style={styles.metricValue}>{parsedResult.ageInMonths} mo</Text>
          </View>
        </View>

        <View style={styles.factorCard}>
          <Text style={styles.factorTitle}>Key pricing factors</Text>
          {parsedResult.keyFactors.map((factor) => (
            <Text key={factor} style={styles.factorItem}>
              • {factor}
            </Text>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={() => router.replace('/estimate')}>
          <Text style={styles.primaryButtonText}>Estimate Another Item</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/')}>
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

function safeParseResult(value?: string): EstimateResult | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as EstimateResult;
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111f',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    paddingBottom: 32,
    gap: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 18,
  },
  kicker: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#f8fafc',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  priceCard: {
    backgroundColor: '#0f1b2d',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  sourcePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#0c2434',
    borderWidth: 1,
    borderColor: '#164e63',
  },
  sourcePillText: {
    color: '#67e8f9',
    fontSize: 13,
    fontWeight: '700',
  },
  priceLabel: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '600',
  },
  priceValue: {
    color: '#86efac',
    fontSize: 38,
    fontWeight: '800',
  },
  rangeText: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  supportingText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#111c30',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  factorCard: {
    backgroundColor: '#101f16',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f5131',
    gap: 8,
  },
  factorTitle: {
    color: '#bbf7d0',
    fontSize: 16,
    fontWeight: '700',
  },
  factorItem: {
    color: '#dcfce7',
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: 6,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#03120a',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  secondaryButtonText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
  },
});
