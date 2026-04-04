import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';

import { API_URL } from '../src/config';
const API_BASE = `${API_URL}/api`;

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'users'
  const [imageLeaderboard, setImageLeaderboard] = useState([]);
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Compression helper
  const optimizeImage = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_600/');
  };

  useEffect(() => {
    const fetchLeaderboards = async () => {
      setLoading(true);
      try {
        const [resImages, resUsers] = await Promise.all([
          fetch(`${API_BASE}/wallpapers/leaderboard`),
          fetch(`${API_BASE}/users/leaderboard`)
        ]);
        
        if (resImages.ok) setImageLeaderboard(await resImages.json());
        if (resUsers.ok) setUserLeaderboard(await resUsers.json());
      } catch (e) {
        console.warn(e);
      }
      setLoading(false);
    };
    fetchLeaderboards();
  }, []);

  if (loading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#fcd34d" /></View>;

  return (
    <View className="flex-1 bg-gray-900 pt-8 px-4">
      <Text className="text-2xl font-bold text-yellow-400 text-center mb-6 tracking-widest uppercase">Rankings</Text>
      
      {/* Tabs */}
      <View className="flex-row bg-gray-800 rounded-xl p-1 mb-6 border border-gray-700">
        <TouchableOpacity 
          onPress={() => setActiveTab('images')}
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'images' ? 'bg-purple-600' : 'bg-transparent'}`}
        >
          <Text className={`font-bold ${activeTab === 'images' ? 'text-white' : 'text-gray-400'}`}>Images</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('users')}
          className={`flex-1 py-3 rounded-lg items-center ${activeTab === 'users' ? 'bg-purple-600' : 'bg-transparent'}`}
        >
          <Text className={`font-bold ${activeTab === 'users' ? 'text-white' : 'text-gray-400'}`}>Curators</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 'images' && (
          <View className="flex flex-row flex-wrap justify-between gap-y-4 pb-12">
            {imageLeaderboard.length === 0 && <Text className="text-gray-400 text-center w-full">Aucun fond d'écran classé.</Text>}
            {imageLeaderboard.map((wp, index) => (
              <View key={wp._id} className="w-[48%] bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <View className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md z-10 border border-white/5">
                  <Text className="text-white font-black text-xs tracking-widest">#{index + 1}</Text>
                </View>
                <Image source={{ uri: optimizeImage(wp.url) }} className="w-full h-40" resizeMode="cover" />
                <View className="p-3 bg-gray-800">
                  <Text className="text-yellow-400 font-extrabold text-sm mb-1">ELO {wp.eloScore}</Text>
                  <Text className="text-gray-500 text-xs font-medium">{wp.wins}V / {wp.matches}M</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'users' && (
          <View className="pb-12">
            {userLeaderboard.length === 0 && <Text className="text-gray-400 text-center w-full">Aucun curateur classé.</Text>}
            {userLeaderboard.map((user, index) => (
              <View key={user._id} className="flex-row items-center bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700">
                <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center mr-4 border border-gray-600">
                  <Text className="text-white font-bold text-sm">{index + 1}</Text>
                </View>
                <View className="w-14 h-14 rounded-full bg-purple-900 overflow-hidden border-2 border-purple-500 mr-4">
                  <Image source={{ uri: `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}` }} className="w-full h-full" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">{user.username}</Text>
                  <Text className="text-gray-400 text-xs mt-1">{user.wallpapersCount} upload{user.wallpapersCount > 1 ? 's' : ''}</Text>
                </View>
                <View className="items-end bg-black/30 px-3 py-2 rounded-lg border border-white/5">
                  <Text className="text-purple-400 font-extrabold text-xs mb-1">PRESTIGE</Text>
                  <Text className="text-white font-black text-lg">{user.totalPrestige}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
