import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  getCategoryDefinition,
  phaseOneCatalog,
  type CategorySlug,
} from '@/lib/catalog';
import {
  estimateResalePrice,
  getValidationMessage,
  type BatteryCondition,
  type RepairHistory,
  type ScreenCondition,
  type UsageIntensity,
} from '@/lib/estimator';

type PhysicalCondition = 'excellent' | 'good' | 'fair' | 'poor';

const physicalOptions: PhysicalCondition[] = ['excellent', 'good', 'fair', 'poor'];
const screenOptions: ScreenCondition[] = ['no scratches', 'minor', 'cracked'];
const batteryOptions: BatteryCondition[] = ['good', 'average', 'poor'];
const usageOptions: UsageIntensity[] = ['light', 'moderate', 'heavy'];
const yesNoOptions = ['yes', 'no'] as const;
const repairOptions: RepairHistory[] = ['no', 'minor', 'major'];

export default function EstimateScreen() {
  const [category, setCategory] = useState<CategorySlug>('phones');
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [modelQuery, setModelQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState('');
  const [conditionData, setConditionData] = useState({
    physical: 'good' as PhysicalCondition,
    screen: 'no scratches' as ScreenCondition,
    battery: 'good' as BatteryCondition,
    age: '',
    usage: 'moderate' as UsageIntensity,
    accessories: 'no' as 'yes' | 'no',
    repairs: 'no' as RepairHistory,
    warranty: 'no' as 'yes' | 'no',
  });
  const [touched, setTouched] = useState(false);

  const categoryDefinition = useMemo(() => getCategoryDefinition(category), [category]);
  const matchedBrand = useMemo(
    () =>
      categoryDefinition?.brands.find(
        (entry) => entry.name.toLowerCase() === (selectedBrand ?? '').trim().toLowerCase()
      ) ?? null,
    [categoryDefinition, selectedBrand]
  );
  const matchedModel = useMemo(
    () =>
      matchedBrand?.models.find(
        (entry) => entry.name.toLowerCase() === (selectedModel ?? '').trim().toLowerCase()
      ) ?? null,
    [matchedBrand, selectedModel]
  );

  const filteredBrands = useMemo(() => {
    const brands = categoryDefinition?.brands ?? [];
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return brands.filter((brand) => brand.name.toLowerCase().includes(normalizedQuery));
  }, [categoryDefinition, query]);

  const filteredModels = useMemo(() => {
    const models = matchedBrand?.models ?? [];
    const normalizedQuery = modelQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return models.filter((model) => model.name.toLowerCase().includes(normalizedQuery));
  }, [matchedBrand, modelQuery]);

  const estimateInput = {
    category,
    brandName: selectedBrand ?? query.trim(),
    modelName: selectedModel ?? modelQuery.trim(),
    originalPrice: Number(originalPrice),
    ageInMonths: Number(conditionData.age),
    condition: conditionData.physical,
    conditionData: {
      physical: conditionData.physical,
      screen: conditionData.screen,
      battery: conditionData.battery,
      age: Number(conditionData.age),
      usage: conditionData.usage,
      accessories: conditionData.accessories,
      repairs: conditionData.repairs,
      warranty: conditionData.warranty,
    },
  };

  const validationMessage = touched ? getValidationMessage(estimateInput) : '';

  const handleCategoryChange = (nextCategory: CategorySlug) => {
    setCategory(nextCategory);
    setQuery('');
    setSelectedBrand(null);
    setModelQuery('');
    setSelectedModel(null);
    setOriginalPrice('');
  };

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
    setQuery('');
    setModelQuery('');
    setSelectedModel(null);
    setOriginalPrice('');
  };

  const handleModelSelect = (modelName: string) => {
    const nextModel =
      matchedBrand?.models.find(
        (entry) => entry.name.toLowerCase() === modelName.trim().toLowerCase()
      ) ?? null;

    setSelectedModel(modelName);
    setModelQuery('');

    if (nextModel) {
      setOriginalPrice(String(nextModel.launchPrice));
    }
  };

  const handleEstimate = () => {
    setTouched(true);

    const nextValidationMessage = getValidationMessage(estimateInput);
    if (nextValidationMessage) {
      return;
    }

    const result = estimateResalePrice(estimateInput);

    router.push({
      pathname: '/result',
      params: {
        result: JSON.stringify(result),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Select your product</Text>
            <Text style={styles.subtitle}>
              Search if we know the brand and model, or type your own and continue anyway.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1. Select Category</Text>
            <View style={styles.wrapRow}>
              {phaseOneCatalog.map((entry) => {
                const active = entry.slug === category;

                return (
                  <Pressable
                    key={entry.slug}
                    style={[styles.pill, active && styles.pillActive]}
                    onPress={() => handleCategoryChange(entry.slug)}>
                    <Text style={[styles.pillText, active && styles.pillTextActive]}>
                      {entry.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.helperText}>{categoryDefinition?.description}</Text>

            <Text style={styles.sectionTitle}>2. Search Brand</Text>
            <TextInput
              value={selectedBrand ? '' : query}
              onChangeText={setQuery}
              placeholder="Search Brand"
              placeholderTextColor="#64748b"
              style={styles.input}
            />

            {selectedBrand ? (
              <View style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{selectedBrand}</Text>
              </View>
            ) : null}

            {!selectedBrand ? (
              <>
                <FlatList
                  data={filteredBrands}
                  keyExtractor={(item) => item.slug}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => handleBrandSelect(item.name)}>
                      <Text style={styles.listTitle}>{item.name}</Text>
                      <Text style={styles.listSubtitle}>{item.models.length} models</Text>
                    </TouchableOpacity>
                  )}
                />

                {query.trim().length > 0 ? (
                  <TouchableOpacity
                    style={styles.manualAction}
                    onPress={() => handleBrandSelect(query.trim())}>
                    <Text style={styles.manualActionText}>Use &quot;{query.trim()}&quot; as brand</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : null}

            <Text style={styles.sectionTitle}>3. Search Model</Text>
            {matchedBrand ? (
              <>
                <TextInput
                  value={selectedModel ? '' : modelQuery}
                  onChangeText={setModelQuery}
                  placeholder="Search Model"
                  placeholderTextColor="#64748b"
                  style={styles.input}
                />

                {selectedModel ? (
                  <View style={styles.selectedChip}>
                    <Text style={styles.selectedChipText}>{selectedModel}</Text>
                  </View>
                ) : null}

                {!selectedModel ? (
                  <>
                    <FlatList
                      data={filteredModels}
                      keyExtractor={(item) => item.slug}
                      scrollEnabled={false}
                      contentContainerStyle={styles.listContent}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.listItem}
                          onPress={() => handleModelSelect(item.name)}>
                          <Text style={styles.listTitle}>{item.name}</Text>
                          <Text style={styles.listSubtitle}>
                            Rs. {item.launchPrice} · {capitalize(item.segment)}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />

                    {modelQuery.trim().length > 0 ? (
                      <TouchableOpacity
                        style={styles.manualAction}
                        onPress={() => handleModelSelect(modelQuery.trim())}>
                        <Text style={styles.manualActionText}>Use &quot;{modelQuery.trim()}&quot; as model</Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : (
              <TextInput
                value={selectedModel ?? modelQuery}
                onChangeText={(value) => {
                  setModelQuery(value);
                  setSelectedModel(value);
                }}
                placeholder="Search Model"
                placeholderTextColor="#64748b"
                style={styles.input}
              />
            )}

            {matchedModel ? (
              <View style={styles.modelCard}>
                <Text style={styles.modelTitle}>{matchedModel.name}</Text>
                <Text style={styles.modelMeta}>
                  Launch price: Rs. {matchedModel.launchPrice} · Released {matchedModel.releaseYear}
                </Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>4. Add Details</Text>

            <Text style={styles.label}>Original price</Text>
            <TextInput
              value={originalPrice}
              onChangeText={setOriginalPrice}
              placeholder="50000"
              placeholderTextColor="#64748b"
              style={styles.input}
              keyboardType="numeric"
            />

            <Text style={styles.sectionTitle}>5. Condition Assessment</Text>

            <Text style={styles.label}>Physical condition</Text>
            <View style={styles.wrapRow}>
              {physicalOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.physical === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, physical: entry }))}>
                  <Text style={[styles.pillText, conditionData.physical === entry && styles.pillTextLight]}>
                    {capitalize(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Screen condition</Text>
            <View style={styles.wrapRow}>
              {screenOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.screen === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, screen: entry }))}>
                  <Text style={[styles.pillText, conditionData.screen === entry && styles.pillTextLight]}>
                    {capitalizeWords(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Battery condition</Text>
            <View style={styles.wrapRow}>
              {batteryOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.battery === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, battery: entry }))}>
                  <Text style={[styles.pillText, conditionData.battery === entry && styles.pillTextLight]}>
                    {capitalize(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Age of device (months)</Text>
            <TextInput
              value={conditionData.age}
              onChangeText={(value) => setConditionData((current) => ({ ...current, age: value }))}
              placeholder="12"
              placeholderTextColor="#64748b"
              style={styles.input}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Usage intensity</Text>
            <View style={styles.wrapRow}>
              {usageOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.usage === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, usage: entry }))}>
                  <Text style={[styles.pillText, conditionData.usage === entry && styles.pillTextLight]}>
                    {capitalize(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Original accessories available?</Text>
            <View style={styles.wrapRow}>
              {yesNoOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.accessories === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, accessories: entry }))}>
                  <Text style={[styles.pillText, conditionData.accessories === entry && styles.pillTextLight]}>
                    {capitalize(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Any repairs done?</Text>
            <View style={styles.wrapRow}>
              {repairOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.repairs === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, repairs: entry }))}>
                  <Text style={[styles.pillText, conditionData.repairs === entry && styles.pillTextLight]}>
                    {capitalize(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Warranty available?</Text>
            <View style={styles.wrapRow}>
              {yesNoOptions.map((entry) => (
                <Pressable
                  key={entry}
                  style={[styles.pill, conditionData.warranty === entry && styles.conditionPillActive]}
                  onPress={() => setConditionData((current) => ({ ...current, warranty: entry }))}>
                  <Text style={[styles.pillText, conditionData.warranty === entry && styles.pillTextLight]}>
                    {capitalize(entry)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {validationMessage ? <Text style={styles.errorText}>{validationMessage}</Text> : null}

            <Pressable style={styles.button} onPress={handleEstimate}>
              <Text style={styles.buttonText}>6. View Result</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function capitalize(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

function capitalizeWords(value: string) {
  return value
    .split(' ')
    .map((part) => capitalize(part))
    .join(' ');
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111f',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 18,
  },
  header: {
    gap: 10,
    paddingTop: 8,
  },
  title: {
    color: '#f8fafc',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#0f1b2d',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 14,
  },
  sectionTitle: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  helperText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 22,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  listContent: {
    gap: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#162338',
    borderWidth: 1,
    borderColor: '#22304a',
  },
  pillActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  conditionPillActive: {
    backgroundColor: '#10261a',
    borderColor: '#22c55e',
  },
  pillText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#0f172a',
  },
  pillTextLight: {
    color: '#dcfce7',
  },
  input: {
    backgroundColor: '#162338',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#22304a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f8fafc',
    fontSize: 16,
  },
  selectedChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#10261a',
    borderColor: '#22c55e',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  selectedChipText: {
    color: '#bbf7d0',
    fontSize: 13,
    fontWeight: '700',
  },
  listItem: {
    backgroundColor: '#111c30',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#22304a',
    gap: 4,
  },
  listTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  listSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
  },
  manualAction: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#172554',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  manualActionText: {
    color: '#bfdbfe',
    fontSize: 13,
    fontWeight: '700',
  },
  modelCard: {
    backgroundColor: '#111c30',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#22304a',
    gap: 6,
  },
  modelTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  modelMeta: {
    color: '#94a3b8',
    fontSize: 14,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
    fontWeight: '600',
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
});
