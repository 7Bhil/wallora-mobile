import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/wallpapers' : 'http://localhost:3000/api/wallpapers';

export default function Battle() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWallpapers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/battle`);
      if (res.ok) {
        setWallpapers(await res.json());
      } else {
        setWallpapers([]);
      }
    } catch (e) {
      console.warn('Erreur réseau. Assurez-vous que le serveur tourne.', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchWallpapers(); }, []);

  const handleVote = async (winnerId, loserId) => {
    try {
      await fetch(`${API_BASE}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId })
      });
      fetchWallpapers();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#3b82f6" /></View>;
  
  if (wallpapers.length < 2) return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-red-500 font-bold text-center text-lg">Il faut au moins 2 images dans la base pour lancer un duel !</Text>
    </View>
  );

  return (
    <View className="flex-1 items-center pt-8">
      <Text className="text-xl font-bold text-white mb-6">Quel est votre préféré ?</Text>
      
      <View className="w-full flex-col items-center gap-6 px-4">
        {/* Image 1 */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="w-full"
          onPress={() => handleVote(wallpapers[0]._id, wallpapers[1]._id)}
        >
          <Image source={{ uri: wallpapers[0].url }} className="w-full h-48 rounded-xl border-4 border-transparent" resizeMode="cover" />
        </TouchableOpacity>

        <Text className="text-2xl font-black text-gray-400">VS</Text>

        {/* Image 2 */}
        <TouchableOpacity 
          activeOpacity={0.8}
          className="w-full"
          onPress={() => handleVote(wallpapers[1]._id, wallpapers[0]._id)}
        >
          <Image source={{ uri: wallpapers[1].url }} className="w-full h-48 rounded-xl border-4 border-transparent" resizeMode="cover" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
