//navegador para las paginas del proceso de consulta de pagos
//por fecha
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Queries from './Queries';
import Payments from './Payments';

const Stack = createStackNavigator();

const QueryNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Queries" component={Queries} />
        <Stack.Screen name="Payments" component={Payments} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default QueryNavigator;
