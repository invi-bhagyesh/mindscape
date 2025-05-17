import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Keyboard } from 'react-native';
import { RootStackParamList } from './types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import * as SecureStore from 'expo-secure-store'
import * as Crypto from 'expo-crypto';
import { Dream } from './types'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';

type navigationProps = NativeStackScreenProps<RootStackParamList, 'DreamEditor'>;

interface Props {
  navigation: navigationProps['navigation'],
  route: RouteProp<{ params: { dream: Dream } }, 'params'>
}

export default function DreamEditor({ navigation, route }: Props) {
  const id: string | null = route.params?.dream.id || null;
  const useAIDescription: boolean = route.params?.dream.useAIDescription;
  const image: string = route.params?.dream.image || '';
  const [title, setTitle] = useState(route.params?.dream.title ?? '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [AIDescription, setAIDescription] = useState<string>('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(route.params?.dream.title ?? '')
    route.params?.dream.useAIDescription? setDescription(route.params?.dream.AIDescription ?? '') : setDescription(route.params?.dream.description ?? '');
    setAIDescription(route.params?.dream.AIDescription ?? '');
    setDate(new Date(route.params?.dream.date) ?? new Date());
  }, [route.params]);


  // const generateDreamCont = async() => {
  //   const openai = new OpenAIApi(config);
  //   const completion = await openai.createChatCompletion({
  //     model: 'gpt-3.5-turbo-16k',
  //     messages: [{role: 'user', content: `Your job is to rewrite a dream you are given to add more detail. Please do not rewrite the title. \n \n Rewrite this dream to be more descriptive: \n\n Title of the dream: ${title} \n\n Description of the dream: ${description} \n\n Respond with only the rewritten description and no other text. Then, add '||' to the end of your response, and provide a one sentence description of the dream that will be fed into an AI Image generation model.`}],
  //     max_tokens: 4000,
  //   });
  //   //await SecureStore.setItemAsync(dream.id, JSON.stringify({...route.params.dream, AIDescription: completion.data.choices[0].text}));
    
  //   return completion.data.choices[0].message?.content?.trim();
  // }`

  const generateDreamCont = async() => {
      console.log("calling api...")
      console.log(process.env.EXPO_PUBLIC_API_URL);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generate-dream-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description })
      }).then((res) => res.json()).then((data) => {
        return data.response
      });

      return response;
  }

  // const generateImage = async(prompt: string, dream: Dream) => {
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

    const fileUri: string = `${FileSystem.documentDirectory}${dream.id}.png`;
    const downloadedFile: FileSystem.FileSystemDownloadResult = await FileSystem.downloadAsync(imageURL, fileUri);

    return fileUri;
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
        <Text style={{fontSize: 30, fontFamily: 'Quicksand_700Bold', color: '#fff'}}>Generating your dream...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={(e: string) => { setTitle(e) }}
          placeholder="Untitled"
          placeholderTextColor="#D3D3D3"
        />

        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={(e: string) => { setDescription(e) }}
          placeholder="Describe your dream"
          placeholderTextColor="#D3D3D3"
          multiline={true}
          numberOfLines={4} 
        />


        <TouchableOpacity style={styles.button} onPress={async () => {


          if(!id){

            let value: Dream = {
              id: Crypto.randomUUID(),
              title: title,
              description: description,
              AIDescription: AIDescription,
              useAIDescription: false,
              date: new Date().toISOString(),
              image: image,
            };


            try{
              setLoading(true);
              const AIresponse = await generateDreamCont();
              const [rewrittenDream, prompt] = AIresponse!.split('||');
              value.AIDescription = rewrittenDream;
              
              const imageURL = await generateImage(prompt, value);
              value.image = imageURL;

              setLoading(false);
              navigation.navigate('NewDreamPrompt', {
                dream: value,
              });
            } catch(e) {
              console.log(e);
              await saveDream(value);
              navigation.navigate('Dreams');
            }


          } else {
            const value: Dream = {
              id: id,
              title: title,
              description: description,
              image: image,
              AIDescription: AIDescription,
              useAIDescription: false,
              date: date.toISOString(),
            };
            await SecureStore.setItemAsync(id, JSON.stringify(value));
            const dreamIDString = await SecureStore.getItemAsync('dreamIDs');
            const dreamIDs = JSON.parse(dreamIDString ?? '[]');

            if(!dreamIDs?.includes(id)){
              await SecureStore.setItemAsync('dreamIDs', JSON.stringify([...dreamIDs, id]));
            }

            navigation.navigate('Dreams');
          }
        }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>


      </View>
    </TouchableWithoutFeedback>
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
  titleInput: {
    fontSize: 30,
    color: '#fff',
    backgroundColor: '#092333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    marginLeft: 20,
    fontFamily: 'Quicksand_700Bold',
    width: '90%'
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
  AIdescription: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#092333',
    borderRadius: 5,
    padding: 10,
    marginLeft: 20,
    fontFamily: 'Quicksand_400Regular',
    width: 370,
    height: 150
  },
  button: {
    marginTop: 40,
    backgroundColor: '#52aae0',
    borderRadius: 5,
    padding: 10,
    alignSelf: 'center',
    width: 350,
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
