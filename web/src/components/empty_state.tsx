// components/EmptyState.tsx
import React from 'react';
import { Box, Text, VStack, Icon } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

type EmptyStateProps = {
  message: string;
  icon?: React.ElementType;
};

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon = InfoIcon }) => {
  return (
    <Box py={10} px={4} w="100%" textAlign="center">
      <VStack spacing={4}>
        <Icon as={icon} boxSize={8} color="gray.400" />
        <Text fontSize="md" color="gray.500">
          {message}
        </Text>
      </VStack>
    </Box>
  );
};

export default EmptyState;
