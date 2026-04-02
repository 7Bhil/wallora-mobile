import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Platform } from 'react-native';

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/wallpapers' : 'http://localhost:3000/api/wallpapers';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/leaderboard`);
        if (res.ok) setLeaderboard(await res.json());
      } catch (e) {
        console.warn(e);
      }
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#fcd34d" /></View>;

  return (
    <ScrollView className="flex-1 pt-8 px-4">
      <Text className="text-2xl font-bold text-yellow-400 text-center mb-6">🔥 Top Fonds d'Écran</Text>
      
      {leaderboard.length === 0 && <Text className="text-gray-400 text-center">Aucun fond d'écran classé.</Text>}

      <View className="flex flex-row flex-wrap justify-between gap-y-4 pb-12">
        {leaderboard.map((wp, index) => (
          <View key={wp._id} className="w-[48%] bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <View className="absolute top-1 left-1 bg-black/70 px-2 rounded z-10">
              <Text className="text-white font-bold text-xs">#{index + 1}</Text>
            </View>
            <Image source={{ uri: wp.url }} className="w-full h-32" resizeMode="cover" />
            <View className="p-2 items-center">
              <Text className="text-blue-300 font-bold text-sm">Elo: {wp.eloScore}</Text>
              <Text className="text-gray-400 text-xs">{wp.wins}V / {wp.matches}M</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
