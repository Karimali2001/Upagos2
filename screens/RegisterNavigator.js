//navegador para las distantas paginas del proceso de registro
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Register from './Register'
import RegisterVerification from './RegisterVerification'
import RegisterWithCamera from './RegisterWithCamera'
import Success from './Success'

const Stack = createStackNavigator()

const RegisterNavigator = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen
          name='RegisterVerification'
          component={RegisterVerification}
        />
        <Stack.Screen
          name='RegisterWithCamera'
          component={RegisterWithCamera}
        />
        <Stack.Screen name='Success' component={Success} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RegisterNavigator
