import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'sonner';

const FillBanner = () => {
  const [banner1Files, setBanner1Files] = useState([]);
  const [banner2Files, setBanner2Files] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/api/v1/banner/getimages');
        setUploadedImages(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (e, setBanner, bannerType) => {
    const alreadyUploaded = uploadedImages.filter(img => img.bannerType === bannerType).length;
    const maxFiles = Math.min(5 - alreadyUploaded, e.target.files.length);
    if (maxFiles <= 0) return toast.warning('Max 5 images allowed per banner');
    setBanner(Array.from(e.target.files).slice(0, maxFiles));
  };

  const handleUpload = async (bannerType, files) => {
    if (files.length === 0) return toast.warning('Select images first');

    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('bannerType', bannerType);

    try {
      const res = await api.post('/api/v1/banner/upload-banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedImages(prev => [...prev, ...res.data.images]);
      toast.success('Images uploaded successfully');
      if (bannerType === 'banner1') setBanner1Files([]);
      else setBanner2Files([]);
    } catch (error) {
      console.error(error);
      toast.error('Upload failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete('/api/v1/banner/delete', { data: { id } });
      setUploadedImages(prev => prev.filter(img => img._id !== id));
      toast.success('Image deleted');
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  const renderBanner = (bannerType, files, setFiles) => {
    const alreadyUploaded = uploadedImages.filter(img => img.bannerType === bannerType).length;

    return (
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{bannerType.toUpperCase()}</h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e, setFiles, bannerType)}
            disabled={alreadyUploaded >= 5}
          />
          <button
            onClick={() => handleUpload(bannerType, files)}
            disabled={files.length === 0}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Upload
          </button>
          <span style={{ color: '#888' }}>{alreadyUploaded}/5 uploaded</span>
        </div>

        {/* Preview of selected files */}
        {files.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {files.map((file, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Uploaded images */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {uploadedImages
            .filter(img => img.bannerType === bannerType)
            .map(img => (
              <div key={img._id} style={{ position: 'relative', width: '120px', height: '80px' }}>
                <img
                  src={img.url}
                  alt="banner"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }}
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    lineHeight: '20px',
                    textAlign: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {renderBanner('banner1', banner1Files, setBanner1Files)}
      {renderBanner('banner2', banner2Files, setBanner2Files)}
    </div>
  );
};

export default FillBanner;
