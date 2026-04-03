import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, 
  ActivityIndicator, FlatList, Dimensions, Alert, TextInput
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.34.132.51:3000';
const SCREEN_W = Dimensions.get('window').width;

export default function ProfileScreen({ setTab }) {
  const { token, user, logout, login } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wallpapers');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');

  const optimizeImage = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/q_auto,f_auto,w_600/');
  };

  const fetchProfile = () => {
    setLoading(true);
    fetch(`${API_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { 
        setProfile(data); 
        setLoading(false); 
        setNewUsername(data.user.username);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
      });
      const data = await res.json();
      if (res.ok) {
        await login(token, { ...user, username: newUsername });
        setIsEditing(false);
        fetchProfile();
        Alert.alert('Succès', 'Profil mis à jour !');
      } else {
        Alert.alert('Erreur', data.error || 'Mise à jour échouée');
      }
    } catch (e) {
      Alert.alert('Erreur', 'Connexion impossible');
    }
  };

  const handleDeleteWallpaper = (id) => {
    Alert.alert(
      'Supprimer',
      'Es-tu sûr de vouloir supprimer ce fond d\'écran ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/api/wallpapers/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              });
              if (res.ok) {
                fetchProfile();
              } else {
                Alert.alert('Erreur', 'Suppression échouée');
              }
            } catch (e) {
              Alert.alert('Erreur', 'Connexion impossible');
            }
          }
        }
      ]
    );
  };

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: '#0d0914', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#a855f7" />
    </View>
  );

  const stats = profile?.stats || { votesCast: 0, totalUploads: 0, totalPrestige: 0 };
  const wallpapers = profile?.wallpapers || [];

  return (
    <View style={{ flex: 1, backgroundColor: '#0d0914' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10 }}>
          <View style={{ width: 24 }} />
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 3 }}>WALLORA</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={{ color: '#ef4444', fontSize: 13, fontWeight: '700' }}>LOGOUT</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + Info */}
        <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 20 }}>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#a855f7', overflow: 'hidden', backgroundColor: '#1a0a2e' }}>
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.username}` }}
                style={{ width: '100%', height: '100%' }}
              />
            </View>
            <View style={{ position: 'absolute', bottom: -6, left: '50%', marginLeft: -30, backgroundColor: '#7c3aed', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 }}>
              <Text style={{ color: '#fff', fontSize: 8, fontWeight: '900', letterSpacing: 1 }}>LEVEL 15</Text>
            </View>
          </View>

          {isEditing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 }}>
              <TextInput
                value={newUsername}
                onChangeText={setNewUsername}
                style={{ backgroundColor: '#1a0a2e', color: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#a855f7', minWidth: 150 }}
                autoFocus
              />
              <TouchableOpacity onPress={handleUpdateProfile} style={{ backgroundColor: '#a855f7', padding: 8, borderRadius: 8 }}>
                <Feather name="check" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={{ backgroundColor: '#374151', padding: 8, borderRadius: 8 }}>
                <Feather name="x" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
                {user?.username || 'Curator'}
              </Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Feather name="edit-2" size={16} color="#a855f7" />
              </TouchableOpacity>
            </View>
          )}
          
          <Text style={{ color: '#6b7280', fontSize: 13, marginTop: 2, fontWeight: '500' }}>@{(user?.username || 'curator').toLowerCase().replace(/ /g, '_')}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#1a0a2e', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99, borderWidth: 1, borderColor: '#3b1d6e' }}>
            <Text style={{ color: '#9ca3af', fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>✦ LEVEL 15 CURATOR</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 28 }}>
          {[
            { value: '1.2K', label: 'VOTES CAST' },
            { value: stats.totalUploads || 45, label: 'WALLPAPERS' },
            { value: '2,450', label: 'ELO SCORE' },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: '#120820', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: '#1f0f35' }}>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginBottom: 4 }}>{s.value}</Text>
              <Text style={{ color: '#6b7280', fontSize: 9, fontWeight: '700', letterSpacing: 1, textAlign: 'center' }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#1f0f35' }}>
          {['My Wallpapers', 'History', 'Saved'].map((t, i) => {
            const key = t.toLowerCase().replace(' ', '_');
            const isActive = (i === 0 && activeTab === 'wallpapers') || (i === 1 && activeTab === 'history') || (i === 2 && activeTab === 'saved');
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveTab(i === 0 ? 'wallpapers' : i === 1 ? 'history' : 'saved')}
                style={{ marginRight: 24, paddingBottom: 12, borderBottomWidth: isActive ? 2 : 0, borderBottomColor: '#a855f7' }}
              >
                <Text style={{ color: isActive ? '#fff' : '#6b7280', fontWeight: '700', fontSize: 13 }}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Wallpaper Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12, paddingBottom: 120 }}>
          {wallpapers.map((wp, index) => (
            <View key={wp._id} style={{ width: (SCREEN_W - 44) / 2, borderRadius: 20, overflow: 'hidden', backgroundColor: '#1a0a2e', aspectRatio: 0.75, position: 'relative' }}>
              <Image source={{ uri: optimizeImage(wp.url) }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />
                <View className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-md z-10 border border-white/5">
                  <Text className="text-white font-black text-[8px] tracking-widest">#{index + 1}</Text>
                </View>
                <TouchableOpacity 
                   onPress={() => handleDeleteWallpaper(wp._id)}
                   style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(239, 68, 68, 0.8)', borderRadius: 10, padding: 6, zIndex: 20 }}
                >
                  <Feather name="trash-2" size={14} color="#fff" />
                </TouchableOpacity>
                <View style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 13, marginBottom: 2 }}>Image #{index + 1}</Text>
                <View style={{ height: 3, backgroundColor: '#ffffff20', borderRadius: 10, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: '78%', backgroundColor: '#a855f7', borderRadius: 10 }} />
                </View>
                <Text style={{ color: '#9ca3af', fontSize: 9, fontWeight: '700', marginTop: 2 }}>78% WR</Text>
              </View>
            </View>
          ))}

          {/* Upload New Entry Button */}
          <TouchableOpacity 
            onPress={() => setTab && setTab('upload')}
            style={{ width: (SCREEN_W - 44) / 2, borderRadius: 20, borderWidth: 1.5, borderColor: '#2d1a4e', borderStyle: 'dashed', aspectRatio: 0.75, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0d0914' }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#1a0a2e', borderWidth: 1, borderColor: '#3b1d6e', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Text style={{ color: '#7c3aed', fontSize: 22, fontWeight: '300' }}>+</Text>
            </View>
            <Text style={{ color: '#6b7280', fontSize: 10, fontWeight: '700', letterSpacing: 0.5, textAlign: 'center', textTransform: 'uppercase' }}>Upload New{'\n'}Entry</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
