// components/TransactionItem.js
'use client'

import {
  Card,
  Flex,
  Box,
  Text,
  Avatar,
} from '@chakra-ui/react'

export default function TransactionItem({ type, amount, timestamp, icon, colorScheme }) {
  return (
    <Card.Root p="3" borderRadius="lg" bg="white" boxShadow="sm">
      <Card.Body p="0">
        <Flex align="center">
            <Avatar.Root>
                <Avatar.Fallback 
                    size="sm"
                    bg={`${colorScheme}.100`}
                    icon={icon}
                    color={`${colorScheme}.600`}
                    mr="3" 
                 />
            </Avatar.Root>
          <Box flex="1">
            <Text fontWeight="medium">{type}</Text>
            <Text fontSize="xs" color="gray.500">{timestamp}</Text>
          </Box>
          <Text fontWeight="bold" color={`${colorScheme}.600`}>
            ₦{amount}
          </Text>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}
