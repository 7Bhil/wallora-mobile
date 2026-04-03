import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

// Variable d'environnement (si tu testes sur ton tel physique, remplace "10.0.2.2" par ton IP locale style 192.168.1.XX)
// Sinon "10.0.2.2" c'est l'IP par défaut pour atteindre le localhost depuis l'émulateur Android.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    const url = isLogin 
      ? `${API_URL}/api/auth/login` 
      : `${API_URL}/api/auth/register`;

    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin || data.token) {
          await login(data.token, data.user);
        } else {
          setIsLogin(true); // Redirection vers login en cas d'absence de JWT pre-generé
        }
      } else {
        setError(data.error || 'Identifiants invalides');
      }
    } catch (e) {
      setError('Serveur injoignable. L\'URL API est-elle correcte ?');
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 bg-gray-900 justify-center p-6">
      <View className="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl">
        <Text className="text-3xl font-extrabold text-transparent text-purple-400 text-center mb-2">Wallora</Text>
        <Text className="text-gray-400 text-center mb-8 font-medium">
          {isLogin ? 'Welcome back, curator.' : 'Join the digital circle.'}
        </Text>
        
        {error ? <Text className="bg-red-500/20 text-red-400 text-center p-2 rounded-lg mb-4 text-xs font-bold">{error}</Text> : null}

        {!isLogin && (
          <TextInput 
            className="bg-black/30 text-white px-4 py-3 rounded-xl mb-4 border border-white/5"
            placeholder="Username" placeholderTextColor="#6b7280"
            value={username} onChangeText={setUsername}
          />
        )}
        <TextInput 
          className="bg-black/30 text-white px-4 py-3 rounded-xl mb-4 border border-white/5"
          placeholder="Email Address" placeholderTextColor="#6b7280"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email} onChangeText={setEmail}
        />
        <TextInput 
          className="bg-black/30 text-white px-4 py-3 rounded-xl mb-6 border border-white/5"
          placeholder="Password" placeholderTextColor="#6b7280"
          secureTextEntry
          value={password} onChangeText={setPassword}
        />

        <TouchableOpacity 
          onPress={handleSubmit} disabled={loading}
          className="bg-purple-600 rounded-xl py-4 items-center shadow-lg"
        >
          {loading ? <ActivityIndicator color="white" /> : (
            <Text className="text-white font-bold text-lg">{isLogin ? 'Sign In' : 'Create Account'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="mt-8 items-center">
          <Text className="text-purple-300 font-bold text-sm">
            {isLogin ? "New here? Create an account" : "Already a curator? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
