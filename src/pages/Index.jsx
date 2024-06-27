import React from 'react';
import ImageUpload from '../components/ImageUpload';

const Index = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl text-center">Upload Your Image</h1>
        <ImageUpload />
      </div>
    </div>
  );
};

export default Index;