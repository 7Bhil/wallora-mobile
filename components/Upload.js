import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../src/context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000';

export default function Upload() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useContext(AuthContext);

  const pickImage = async () => {
    setMessage('');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Permet le crop carré si l'utilisateur le veut
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image) return setMessage('Aucune image sélectionnée.');
    
    setUploading(true);
    setMessage('');
    
    const formData = new FormData();
    const filename = image.uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('image', {
      uri: image.uri,
      name: filename,
      type
    });

    try {
      const res = await fetch(`${API_URL}/api/wallpapers/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (res.ok) {
        setMessage('Succès ! Fond d\'écran envoyé. 🚀');
        setImage(null);
      } else {
        const errorData = await res.json();
        setMessage('Erreur: ' + (errorData.error || 'Impossible d\'uploader'));
      }
    } catch (e) {
      setMessage('Erreur d\'accès au serveur.');
    }
    setUploading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      <Text className="text-2xl font-extrabold text-white mb-2">New Contribution</Text>
      <Text className="text-gray-400 text-center mb-8 font-medium">Select a high-quality wallpaper from your camera roll.</Text>
      
      {message ? <Text className="bg-purple-900/40 border border-purple-500/50 text-purple-300 font-bold p-3 rounded-lg text-center w-full mb-6 relative z-50">{message}</Text> : null}

      {image ? (
         <View className="items-center w-full">
            <Image source={{ uri: image.uri }} className="w-full h-[350px] rounded-2xl mb-6 bg-black/40" resizeMode="cover" />
            <TouchableOpacity onPress={uploadImage} disabled={uploading} className="bg-purple-600 w-full py-4 flex flex-row justify-center items-center rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              {uploading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Publish Wallpaper</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setImage(null)} className="mt-4 p-2">
              <Text className="text-gray-500 font-bold text-sm hover:text-gray-400">Cancel & choose another</Text>
            </TouchableOpacity>
         </View>
      ) : (
        <TouchableOpacity onPress={pickImage} className="bg-emerald-600 w-full py-5 rounded-xl shadow-[0_0_15px_rgba(5,150,105,0.4)] items-center">
          <Text className="text-white font-bold text-lg text-center">Open Photo Gallery</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
