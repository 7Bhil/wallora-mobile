import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import Battle from './components/Battle';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const [tab, setTab] = useState('battle');

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        {tab === 'battle' ? <Battle /> : <Leaderboard />}
      </View>

      {/* Simple Bottom Navigation */}
      <View className="flex-row bg-gray-800 border-t border-gray-700 h-16 items-center justify-around">
        <TouchableOpacity onPress={() => setTab('battle')} className={`px-4 py-2 rounded-lg ${tab === 'battle' ? 'bg-blue-600' : ''}`}>
          <Text className={`font-bold ${tab === 'battle' ? 'text-white' : 'text-gray-400'}`}>⚔️ Jouer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setTab('leaderboard')} className={`px-4 py-2 rounded-lg ${tab === 'leaderboard' ? 'bg-yellow-600' : ''}`}>
          <Text className={`font-bold ${tab === 'leaderboard' ? 'text-white' : 'text-gray-400'}`}>🏆 Classement</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}
