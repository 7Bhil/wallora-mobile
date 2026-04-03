import './global.css';
import { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Battle from './components/Battle';
import Leaderboard from './components/Leaderboard';
import Upload from './components/Upload';
import AuthScreen from './src/screens/AuthScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

const TABS = [
  { id: 'battle',   label: 'Arena',     icon: 'crosshairs' },
  { id: 'upload',   label: 'Upload',    icon: 'upload-cloud' },
  { id: 'leaderboard', label: 'Ranking', icon: 'bar-chart-2' },
  { id: 'profile',  label: 'Profile',   icon: 'user' },
];

function MainApp() {
  const [tab, setTab] = useState('battle');
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: '#0d0914', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#a855f7" />
    </View>
  );

  if (!user) return <AuthScreen />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0d0914' }}>
      <StatusBar style="light" />

      {/* Content */}
      <View style={{ flex: 1 }}>
        {tab === 'battle'      && <Battle />}
        {tab === 'upload'      && <Upload />}
        {tab === 'leaderboard' && <Leaderboard />}
        {tab === 'profile'     && <ProfileScreen />}
      </View>

      {/* Bottom Navigation */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#0a0710',
        borderTopWidth: 1,
        borderTopColor: '#1f0f35',
        height: 70,
        paddingBottom: 8,
        paddingHorizontal: 8,
      }}>
        {TABS.map(t => {
          const isActive = tab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                backgroundColor: isActive ? '#2d1a4e' : 'transparent',
                marginHorizontal: 3,
                paddingVertical: 6,
              }}
            >
              <Feather name={t.icon} size={20} color={isActive ? '#c084fc' : '#6b7280'} style={{ marginBottom: 4 }} />
              <Text style={{
                color: isActive ? '#c084fc' : '#6b7280',
                fontSize: 9,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>{t.label.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
