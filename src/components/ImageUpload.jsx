import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image.');
      }
    } catch (error) {
      toast.error('An error occurred while uploading the image.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Image Preview" className="w-64 h-64 object-cover" />}
      <Button onClick={handleUpload}>Upload Image</Button>
    </div>
  );
};

export default ImageUpload;