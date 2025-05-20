"use client"
import React, { useState } from 'react';

function ImageToBase64() {
  const [base64, setBase64] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setBase64(result);
        // If you want to log the new value, do it here:
        console.log('Base64:', result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {base64 && (
        <>
          <h3>Base64 Encoded String:</h3>
          <textarea
            readOnly
            value={base64}
            style={{ width: '100%', height: '150px' }}
          />
          <h3>Preview:</h3>
          <img src={base64} alt="Preview" style={{ maxWidth: '300px' }} />
        </>
      )}
    </div>
  );
}

export default ImageToBase64;
