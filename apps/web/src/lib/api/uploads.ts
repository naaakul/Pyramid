import { apiFetch } from './client';

interface UploadSignature { timestamp: number; signature: string; folder: string; apiKey: string; cloudName: string; }

export async function uploadToCloudinary(file: File): Promise<{ url: string; name: string }> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File exceeds 5MB limit');
  }
  const sig = await apiFetch<UploadSignature>('/uploads/signature');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return { url: data.secure_url, name: file.name };
}