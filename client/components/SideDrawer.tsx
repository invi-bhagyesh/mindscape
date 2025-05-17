import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import About from '../About'
import Octicons from '@expo/vector-icons/Octicons';
import {DrawerActions} from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import DreamEditor from '../DreamEditor';
import Dreams from '../Dreams';

const Drawer = createDrawerNavigator();

export default function SideDrawer() {
  return (
    <Drawer.Navigator screenOptions={({navigation, route}) => ({
      headerStyle: {backgroundColor: '#040F16', shadowColor: 'transparent'},
      headerTitle: ({children}): React.ReactNode => {
        if(children === 'DreamEditor') {
          return (
            <View>
            
          </View>
          )
        }
        return (        
        <View>
          <Text style={{color: '#fff', fontFamily: 'Quicksand_700Bold', fontSize: 30, fontWeight: 'bold'}}> {children} </Text>
        </View>
        )
      },
      headerLeft: (props) => {
        return <Octicons name="three-bars" size={24} color="white" style={{ paddingLeft: 20}} onPress={() => {
          navigation.openDrawer();
        }} />
      },
      drawerStyle: {
        backgroundColor: '#040F16',
      },
      drawerLabelStyle: {
        color: '#fff',
      }
       
    })}>
        {/*
          @ts-ignore */}
        <Drawer.Screen name="Dreams" component={Dreams}/>
        <Drawer.Screen name="About" component={About} />
                {/*
          @ts-ignore */}
    </Drawer.Navigator>
  )
}
