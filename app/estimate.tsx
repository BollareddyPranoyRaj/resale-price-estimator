import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
  getPopularModelQuickPicks,
  getPopularModelSuggestions,
  phaseOneCatalog,
  type CategorySlug,
} from '@/lib/catalog';
import {
  getPhoneBrands,
  getPhoneModels,
  postEstimate,
  type EstimateRequest,
  type PhoneBrand,
  type PhoneModel,
} from '@/lib/api';
import {
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
type BrandOption = { slug?: string; name: string };

export default function EstimateScreen() {
  const [category, setCategory] = useState<CategorySlug>('phones');
  const [query, setQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandOption | null>(null);
  const [phoneBrands, setPhoneBrands] = useState<PhoneBrand[]>([]);
  const [phoneModels, setPhoneModels] = useState<PhoneModel[]>([]);
  const [selectedPhoneModel, setSelectedPhoneModel] = useState<PhoneModel | null>(null);
  const [modelName, setModelName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandLoadError, setBrandLoadError] = useState('');
  const [modelLoadError, setModelLoadError] = useState('');
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [conditionData, setConditionData] = useState({
    physical: null as PhysicalCondition | null,
    screen: null as ScreenCondition | null,
    battery: null as BatteryCondition | null,
    age: '',
    usage: null as UsageIntensity | null,
    accessories: null as 'yes' | 'no' | null,
    repairs: null as RepairHistory | null,
    warranty: null as 'yes' | 'no' | null,
  });
  const [touched, setTouched] = useState(false);

  const categoryDefinition = useMemo(() => getCategoryDefinition(category), [category]);
  const isPhoneCategory = category === 'phones';
  const availableBrands = useMemo<BrandOption[]>(
    () =>
      isPhoneCategory
        ? phoneBrands.map((brand) => ({ slug: brand.slug, name: brand.name }))
        : (categoryDefinition?.brands ?? []).map((brand) => ({ slug: brand.slug, name: brand.name })),
    [categoryDefinition, isPhoneCategory, phoneBrands]
  );

  const matchedBrand = useMemo(() => {
    if (!selectedBrand) {
      return null;
    }

    return (
      availableBrands.find((entry) => {
        if (selectedBrand.slug && entry.slug) {
          return entry.slug === selectedBrand.slug;
        }

        return entry.name.toLowerCase() === selectedBrand.name.toLowerCase();
      }) ?? selectedBrand
    );
  }, [availableBrands, selectedBrand]);

  const selectedPhoneBrand = useMemo(
    () =>
      selectedBrand?.slug ? phoneBrands.find((brand) => brand.slug === selectedBrand.slug) ?? null : null,
    [phoneBrands, selectedBrand]
  );

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return availableBrands.filter((brand) => brand.name.toLowerCase().includes(normalizedQuery));
  }, [availableBrands, query]);

  const modelSuggestions = useMemo(() => {
    if (!matchedBrand) {
      return [];
    }

    if (isPhoneCategory) {
      const normalizedModelQuery = modelName.trim().toLowerCase();

      if (!normalizedModelQuery) {
        return [];
      }

      return phoneModels
        .filter((model) => model.name.toLowerCase().includes(normalizedModelQuery))
        .map((model) => model.name);
    }

    return getPopularModelSuggestions(matchedBrand.slug, modelName);
  }, [isPhoneCategory, matchedBrand, modelName, phoneModels]);

  const modelQuickPicks = useMemo(() => {
    if (!matchedBrand) {
      return [];
    }

    if (isPhoneCategory) {
      return phoneModels.slice(0, 3).map((model) => model.name);
    }

    return getPopularModelQuickPicks(matchedBrand.slug);
  }, [isPhoneCategory, matchedBrand, phoneModels]);

  const estimateInput: EstimateRequest = {
    category,
    brandName: selectedBrand?.name ?? query.trim(),
    brandSlug: isPhoneCategory ? selectedBrand?.slug : undefined,
    modelName: modelName.trim(),
    modelSlug: isPhoneCategory ? selectedPhoneModel?.slug : undefined,
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
    if (!isPhoneCategory) {
      setBrandLoadError('');
      setModelLoadError('');
      setPhoneModels([]);
      setSelectedPhoneModel(null);
      return;
    }

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
            error instanceof Error ? error.message : 'Failed to load supported phone brands.'
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
  }, [isPhoneCategory]);

  useEffect(() => {
    const selectedBrandSlug = selectedBrand?.slug;

    if (!isPhoneCategory || !selectedBrandSlug) {
      setPhoneModels([]);
      setSelectedPhoneModel(null);
      setModelLoadError('');
      return;
    }

    let cancelled = false;

    async function loadPhoneModels() {
      if (!selectedBrandSlug) {
        return;
      }

      setIsLoadingModels(true);
      setModelLoadError('');

      try {
        const models = await getPhoneModels(selectedBrandSlug);
        if (!cancelled) {
          setPhoneModels(models);
        }
      } catch (error) {
        if (!cancelled) {
          setModelLoadError(
            error instanceof Error ? error.message : 'Failed to load phone models for this brand.'
          );
          setPhoneModels([]);
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
  }, [isPhoneCategory, selectedBrand?.slug]);

  const handleCategoryChange = (nextCategory: CategorySlug) => {
    setCategory(nextCategory);
    setQuery('');
    setSelectedBrand(null);
    setPhoneModels([]);
    setSelectedPhoneModel(null);
    setModelName('');
    setOriginalPrice('');
    setApiError('');
    setBrandLoadError('');
    setModelLoadError('');
  };

  const handleBrandSelect = (brand: BrandOption) => {
    setSelectedBrand(brand);
    setQuery('');
    setModelName('');
    setSelectedPhoneModel(null);
    setPhoneModels((current) =>
      isPhoneCategory && brand.slug !== selectedBrand?.slug ? [] : current
    );
    setApiError('');
  };

  const handleBrandClear = () => {
    setSelectedBrand(null);
    setQuery('');
    setModelName('');
    setSelectedPhoneModel(null);
    setPhoneModels([]);
    setApiError('');
    setModelLoadError('');
  };

  const modelPlaceholder = matchedBrand ? `Type ${matchedBrand.name} model` : 'Type Model Name';

  const handleModelChange = (value: string) => {
    setModelName(value);
    setApiError('');

    if (!isPhoneCategory) {
      return;
    }

    const nextSelectedModel =
      phoneModels.find((model) => model.name.toLowerCase() === value.trim().toLowerCase()) ?? null;

    setSelectedPhoneModel(nextSelectedModel);

    if (nextSelectedModel && !originalPrice.trim()) {
      setOriginalPrice(String(nextSelectedModel.launchPrice));
    }
  };

  const handlePhoneModelSelect = (value: string) => {
    const nextSelectedModel = phoneModels.find((model) => model.name === value) ?? null;
    setSelectedPhoneModel(nextSelectedModel);
    setModelName(value);
    setApiError('');

    if (nextSelectedModel && !originalPrice.trim()) {
      setOriginalPrice(String(nextSelectedModel.launchPrice));
    }
  };

  const handleEstimate = async () => {
    setTouched(true);
    setApiError('');

    if (isPhoneCategory && !selectedBrand?.slug) {
      setApiError('Please choose a supported phone brand from the backend catalog.');
      return;
    }

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
            <Text style={styles.title}>Select your product</Text>
            <Text style={styles.subtitle}>
              Search the brand, type the model manually, and continue with a clean estimate flow.
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
                <Text style={styles.selectedChipText}>{selectedBrand.name}</Text>
                <Pressable onPress={handleBrandClear} hitSlop={10}>
                  <Text style={styles.selectedChipAction}>x</Text>
                </Pressable>
              </View>
            ) : null}

            {!selectedBrand ? (
              <>
                {isPhoneCategory && isLoadingBrands ? (
                  <Text style={styles.helperText}>Loading phone brands from the backend catalog...</Text>
                ) : null}
                <FlatList
                  data={filteredBrands}
                  keyExtractor={(item) => item.slug ?? item.name}
                  scrollEnabled={false}
                  contentContainerStyle={styles.listContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => handleBrandSelect(item)}>
                      <Text style={styles.listTitle}>{item.name}</Text>
                      <Text style={styles.listSubtitle}>
                        {isPhoneCategory
                          ? `${phoneBrands.find((brand) => brand.slug === item.slug)?.modelCount ?? 0} catalog models`
                          : 'Brand-based depreciation'}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                {!isPhoneCategory && query.trim().length > 0 ? (
                  <TouchableOpacity
                    style={styles.manualAction}
                    onPress={() => handleBrandSelect({ name: query.trim() })}>
                    <Text style={styles.manualActionText}>Use &quot;{query.trim()}&quot; as brand</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : null}

            {brandLoadError ? <Text style={styles.errorText}>{brandLoadError}</Text> : null}

            <Text style={styles.sectionTitle}>3. Enter Model</Text>
            <View style={styles.inputRow}>
              <TextInput
                value={modelName}
                onChangeText={handleModelChange}
                placeholder={modelPlaceholder}
                placeholderTextColor="#64748b"
                style={[styles.input, styles.inputWithAction]}
              />
              {modelName.trim().length > 0 ? (
                <Pressable
                  style={styles.inlineAction}
                  onPress={() => {
                    setModelName('');
                    setSelectedPhoneModel(null);
                  }}>
                  <Text style={styles.inlineActionText}>Clear</Text>
                </Pressable>
              ) : null}
            </View>

            {matchedBrand && modelName.trim().length === 0 && modelQuickPicks.length > 0 ? (
              <View style={styles.quickPickSection}>
                <Text style={styles.quickPickLabel}>Popular picks</Text>
                <View style={styles.wrapRow}>
                  {modelQuickPicks.map((item) => (
                    <Pressable
                      key={item}
                      style={styles.quickPickChip}
                      onPress={() => (isPhoneCategory ? handlePhoneModelSelect(item) : setModelName(item))}>
                      <Text style={styles.quickPickText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}

            {matchedBrand && modelSuggestions.length > 0 ? (
              <FlatList
                data={modelSuggestions}
                keyExtractor={(item) => item}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => (isPhoneCategory ? handlePhoneModelSelect(item) : setModelName(item))}>
                    <Text style={styles.listTitle}>{item}</Text>
                    <Text style={styles.listSubtitle}>
                      {isPhoneCategory ? `Catalog model for ${matchedBrand.name}` : `Popular ${matchedBrand.name} model`}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : null}

            {matchedBrand ? (
              <Text style={styles.helperText}>
                {isPhoneCategory
                  ? `Using ${matchedBrand.name} from the backend catalog.${selectedPhoneModel ? ` Launch price auto-filled from ${selectedPhoneModel.releaseYear}.` : selectedPhoneBrand?.modelCount ? ' You can still type a manual model name.' : ' No catalog models yet for this brand, so this estimate will use manual model fallback.'}`
                  : `Using ${matchedBrand.name} brand logic. Model stays manual in this release.`}
              </Text>
            ) : null}

            {isPhoneCategory && selectedBrand && isLoadingModels ? (
              <Text style={styles.helperText}>Loading phone models for {selectedBrand.name}...</Text>
            ) : null}

            {modelLoadError ? <Text style={styles.errorText}>{modelLoadError}</Text> : null}

            {isPhoneCategory &&
            selectedBrand &&
            !isLoadingModels &&
            !modelLoadError &&
            phoneModels.length === 0 ? (
              <View style={styles.noticeCard}>
                <Text style={styles.noticeTitle}>Manual model estimate</Text>
                <Text style={styles.noticeText}>
                  {selectedBrand.name} is supported, but this catalog does not have phone models yet.
                  Enter the model name and original price manually to continue.
                </Text>
              </View>
            ) : null}

            <Text style={styles.sectionTitle}>4. Add Details</Text>

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
            {isPhoneCategory && selectedPhoneModel ? (
              <Text style={styles.helperText}>
                Auto-filled from the catalog launch price for {selectedPhoneModel.name}. You can still edit it.
              </Text>
            ) : null}

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

            {activeErrorMessage ? <Text style={styles.errorText}>{activeErrorMessage}</Text> : null}

            <Pressable
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={handleEstimate}
              disabled={isSubmitting}>
              <Text style={styles.buttonText}>{isSubmitting ? 'Calculating...' : '6. View Result'}</Text>
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
    flex: 1,
    backgroundColor: '#162338',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#22304a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f8fafc',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWithAction: {
    flex: 1,
  },
  inlineAction: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#13273f',
    borderWidth: 1,
    borderColor: '#22304a',
  },
  inlineActionText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  selectedChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  selectedChipAction: {
    color: '#86efac',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 16,
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
  quickPickSection: {
    gap: 10,
  },
  quickPickLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  quickPickChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#13273f',
    borderWidth: 1,
    borderColor: '#22304a',
  },
  quickPickText: {
    color: '#dbeafe',
    fontSize: 13,
    fontWeight: '700',
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
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#03120a',
    fontSize: 16,
    fontWeight: '800',
  },
});
