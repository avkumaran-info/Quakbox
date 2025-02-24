import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState('');
  const chunkSize = 45 * 1024 * 1024; // 45MB per chunk

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getUploadKey = async () => {
    try {
      const { data } = await axios.get(`https://${window.APP_DOMAIN}/admin/api/get-upload-key`);
      setUploadKey(data.upload_key);
      return data.upload_key;
    } catch (error) {
      console.error('Error getting upload key:', error);
      alert('Error getting upload key.');
      return null;
    }
  };

  const uploadChunk = async (chunk, index, totalChunks, key) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('index', index);
    formData.append('total_chunks', totalChunks);
    formData.append('file_name', file.name);
    formData.append('upload_key', key);

    try {
      await axios.post(`https://${window.APP_DOMAIN}/admin/api/upload-video-chunk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress((prevProgress) => Math.max(prevProgress, percentage));
        },
      });
    } catch (error) {
      console.error('Error uploading chunk:', error);
      alert('Error uploading chunk.');
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');
    setUploading(true);

    const key = await getUploadKey();
    if (!key) {
      setUploading(false);
      return;
    }

    const totalChunks = Math.ceil(file.size / chunkSize);
    let start = 0;
    let end = chunkSize;

    // Create an array of promises for each chunk upload
    const uploadPromises = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = file.slice(start, end);
      uploadPromises.push(uploadChunk(chunk, i + 1, totalChunks, key));
      start = end;
      end = Math.min(file.size, end + chunkSize);
    }

    // Execute all chunk uploads asynchronously
    await Promise.all(uploadPromises);

    // After all chunks are uploaded, merge them
    await axios.post(`https://${window.APP_DOMAIN}/admin/api/merge-video-chunks`, {
      file_name: file.name,
      total_chunks: totalChunks,
      upload_key: key,
    });

    setUploading(false);
    alert('File uploaded successfully!');
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? `Uploading ${progress}%` : 'Upload'}
      </button>
    </div>
  );
};

export default VideoUpload;
