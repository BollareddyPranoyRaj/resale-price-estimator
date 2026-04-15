import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
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
  getPhoneBrands,
  getPhoneModels,
  postEstimate,
  type EstimateRequest,
  type PhoneBrand,
  type PhoneModel,
} from '@/lib/api';
import {
  batteryOptions,
  getValidationMessage,
  physicalOptions,
  repairOptions,
  screenOptions,
  usageOptions,
  yesNoOptions,
} from '@/lib/estimate-validation';

export default function EstimateScreen() {
  const [brandQuery, setBrandQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');
  const [phoneBrands, setPhoneBrands] = useState<PhoneBrand[]>([]);
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<PhoneBrand | null>(null);
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<PhoneModel | null>(null);
  const [originalPrice, setOriginalPrice] = useState('');
  const [apiError, setApiError] = useState('');
  const [brandLoadError, setBrandLoadError] = useState('');
  const [modelLoadError, setModelLoadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [conditionData, setConditionData] = useState({
    physical: null as EstimateRequest['condition'],
    screen: null as EstimateRequest['conditionData']['screen'],
    battery: null as EstimateRequest['conditionData']['battery'],
    age: '',
    usage: null as EstimateRequest['conditionData']['usage'],
    accessories: null as EstimateRequest['conditionData']['accessories'],
    repairs: null as EstimateRequest['conditionData']['repairs'],
    warranty: null as EstimateRequest['conditionData']['warranty'],
  });
  const [touched, setTouched] = useState(false);

  const filteredBrands = useMemo(() => {
    const normalizedQuery = brandQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return phoneBrands;
    }

    return phoneBrands.filter((brand) => brand.name.toLowerCase().includes(normalizedQuery));
  }, [brandQuery, phoneBrands]);

  const filteredModels = useMemo(() => {
    const normalizedQuery = modelQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return phoneModels;
    }

    return phoneModels.filter((model) => model.name.toLowerCase().includes(normalizedQuery));
  }, [modelQuery, phoneModels]);

  const estimateInput: EstimateRequest = {
    brandName: selectedBrand?.name,
    brandSlug: selectedBrand?.slug,
    modelName: selectedPhoneModel?.name,
    modelSlug: selectedPhoneModel?.slug,
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
  const activeErrorMessage = validationMessage || apiError;

  useEffect(() => {
    let cancelled = false;

    async function loadPhoneBrands() {
      setIsLoadingBrands(true);
      setBrandLoadError('');

      try {
        const brands = await getPhoneBrands();
        if (!cancelled) {
          setPhoneBrands(brands);
        }
      } catch (error) {
        if (!cancelled) {
          setBrandLoadError(
            error instanceof Error ? error.message : 'Failed to load phone brands from the API.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingBrands(false);
        }
      }
    }

    void loadPhoneBrands();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedBrand?.slug) {
      setPhoneModels([]);
      setSelectedPhoneModel(null);
      setModelQuery('');
      setModelLoadError('');
      return;
    }

    let cancelled = false;

    async function loadPhoneModels() {
      setIsLoadingModels(true);
      setModelLoadError('');
      setPhoneModels([]);
      setSelectedPhoneModel(null);
      setModelQuery('');

      try {
        const models = await getPhoneModels(selectedBrand.slug);
        if (!cancelled) {
          setPhoneModels(models);
        }
      } catch (error) {
        if (!cancelled) {
          setModelLoadError(
            error instanceof Error ? error.message : 'Failed to load phone models from the API.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingModels(false);
        }
      }
    }

    void loadPhoneModels();

    return () => {
      cancelled = true;
    };
  }, [selectedBrand?.slug]);

  const handleBrandSelect = (brand: PhoneBrand) => {
    setSelectedBrand(brand);
    setBrandQuery('');
    setSelectedPhoneModel(null);
    setModelQuery('');
    setOriginalPrice('');
    setApiError('');
  };

  const handleBrandClear = () => {
    setSelectedBrand(null);
    setBrandQuery('');
    setPhoneModels([]);
    setSelectedPhoneModel(null);
    setModelQuery('');
    setOriginalPrice('');
    setApiError('');
    setModelLoadError('');
  };

  const handleModelSelect = (model: PhoneModel) => {
    setSelectedPhoneModel(model);
    setModelQuery(model.name);
    setApiError('');

    if (model.launchPrice > 0) {
      setOriginalPrice(String(model.launchPrice));
    }
  };

  const handleModelChange = (value: string) => {
    setModelQuery(value);
    setApiError('');

    if (selectedPhoneModel?.name !== value) {
      setSelectedPhoneModel(null);
    }
  };

  const handleEstimate = async () => {
    setTouched(true);
    setApiError('');

    const nextValidationMessage = getValidationMessage(estimateInput);
    if (nextValidationMessage) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await postEstimate(estimateInput);

      router.push({
        pathname: '/result',
        params: {
          result: JSON.stringify(result),
        },
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'Failed to reach the backend API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Phone estimate</Text>
            <Text style={styles.subtitle}>
              This flow is fully API-driven. Brands, models, and pricing decisions must come from
              the backend.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1. Choose Brand</Text>
            <TextInput
              value={selectedBrand ? '' : brandQuery}
              onChangeText={setBrandQuery}
              placeholder="Search phone brand"
              placeholderTextColor="#64748b"
              style={styles.input}
            />

            {selectedBrand ? (
              <View style={styles.selectedChip}>
                <Text style={styles.selectedChipText}>{selectedBrand.name}</Text>
                <Pressable onPress={handleBrandClear} hitSlop={10}>
                  <Text style={styles.selectedChipAction}>x</Text>
                </Pressable>
              </View>
            ) : null}

            {isLoadingBrands ? (
              <Text style={styles.helperText}>Loading phone brands from the API...</Text>
            ) : null}

            {!selectedBrand && !isLoadingBrands ? (
              <FlatList
                data={filteredBrands}
                keyExtractor={(item) => item.slug}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.listItem} onPress={() => handleBrandSelect(item)}>
                    <Text style={styles.listTitle}>{item.name}</Text>
                    <Text style={styles.listSubtitle}>{item.modelCount} API models</Text>
                  </TouchableOpacity>
                )}
              />
            ) : null}

            {brandLoadError ? <Text style={styles.errorText}>{brandLoadError}</Text> : null}

            <Text style={styles.sectionTitle}>2. Choose Model</Text>
            <TextInput
              value={modelQuery}
              onChangeText={handleModelChange}
              placeholder={selectedBrand ? `Search ${selectedBrand.name} models` : 'Select a brand first'}
              placeholderTextColor="#64748b"
              style={styles.input}
              editable={Boolean(selectedBrand)}
            />

            {selectedPhoneModel ? (
              <Text style={styles.helperText}>
                Selected model: {selectedPhoneModel.name}. Launch price was pulled from the API.
              </Text>
            ) : null}

            {selectedBrand && isLoadingModels ? (
              <Text style={styles.helperText}>Loading models for {selectedBrand.name}...</Text>
            ) : null}

            {selectedBrand && !isLoadingModels && filteredModels.length > 0 ? (
              <FlatList
                data={filteredModels}
                keyExtractor={(item) => item.slug}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.listItem} onPress={() => handleModelSelect(item)}>
                    <Text style={styles.listTitle}>{item.name}</Text>
                    <Text style={styles.listSubtitle}>
                      Launch price Rs. {item.launchPrice} · {item.releaseYear}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : null}

            {selectedBrand &&
            !isLoadingModels &&
            !modelLoadError &&
            phoneModels.length === 0 ? (
              <View style={styles.noticeCard}>
                <Text style={styles.noticeTitle}>Models unavailable</Text>
                <Text style={styles.noticeText}>
                  The API did not return models for {selectedBrand.name}. TODO: complete the model
                  API before estimates can be created for this brand.
                </Text>
              </View>
            ) : null}

            {modelLoadError ? <Text style={styles.errorText}>{modelLoadError}</Text> : null}

            <Text style={styles.sectionTitle}>3. Review Pricing Inputs</Text>

            <Text style={styles.label}>Original price</Text>
            <TextInput
              value={originalPrice}
              onChangeText={(value) => {
                setOriginalPrice(value);
                setApiError('');
              }}
              placeholder="50000"
              placeholderTextColor="#64748b"
              style={styles.input}
              keyboardType="numeric"
            />

            <Text style={styles.helperText}>
              Use the API-provided launch price as a starting point, then adjust only if your
              backend expects a different original purchase price.
            </Text>

            <Text style={styles.sectionTitle}>4. Condition Assessment</Text>

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

            {activeErrorMessage ? <Text style={styles.errorText}>{activeErrorMessage}</Text> : null}

            <Pressable
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleEstimate}
              disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Calculating...' : '5. View Result'}</Text>
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
  noticeCard: {
    backgroundColor: '#101f16',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f5131',
    gap: 6,
  },
  noticeTitle: {
    color: '#bbf7d0',
    fontSize: 15,
    fontWeight: '700',
  },
  noticeText: {
    color: '#dcfce7',
    fontSize: 14,
    lineHeight: 21,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#111c30',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  pillActive: {
    backgroundColor: '#17304f',
    borderColor: '#38bdf8',
  },
  conditionPillActive: {
    backgroundColor: '#133020',
    borderColor: '#22c55e',
  },
  pillText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#e0f2fe',
  },
  pillTextLight: {
    color: '#dcfce7',
  },
  input: {
    backgroundColor: '#08111f',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f8fafc',
    fontSize: 15,
  },
  selectedChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#17304f',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  selectedChipText: {
    color: '#e0f2fe',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedChipAction: {
    color: '#67e8f9',
    fontSize: 16,
    fontWeight: '800',
  },
  listItem: {
    backgroundColor: '#111c30',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 4,
  },
  listTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  listSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#fda4af',
    fontSize: 14,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#03120a',
    fontSize: 16,
    fontWeight: '800',
  },
});
