import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export type ImageUploadResult = {
  base64: string;
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
};

export const imageService = {
  async pickImage(): Promise<ImageUploadResult | null> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];

    let base64String = asset.base64 || "";

    if (!base64String && asset.uri) {
      const base64Data = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: "base64",
      });
      base64String = base64Data;
    }

    return {
      base64: `data:image/jpeg;base64,${base64String}`,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileSize: asset.fileSize,
    };
  },

  async takePhoto(): Promise<ImageUploadResult | null> {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      throw new Error("Permissão de câmera negada");
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];

    let base64String = asset.base64 || "";

    if (!base64String && asset.uri) {
      const base64Data = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: "base64",
      });
      base64String = base64Data;
    }

    return {
      base64: `data:image/jpeg;base64,${base64String}`,
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      fileSize: asset.fileSize,
    };
  },

  validateImageSize(fileSize?: number, maxSizeMB: number = 5): boolean {
    if (!fileSize) return true;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return fileSize <= maxSizeBytes;
  },
};
