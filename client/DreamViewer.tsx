import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Image, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto';
import { Dream } from './types'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
const img = require('./assets/placeholder.png');
type navigationProps = NativeStackScreenProps<RootStackParamList, 'DreamEditor'>;
import 'react-native-url-polyfill/auto'
import { Divider } from 'react-native-paper';

interface Props {
  navigation: navigationProps['navigation'],
  route: RouteProp<{ params: { dream: Dream } }, 'params'>
}



export default function DreamViewer({ navigation, route }: Props) {

 const {id, title, description, useAIDescription, image, date} = route.params.dream;
 const [AIDescription, setAIDescription] = useState<String>('');
 const [loading, setLoading] = useState<Boolean>(false);

 useEffect(() => {

  setAIDescription(route.params?.dream.AIDescription ?? '');
  console.log(useAIDescription);
  console.log(image);
  }, [route.params]);

  const dreamDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });



  if(loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{fontSize: 30, fontFamily: 'Quicksand_700Bold', color: '#fff'}}>Generating your dream...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        { image && 
      <>
        <Image source={{uri: image}} style={styles.image}/>
        <Pressable style={styles.editButton} onPress={() => navigation.navigate('ImageEditor', {
          dream: route.params.dream
        })}>
          <MaterialCommunityIcons name="pencil" size={32} color="white" />
        </Pressable>   
      </>
        }

      <View>

        <Text style={styles.title}>{title}</Text>
        <View style={styles.badgeContainer}>
          {
            useAIDescription &&
            <View style={styles.aiIndicator}>
              <Text style={styles.aiText}>AI Enhanced</Text>
            </View>
          }
          <Text style={styles.dateText}>
              {dreamDate}
          </Text>
        </View>


        <Text style={styles.description}>{
          useAIDescription? AIDescription : description
        }</Text>

        

      </View>
      

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#040F16',
  },
  loadingContainer: {
    backgroundColor: '#040F16',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  description: {
    fontSize: 18,
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 0,
    marginLeft: 20,
    fontFamily: 'Quicksand_400Regular',
    width: 370,
    textAlignVertical: 'top'
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
  image: {
    width: 400,
    height: 200,
    marginLeft: 5,
    marginBottom: 10,
    marginTop: 10
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#005E7C', // Set the background to transparent to make it circular
    borderRadius: 25, // Use half of the desired icon size for a circular button
    padding: 10,
    // You can add more styles for the icon button if needed
  },
  aiIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderColor: '#28a745',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginLeft: 30,
    marginBottom: 10,
  },
  aiText: {
    color: '#28a745',
    fontSize: 12,
    fontFamily: 'Quicksand_400Regular',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
    marginHorizontal: 0,
    marginTop: -5,
    marginBottom: 5,
    marginLeft: '5%'
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  }
});
