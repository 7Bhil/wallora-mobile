import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Image } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';
const SCREEN_H = Dimensions.get('window').height;

export default function Battle() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(null);

  const optimizeImage = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_800/');
  };

  const fetchWallpapers = async () => {
    setLoading(true);
    setVoted(null);
    try {
      const res = await fetch(`${API_URL}/api/wallpapers/battle`);
      if (res.ok) setWallpapers(await res.json());
      else setWallpapers([]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchWallpapers(); }, []);

  const handleVote = async (winnerId, loserId, side) => {
    if (voted) return;
    setVoted(side);
    try {
      await fetch(`${API_URL}/api/wallpapers/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId })
      });
    } catch (e) { console.error(e); }
    setTimeout(() => fetchWallpapers(), 800);
  };

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: '#0d0914', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#a855f7" />
      <Text style={{ color: '#6b7280', marginTop: 12, fontWeight: '700' }}>Preparing the Arena...</Text>
    </View>
  );

  if (wallpapers.length < 2) return (
    <View style={{ flex: 1, backgroundColor: '#0d0914', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>⚔️</Text>
      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20, marginBottom: 8, textAlign: 'center' }}>Arena is Empty</Text>
      <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 13, fontWeight: '500' }}>Upload at least 2 wallpapers in Studio to start battling.</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0d0914' }}>
      {/* Header */}
      <View style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22, letterSpacing: -0.5 }}>Arena</Text>
        <Text style={{ color: '#6b7280', fontSize: 12, fontWeight: '600' }}>Vote for the superior wallpaper</Text>
      </View>

      {/* Left Wallpaper */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleVote(wallpapers[0]._id, wallpapers[1]._id, 'left')}
        style={{
          flex: 1, marginHorizontal: 12, marginBottom: 6, borderRadius: 24, overflow: 'hidden',
          opacity: voted === 'right' ? 0.3 : 1,
          borderWidth: voted === 'left' ? 3 : 0,
          borderColor: '#a855f7',
        }}
      >
        <Image source={{ uri: optimizeImage(wallpapers[0].url) }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={{ flex: 1, backgroundColor: 'rgba(26,10,46,0.3)' }}>
          <View style={{ position: 'absolute', inset: 0, zIndex: 2, backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'center', alignItems: 'center' }} />
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13, position: 'absolute', bottom: 14, left: 14, zIndex: 3, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>ELO {wallpapers[0].eloScore}</Text>
        </View>
      </TouchableOpacity>

      {/* VS badge */}
      <View style={{ alignItems: 'center', marginVertical: 4 }}>
        <View style={{ backgroundColor: '#120820', borderWidth: 1, borderColor: '#3b1d6e', borderRadius: 99, paddingHorizontal: 16, paddingVertical: 6 }}>
          <Text style={{ color: '#6b7280', fontWeight: '900', fontSize: 11, letterSpacing: 3 }}>VS</Text>
        </View>
      </View>

      {/* Right Wallpaper */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleVote(wallpapers[1]._id, wallpapers[0]._id, 'right')}
        style={{
          flex: 1, marginHorizontal: 12, marginTop: 6, marginBottom: 12, borderRadius: 24, overflow: 'hidden',
          opacity: voted === 'left' ? 0.3 : 1,
          borderWidth: voted === 'right' ? 3 : 0,
          borderColor: '#a855f7',
        }}
      >
        <Image source={{ uri: optimizeImage(wallpapers[1].url) }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} resizeMode="cover" />
        <View style={{ flex: 1, backgroundColor: 'rgba(26,10,46,0.3)' }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13, position: 'absolute', bottom: 14, left: 14, zIndex: 3, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>ELO {wallpapers[1].eloScore}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
