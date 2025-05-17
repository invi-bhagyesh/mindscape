import 'react-native-get-random-values'
import SideDrawer from "./components/SideDrawer";
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Quicksand_400Regular, Quicksand_700Bold  } from '@expo-google-fonts/quicksand';
import { Header } from '@rneui/themed'
import { Ionicons } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import Dream from './components/DreamCard'
import { createStackNavigator } from '@react-navigation/stack';
import DreamEditor from "./DreamEditor";
import DreamViewer from "./DreamViewer";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Menu, PaperProvider } from 'react-native-paper';
import {useState} from 'react'
import { deleteItemAsync } from 'expo-secure-store';
import NewDreamPrompt from './NewDreamPrompt';
import ImageEditor from './ImageEditor';
import { ToastProvider } from 'react-native-toast-notifications'
import Toast from 'react-native-toast-notifications/lib/typescript/toast';

const Stack = createStackNavigator();

export default function App() {

  let [fontsLoaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_700Bold
  })

  if(!fontsLoaded) { return null; }

  

  return (
    <PaperProvider>
    <ToastProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Something" component={Something} options={{headerShown: false}}/>
          {/*
          @ts-ignore */}
        <Stack.Screen name="DreamEditor" component={DreamEditor} options={{
          headerStyle: {
            backgroundColor: '#040F16', 
            shadowColor: 'transparent',
          },
          headerTintColor: '#fff',
          headerTitle: '',
          headerBackTitleVisible: false
        }}/>
                  {/*
          @ts-ignore */}
        <Stack.Screen name="ImageEditor" component={ImageEditor} options={{
          headerStyle: {
            backgroundColor: '#040F16', 
            shadowColor: 'transparent',
          },
          headerTintColor: '#fff',
          headerTitle: '',
          headerBackTitleVisible: false
        }}/>
                  {/*
          @ts-ignore */}
        <Stack.Screen name="NewDreamPrompt" component={NewDreamPrompt} options={{
          headerStyle: {
            backgroundColor: '#040F16', 
            shadowColor: 'transparent',
          },
          headerTintColor: '#fff',
          headerTitle: '',
          headerBackTitleVisible: false
        }}/>
          {/*
          @ts-ignore */}
        <Stack.Screen name="DreamViewer" component={DreamViewer} options={({route, navigation}: RouteProp<{ params: { dream: Dream } }, 'params'>) => ({
          headerStyle: {
            backgroundColor: '#040F16', 
            shadowColor: 'transparent',
          },
          headerRight: (props) => {
            const [visible, setVisible] = useState(false);

            const openMenu = () => setVisible(true);
          
            const closeMenu = () => setVisible(false)
            return ( 
              <View style={{zIndex: 100, elevation: 100}}>

              <Menu
                style={{width: 200}}
                visible={visible}
                theme={{colors: {primary: '#040F16', text: 'white'}}}
                
                onDismiss={closeMenu}
                anchor={<Feather name="more-vertical" size={24} color="white" style={{ paddingRight: 20, marginTop: -5}} onPress={() => {openMenu()}} />}>
                <Menu.Item onPress={() => {
                  closeMenu();
                  navigation.navigate('DreamEditor', {
                    dream: route.params.dream
                  })
                }} title="Edit"/>
                <Menu.Item onPress={() => {
                  closeMenu();
                  deleteItemAsync(route.params.dream.id);
                  navigation.navigate('Dreams');
                }} title="Delete"/>
              </Menu>

              </View>
            )
          },
          headerTintColor: '#fff',
          headerTitle: '',
          headerBackTitleVisible: false
        })}/>
          {/*
          @ts-ignore */}
      </Stack.Navigator>
      
    </NavigationContainer>
    </ToastProvider>
    </PaperProvider>
  );
}

function Something() {
  return (

      <SideDrawer />

  )
}