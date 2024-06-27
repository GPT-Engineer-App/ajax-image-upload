import React, { useState } from 'react';

const ImageUpload = () => {
  const [previewSrc, setPreviewSrc] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Content = reader.result;
      localStorage.setItem('uploadedImage', base64Content);
      setUploadedImageUrl(base64Content);
      navigator.clipboard.writeText(base64Content).then(() => {
        alert('Image uploaded and Base64 string copied to clipboard!');
      }).catch(err => {
        alert('Failed to copy Base64 string to clipboard.');
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <h1>Upload Your Image</h1>
      <form id="uploadForm" onSubmit={handleSubmit}>
        <input type="file" id="fileInput" onChange={handleFileChange} />
        {previewSrc && <img id="preview" src={previewSrc} alt="Image Preview" />}
        <button type="submit">Upload Image</button>
      </form>
      {uploadedImageUrl && (
        <a id="uploadedImageUrl" href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
          View uploaded image
        </a>
      )}
    </div>
  );
};

export default ImageUpload;