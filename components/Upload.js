import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import { AuthContext } from '../src/context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.34.132.51:3000';

const SUGGESTED_TAGS = ['#Neon', '#Cyber', '#Dark', '#4K', '#Space', '#Nature'];

export default function Upload() {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState(['#Neon', '#Cyber']);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState(''); // 'success' | 'error'
  const { token } = useContext(AuthContext);

  const pickImage = async () => {
    setMessage('');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const removeTag = (t) => setTags(tags.filter(x => x !== t));
  const addTag = (t) => {
    if (!t.trim()) return;
    const tag = t.startsWith('#') ? t : `#${t}`;
    if (!tags.includes(tag)) setTags([...tags, tag]);
    setTagInput('');
  };

  const uploadImage = async () => {
    if (!image) { setMsgType('error'); setMessage('Please select an image.'); return; }
    setUploading(true); setMessage('');

    const formData = new FormData();
    const filename = image.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    formData.append('image', { uri: image.uri, name: filename, type: match ? `image/${match[1]}` : 'image' });

    try {
      const res = await fetch(`${API_URL}/api/wallpapers/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setMsgType('success'); setMessage('Published to the Arena! 🚀');
        setImage(null); setTitle(''); setTags(['#Neon', '#Cyber']);
      } else {
        const err = await res.json();
        setMsgType('error'); setMessage(err.error || 'Upload failed.');
      }
    } catch { setMsgType('error'); setMessage('Network error.'); }
    setUploading(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0d0914' }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16, letterSpacing: 2 }}>Studio</Text>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#1a0a2e', borderWidth: 1, borderColor: '#3b1d6e', alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="user" size={16} color="#c084fc" />
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
        <Text style={{ color: '#9ca3af', fontSize: 10, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>New Submission</Text>
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 28, letterSpacing: -0.5 }}>
          Share your <Text style={{ color: '#a855f7' }}>Vision</Text><Text style={{ color: '#a855f7' }}>.</Text>
        </Text>
      </View>

      {/* Drop Zone */}
      <TouchableOpacity onPress={pickImage} style={{ marginHorizontal: 20, marginTop: 20, borderRadius: 20, borderWidth: 1.5, borderColor: '#2d1a4e', borderStyle: 'dashed', overflow: 'hidden', aspectRatio: 16/9 }}>
        {image ? (
          <Image source={{ uri: image.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#120820', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#2d1a4e', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Feather name="upload-cloud" size={24} color="#a855f7" />
            </View>
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>Tap to Upload</Text>
            <Text style={{ color: '#6b7280', fontSize: 11, marginTop: 4 }}>Supports PNG, JPG, WEBP</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 20, marginTop: 20, gap: 16 }}>
        {/* Title */}
        <View>
          <Text style={{ color: '#6b7280', fontSize: 9, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Wallpaper Title</Text>
          <TextInput
            value={title} onChangeText={setTitle}
            placeholder="Celestial Resonance"
            placeholderTextColor="#374151"
            style={{ backgroundColor: '#120820', borderWidth: 1, borderColor: '#1f0f35', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: '#fff', fontSize: 14, fontWeight: '600' }}
          />
        </View>

        {/* Tags */}
        <View>
          <Text style={{ color: '#6b7280', fontSize: 9, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Tags (separated by space)</Text>
          <View style={{ backgroundColor: '#120820', borderWidth: 1, borderColor: '#1f0f35', borderRadius: 12, padding: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tags.map(t => (
              <TouchableOpacity key={t} onPress={() => removeTag(t)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2d1a4e', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 }}>
                <Text style={{ color: '#c084fc', fontSize: 11, fontWeight: '700' }}>{t}</Text>
                <Text style={{ color: '#7c3aed', fontSize: 10 }}>×</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              value={tagInput} onChangeText={setTagInput}
              onSubmitEditing={() => addTag(tagInput.trim())}
              placeholder="Add more..."
              placeholderTextColor="#374151"
              style={{ color: '#9ca3af', fontSize: 12, minWidth: 80, paddingVertical: 4 }}
            />
          </View>
        </View>

        {/* Status */}
        {message ? (
          <View style={{ backgroundColor: msgType === 'success' ? '#083a1e' : '#3a0808', borderWidth: 1, borderColor: msgType === 'success' ? '#166534' : '#7f1d1d', borderRadius: 12, padding: 14 }}>
            <Text style={{ color: msgType === 'success' ? '#4ade80' : '#f87171', fontWeight: '700', fontSize: 13 }}>{message}</Text>
          </View>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={uploadImage} disabled={uploading || !image}
          style={{
            backgroundColor: !image || uploading ? '#1a0a2e' : '#7c3aed',
            borderRadius: 16, paddingVertical: 16,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            shadowColor: '#a855f7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: image && !uploading ? 0.4 : 0, shadowRadius: 12, elevation: image && !uploading ? 8 : 0
          }}
        >
          {uploading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Text style={{ color: !image ? '#4b5563' : '#fff', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 }}>Publish to Arena</Text>
              {image && <Text style={{ color: '#fff', fontSize: 16 }}>→</Text>}
            </>
          )}
        </TouchableOpacity>

        <Text style={{ color: '#374151', fontSize: 10, textAlign: 'center', lineHeight: 16 }}>
          By publishing, you agree that this artwork is your own original creation and follows the Wallora community standards.
        </Text>
      </View>
    </ScrollView>
  );
}
