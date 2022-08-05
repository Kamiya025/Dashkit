import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  View, Text,
  Button, Image
} from 'react-native';
import UserProvider from './UserContext'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  QueryClient,
  useMutation,
  QueryClientProvider
} from '@tanstack/react-query';;
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpRightFromSquare, faHome } from '@fortawesome/free-solid-svg-icons';
import { useUserDispatch, useUser } from "./UserContext";
import Dashboard from './src/component/Dashboard';
import Login from './src/component/login';
import CreateTicket from './src/component/CreateTicket';
import TicketsDetail from './src/component/TicketsDetail';
import Ticket from './src/component/Ticket';
import AddLog from './src/component/AddLog';
import { baseUrl, stringToLinkImg, stringToRGB } from './src/util';
import theme from './src/theme';
import { TabBar } from 'react-native-tab-view';
import axios from 'axios';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();


function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('./src/asset/logo.png')}
      resizeMode="contain"
    />
  );
}
const getUserName = () => {
  const user = useUser();
  return user.name;
}
const options = {
  headerTitle: (props) => <LogoTitle {...props} />,
  headerRight: () => (
    <Image
      source={{
        uri: stringToLinkImg(getUserName())
      }}
      style={[theme.StyleCommon.avataSmall, { marginRight: 10 }]}
      resizeMode='center'
    />),
  headerTitleAlign: 'center',
}
const optionsWithIcon = (Icon) => {
  return {
    headerTitle: (props) => <LogoTitle {...props} />,
    headerRight: () => (
      <Image
        source={{
          uri: stringToLinkImg(getUserName())
        }}
        style={[theme.StyleCommon.avataSmall, { marginRight: 10 }]}
        resizeMode='center'
      />),
    headerTitleAlign: 'center',
    drawerIcon: ({ tintColor, size, color }) => (
      <FontAwesomeIcon icon={Icon} size={size} color={color} />
    ),
  }
}
function Home() {
  return (
    <Drawer.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} options={optionsWithIcon(faHome)} />
    </Drawer.Navigator>
  )
}
function CustomDrawerContent(props) {
  const dispatch = useUserDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ width: '100%', justifyContent: 'center' }}>
        <Image
          style={{ width: 60, height: 50, alignSelf: 'center', margin: 40 }}
          source={require('./src/asset/logo.png')}
          resizeMode="contain"
        />
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        icon={({ focused, color, size }) => <FontAwesomeIcon icon={faArrowUpRightFromSquare} color={color} size={size} />}
        onPress={() => {
          dispatch({
            type: 'logout',
          });
        }
        }
      />
    </DrawerContentScrollView>
  );
}


const StackScreenList = () => {
  const user = useUser();
  const dispatch = useUserDispatch();
  useEffect(() => {
    console.log(JSON.stringify(user));
    if (user.accessToken != '') setTimeout(() => refreshToken(user, dispatch), (30 * 60 * 1000))
  }, [user])
  const refreshToken = (user, dispatch) => {

    let url = `${baseUrl}/staff/refresh-token/`;
    console.log(`refreshToken - ` + user.refreshToken)
    axios({
      method: 'post',
      url: url,
      headers: { refreshtoken: user.refreshToken },
    }).then(response => {
      dispatch({
        type: 'refreshToken',
        accessToken: response.data.accessToken
      });
      console.log(`refreshToken :` + response.data.accessToken);
    }).catch(error => {
      console.log(error);
      dispatch({
        type: 'logout',
      });
      console.log(JSON.stringify(user));
    })
  }
  return (

    <Stack.Navigator>
      {user.accessToken == '' ?
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} /> :
        <><Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="CreateTicket" component={CreateTicket} />
          <Stack.Screen name="TicketsDetail" component={TicketsDetail} />
          <Stack.Screen name="Ticket" component={Ticket} />
          <Stack.Screen name="AddLog" component={AddLog} />
        </>
      }
    </Stack.Navigator>
  );
}
const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <NavigationContainer>
          <StackScreenList />
        </NavigationContainer>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
