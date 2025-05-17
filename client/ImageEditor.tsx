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
import { useToast } from "react-native-toast-notifications";
import * as ImagePicker from 'expo-image-picker'
const img = require('./assets/placeholder.png');
import { Divider } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
type navigationProps = NativeStackScreenProps<RootStackParamList, 'DreamEditor'>;

interface Props {
    navigation: navigationProps['navigation'],
    route: RouteProp<{ params: { dream: Dream } }, 'params'>
  }


export default function ImageEditor({navigation, route}: Props) {
    let dream = route.params?.dream;
    const [prompt, setPrompt] = useState('');
    const toast = useToast();
    const [loading, setLoading] = useState(false); 


    // const generateImage = async(prompt: string) => {
    //   const openai = new OpenAIApi(config);
    //   const res = await openai.createImage({
    //     prompt: prompt + ', digital art',
    //     n: 1,
    //     size: '512x512'
    //   });
      
    //   const fileUri: string = `${FileSystem.documentDirectory}${dream.id}.png`;
    //   const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(res.data.data[0].url!, fileUri);
    //   return fileUri;
    // }

  const generateImage = async(prompt: string, dream: Dream) => {
    console.log("generating image...");
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })  
    }).then((res) => res.json()).then((data) => {
      return data.imageURL;
    })

    const imageURL = await response;
    console.log(imageURL);

    const fileUri: string = `${FileSystem.documentDirectory}${dream.id}.png`;

    const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(imageURL, fileUri);

    return fileUri;
  }

    const onGenerateButtonPress = async() => {
      if(!prompt){
        toast.show('Please enter a prompt', {
          type: 'danger',
          placement: 'bottom',
          duration: 2000,
          animationType: 'slide-in'
        });
      } else {
        try{
          setLoading(true);
          dream.image = await generateImage(prompt, dream);
          await saveDream(dream);
          setLoading(false);

          navigation.navigate('DreamViewer', {
            dream: dream,
          });

        } catch(e) {
          console.log(e);
          await saveDream(dream);
          navigation.navigate('DreamViewer', {
            dream: dream,
          });
        }
        
      }
    } 

    const onUploadButtonPress = async() => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });

      if(!result.canceled){
        try{
          dream.image = result.assets[0].uri;
          await saveDream(dream);
          
          navigation.navigate('DreamViewer', {
            dream: dream,
          });

        } catch(e) {
          alert('something went wrong');
          navigation.navigate('DreamViewer', {
            dream: dream,
          });


        }
      }
    }

    const saveDream = async(dream: Dream) => {
      await SecureStore.setItemAsync(dream.id, JSON.stringify(dream));
  
      const dreamIDString = await SecureStore.getItemAsync('dreamIDs');
      const dreamIDs = JSON.parse(dreamIDString ?? '[]');
  
      if(!dreamIDs?.includes(dream.id)){
        await SecureStore.setItemAsync('dreamIDs', JSON.stringify([...dreamIDs, dream.id]));
      }
    }

    if(loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{fontSize: 30, fontFamily: 'Quicksand_700Bold', color: '#fff'}}>Imagining your dream...</Text>
        </View>
      )
    }
    return (
        <View style={styles.container}>
          <ScrollView>
            { dream.image && 
          <>
            <Image source={{uri: dream.image}} style={styles.image}/>
          </>
            }
    
          <View>
    
            <Text style={styles.title}>Generate an Image</Text>
            <TextInput
                style={styles.descriptionInput}
                value={prompt}
                onChangeText={(e: string) => { setPrompt(e) }}
                placeholder="Enter a prompt"
                placeholderTextColor="#D3D3D3"
                multiline={true}
                numberOfLines={4} 
            />
            <Pressable style={styles.button} onPress={onGenerateButtonPress}>
                <Text style={styles.buttonText}>Generate</Text>
            </Pressable>

            <Pressable style={styles.uploadBtn} onPress={onUploadButtonPress}>

                <Text style={styles.buttonText}>Upload your own Image</Text>
            </Pressable>
    
            
    
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
      marginLeft: 10,
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
    uploadBtn: {
      backgroundColor: '#52aae0',
      borderRadius: 5,
      padding: 10,
      alignSelf: 'center',
      width: 350,
      marginTop: 40,
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
    descriptionInput: {
        fontSize: 18,
        color: '#fff',
        backgroundColor: '#092333',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        marginLeft: 20,
        height: 200,
        fontFamily: 'Quicksand_400Regular',
        width: '90%',
        textAlignVertical: 'top'
      },
  });
