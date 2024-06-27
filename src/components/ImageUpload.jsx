import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [repoName, setRepoName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

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
    if (!file || !repoName || !ownerName || !accessToken) {
      toast.error('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const fileName = file.name;
    const fileContent = await file.text();
    const base64Content = btoa(fileContent);

    const data = {
      message: `Upload image ${fileName}`,
      content: base64Content,
    };

    try {
      const response = await fetch(`https://api.github.com/repos/${ownerName}/${repoName}/contents/${fileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setUploadedImageUrl(responseData.content.html_url);
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
      <Input type="text" placeholder="Repository Name" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
      <Input type="text" placeholder="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
      <Input type="password" placeholder="Personal Access Token" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
      <Input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Image Preview" className="w-64 h-64 object-cover" />}
      <Button onClick={handleUpload}>Upload Image</Button>
      {uploadProgress > 0 && <Progress value={uploadProgress} />}
      {uploadedImageUrl && (
        <div className="mt-4">
          <p>Image uploaded successfully! View it <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">here</a>.</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;