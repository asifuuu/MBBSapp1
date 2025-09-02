import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

import medicinesData from './mbbsdata';
import otherData from './otherdata';

export default function App() {
  const [activeTab, setActiveTab] = useState('Drugs'); // Tabs: 'Drugs' or 'Other'
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [ageGroup, setAgeGroup] = useState(null);
  const [showAgeOptions, setShowAgeOptions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Autocomplete suggestions
  const handleSearch = (text) => {
    setSearch(text);
    setAgeGroup(null);
    setResults([]);
    setShowAgeOptions(false);

    if (text.length > 0) {
      const filtered = Object.keys(medicinesData).filter(disease =>
        disease.toLowerCase().startsWith(text.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (disease) => {
    setSearch(disease);
    setSuggestions([]);
    if (medicinesData[disease]) {
      setShowAgeOptions(true);
    }
  };

  const handleAgeSelection = (group) => {
    setAgeGroup(group);
    setShowAgeOptions(false);
    const diseaseMeds = medicinesData[search];
    setResults(diseaseMeds);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000000ff' }} // ensures full screen background
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
    >
      <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Drugs' && styles.activeTab]}
            onPress={() => setActiveTab('Drugs')}
          >
            <Text style={styles.tabText}>Drugs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Other' && styles.activeTab]}
            onPress={() => setActiveTab('Other')}
          >
            <Text style={styles.tabText}>Other</Text>
          </TouchableOpacity>
        </View>

        {/* Drugs Tab */}
        {activeTab === 'Drugs' && (
          <>
            <Text style={styles.title}>Go on , Shoot ! </Text>

            <View style={{ width: '90%' }}>
              <TextInput
                style={styles.input}
                placeholder="Enter Disease Name"
                value={search}
                onChangeText={handleSearch}
              />

              {/* Autocomplete dropdown */}
              {suggestions.length > 0 && (
                <View style={styles.dropdown}>
                  {suggestions.map((s, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleSuggestionSelect(s)}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {showAgeOptions && (
              <View style={styles.ageContainer}>
                <Text style={{ marginBottom: 10 }}>Select Age Group:</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <TouchableOpacity style={styles.ageButton} onPress={() => handleAgeSelection('Adult')}>
                    <Text style={styles.ageText}>Adult</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ageButton} onPress={() => handleAgeSelection('Pediatric')}>
                    <Text style={styles.ageText}>Pediatric</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={{ alignItems: 'center', paddingBottom: 20 }}>
              {results.map((item, index) => (
                <View key={index} style={styles.item}>
                  <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{item.name}</Text>
                  {ageGroup && (
                    <>
                      <Text style={{ fontSize: 18 }}>
                        {ageGroup} Dose: {ageGroup === 'Adult' ? item.adultDose : item.pediatricDose}
                      </Text>
                      <Text style={{ fontSize: 16 }}>Notes: {item.notes}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* Other Tab */}
        {activeTab === 'Other' && (
          <View style={{ marginTop: 30, alignItems: 'center', width: '90%' }}>
            {otherData.map((item, index) => (
              <View key={index} style={styles.notesContainer}>
                <Text style={styles.notesTitle}>{item.title}</Text>
                {item.notes.map((note, i) => (
                  <Text key={i} style={styles.notesText}>• {note}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000ff',
    alignItems: 'center',
    paddingVertical: 80,
  },
  tabContainer: {
    flexDirection: 'column',
    marginBottom: 20,
    width: '90%'
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#444',
    alignItems: 'center',
    borderRadius: 2,
    marginHorizontal: 0
  },
  activeTab: {
    backgroundColor: '#073e85ff'
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18

  },
  title: {
    fontSize: 30,
    color: 'blue',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ffffffff',
    backgroundColor: '#fff2f2ff',
    borderRadius: 55,
    paddingVertical: 11,
    paddingHorizontal: 119,
    fontSize: 18
  },
  dropdown: {
    position: 'relative',
    top: 10,
    width: '100%',
    backgroundColor: '#f7efefd3',
    paddingHorizontal: 90,
    borderRadius: 3,
    zIndex: 10
  },
  dropdownItem: {
    padding: 15
  },
  dropdownText: {
    fontSize: 12
  },
  ageContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  ageButton: {
    backgroundColor: '#3b1a4bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 100
  },
  ageText: {
    color: '#ffffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  item: {
    padding: 35,
    marginBottom: 1,
    backgroundColor: '#d0ebf3ff',
    borderRadius: 33,
    width: '356'
  },
  notesContainer: {
    marginBottom: 25,
    backgroundColor: '#d9f2ff',
    padding: 15,
    borderRadius: 10,
    width: '100%'
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  notesText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5
  }
});
