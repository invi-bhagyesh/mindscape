import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
import { RootStackParamList } from './types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto';
import { Dream } from './types'
import { TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
type navigationProps = NativeStackScreenProps<RootStackParamList, 'DreamEditor'>;


interface Props {
    navigation: navigationProps['navigation'],
    route: RouteProp<{ params: { dream: Dream } }, 'params'>
}

export default function NewDreamPrompt({route, navigation}: Props) {

  let dream = route.params.dream;
  
  const saveDream = async() => {
    await SecureStore.setItemAsync(dream.id, JSON.stringify(dream));

    const dreamIDString = await SecureStore.getItemAsync('dreamIDs');
    const dreamIDs = JSON.parse(dreamIDString ?? '[]');

    if(!dreamIDs?.includes(dream.id)){
      await SecureStore.setItemAsync('dreamIDs', JSON.stringify([...dreamIDs, dream.id]));
    }
  }

  return (

    <View style={styles.container}>
     <ScrollView>
        <Text style={styles.title}>
            Use this AI generated description for your dream?
        </Text>
        <Text style={styles.AIdescription}>
            {dream.AIDescription}
        </Text>
        <TouchableOpacity style={styles.button} onPress={async () => {
         dream.useAIDescription = true;
        
         await saveDream();
         navigation.navigate('Dreams')
        }}>
          <Text style={styles.buttonText}>Yes, use this description</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={async () => {
         dream.useAIDescription = false;
            
         await saveDream();
         navigation.navigate('Dreams')
        }}>
          <Text style={styles.buttonText}>No, Keep my old description</Text>
        </TouchableOpacity>
     </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040F16',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 0,
    marginLeft: 20,
    fontFamily: 'Quicksand_700Bold',
    width: 370
  },
  AIdescription: {
    fontSize: 18,
    color: '#fff',
    borderRadius: 5,
    marginTop: 0,
    paddingHorizontal: 10,
    marginLeft: 20,
    fontFamily: 'Quicksand_400Regular',
    width: 370,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#52aae0',
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
    width: 350,
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 40,
    backgroundColor: '#FF6A74',
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
    width: 350,
  },
  buttonText: {

    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Quicksand_700Bold',
  },
  
});