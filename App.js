import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';

import Ajuda from './src/screens/Ajuda';
import Community from './src/screens/Community';
import Login from './src/screens/Login';
import Cadastro from './src/screens/Cadastro';
import CadastroOngFigma from './src/screens/CadastroOngFigma';
import CadastroProjetoSocial from './src/screens/CadastroProjetoSocial';
import Inicio from './src/screens/Inicio';
import QuemSomos from './src/screens/QuemSomos';
import OngDashboard from './src/screens/OngDashboard';
import VoluntarioDashboard from './src/screens/VoluntarioDashboard';
import FeedSolidario from './src/screens/FeedSolidario';
import CriarPublicacao from './src/screens/CriarPublicacao';
import BottomNavigation from './src/components/BottomNavigation';
import { FeedProvider } from './src/context/FeedContext';
import { getSession, restoreSession } from './src/services/api';

const Stack = createNativeStackNavigator();

function getActiveRouteName(state) {
  const route = state?.routes?.[state.index];
  if (!route) return 'Inicio';
  if (route.state) return getActiveRouteName(route.state);
  if (["OngDashboard", "VoluntarioDashboard"].includes(route.name)) return route.params?.tab === "Perfil" ? "Login" : "VoluntarioDashboard";
  return route.name;
}

export default function App() {
  const [ready, setReady] = useState(false);
  useEffect(() => { restoreSession().finally(() => setReady(true)); }, []);
  const session = getSession();
  const initialRouteName = session?.user?.role === "ORGANIZATION"
    ? "OngDashboard"
    : session?.user?.role === "VOLUNTEER"
      ? "VoluntarioDashboard"
      : "Inicio";
  const navigationRef = useRef(null);
  const [activeRoute, setActiveRoute] = useState(initialRouteName);

  if (!ready) return <View style={{ flex: 1 }} />;
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => setActiveRoute(getActiveRouteName(state))}
    >
      <FeedProvider>
        <View style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ajuda" component={Ajuda} />
        <Stack.Screen name="Community" component={Community} />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
        />

        <Stack.Screen
          name="QuemSomos"
          component={QuemSomos}
        />

        <Stack.Screen
          name="OngDashboard"
          component={OngDashboard}
        />

        <Stack.Screen
          name="VoluntarioDashboard"
          component={VoluntarioDashboard}
        />

        <Stack.Screen
          name="FeedSolidario"
          component={FeedSolidario}
        />

        <Stack.Screen
          name="CriarPublicacao"
          component={CriarPublicacao}
        />

        <Stack.Screen
          name="Login"
          component={Login}
        />

        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
        />

        <Stack.Screen
          name="CadastroOngFigma"
          component={CadastroOngFigma}
        />

        <Stack.Screen
          name="CadastroProjetoSocial"
          component={CadastroProjetoSocial}
        />
          </Stack.Navigator>
          <BottomNavigation
            activeRoute={activeRoute}
            onNavigate={(route) => {
              const role = getSession()?.user?.role;
              const dashboard = role === "ORGANIZATION" ? "OngDashboard" : role === "VOLUNTEER" ? "VoluntarioDashboard" : "Login";
              if (["Login", "VoluntarioDashboard"].includes(route)) navigationRef.current?.navigate(dashboard, { tab: route === "Login" ? "Perfil" : "Eventos" });
              else navigationRef.current?.navigate(route === "CriarPublicacao" && !role ? "Login" : route);
            }}
          />
        </View>
      </FeedProvider>
    </NavigationContainer>
  );
}
