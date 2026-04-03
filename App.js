import { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import Battle from './components/Battle';
import Leaderboard from './components/Leaderboard';
import Upload from './components/Upload';
import AuthScreen from './src/screens/AuthScreen';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

function MainApp() {
  const [tab, setTab] = useState('battle');
  const { user, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#a855f7" />
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      {/* Top Header */}
      <View className="flex-row justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
        <Text className="text-xl font-black text-transparent text-purple-400">WallBattle ⚔️</Text>
        <TouchableOpacity onPress={logout} className="bg-red-500/20 px-3 py-1 rounded-full">
          <Text className="text-red-400 font-bold text-xs">Logout</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        {tab === 'battle' && <Battle />}
        {tab === 'leaderboard' && <Leaderboard />}
        {tab === 'upload' && <Upload />}
      </View>

      {/* Simple Bottom Navigation */}
      <View className="flex-row bg-gray-800 h-[70px] items-center justify-around pb-2 shadow-lg">
        <TouchableOpacity onPress={() => setTab('battle')} className={`px-4 py-2 flex-col items-center rounded-lg ${tab === 'battle' ? 'bg-purple-600/20' : ''}`}>
          <Text className={`font-bold ${tab === 'battle' ? 'text-purple-400' : 'text-gray-400'}`}>⚔️ Jouer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setTab('leaderboard')} className={`px-4 py-2 flex-col items-center rounded-lg ${tab === 'leaderboard' ? 'bg-blue-600/20' : ''}`}>
          <Text className={`font-bold ${tab === 'leaderboard' ? 'text-blue-400' : 'text-gray-400'}`}>🏆 Top</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setTab('upload')} className={`px-4 py-2 flex-col items-center rounded-lg ${tab === 'upload' ? 'bg-emerald-600/20' : ''}`}>
          <Text className={`font-bold ${tab === 'upload' ? 'text-emerald-400' : 'text-gray-400'}`}>+ Upload</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
