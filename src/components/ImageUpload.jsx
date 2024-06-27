import React, { useEffect } from 'react';
import $ from 'jquery';

const ImageUpload = () => {
  useEffect(() => {
    $('#uploadForm').on('submit', async function (e) {
      e.preventDefault();

      const file = $('#fileInput')[0].files[0];
      const repoName = $('#repoName').val();
      const ownerName = $('#ownerName').val();
      const accessToken = $('#accessToken').val();

      if (!file || !repoName || !ownerName || !accessToken) {
        alert('Please fill in all fields and select a file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async function () {
        const base64Content = btoa(reader.result);

        const data = {
          message: `Upload image ${file.name}`,
          content: base64Content,
        };

        try {
          const response = await fetch(`https://api.github.com/repos/${ownerName}/${repoName}/contents/${file.name}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const responseData = await response.json();
            $('#uploadedImageUrl').attr('href', responseData.content.html_url).text('View uploaded image');
            alert('Image uploaded successfully!');
          } else {
            alert('Failed to upload image.');
          }
        } catch (error) {
          alert('An error occurred while uploading the image.');
        }
      };

      reader.readAsBinaryString(file);
    });

    $('#fileInput').on('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
          $('#preview').attr('src', reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        $('#preview').attr('src', '');
      }
    });
  }, []);

  return (
    <div className="container">
      <h1>Upload Your Image</h1>
      <form id="uploadForm">
        <input type="text" id="repoName" placeholder="Repository Name" />
        <input type="text" id="ownerName" placeholder="Owner Name" />
        <input type="password" id="accessToken" placeholder="Personal Access Token" />
        <input type="file" id="fileInput" />
        <img id="preview" alt="Image Preview" />
        <button type="submit">Upload Image</button>
      </form>
      <a id="uploadedImageUrl" target="_blank" rel="noopener noreferrer"></a>
    </div>
  );
};

export default ImageUpload;