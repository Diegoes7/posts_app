import React, { useState, ChangeEvent } from 'react';
import { Avatar, Box, Button, Input, Stack, Text } from '@chakra-ui/react';

const AvatarUploader: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageSrc(event.target.value);
    setFile(null); // Clear the file selection if URL is being used
  };

  const handleClear = () => {
    setImageSrc('');
    setFile(null);
  };

  return (
    <Box>
      <Box mt={4}>
        <Avatar size="xl" src={imageSrc} />
      </Box>
      <Stack spacing={4}>
        <Text>Upload an image from your computer or enter an image URL:</Text>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Input placeholder="Enter image URL" value={imageSrc} onChange={handleUrlChange} />
        <Button onClick={handleClear}>Clear</Button>
      </Stack>
    </Box>
  );
};

export default AvatarUploader;
