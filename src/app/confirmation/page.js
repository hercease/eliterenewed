'use client'

import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Spinner,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function ConfirmationComponent() {

    const [status, setStatus] = useState('loading') // 'loading', 'success', 'already', 'error'
    const [message, setMessage] = useState('')
    const router = useRouter()
    const searchParams = useSearchParams()
    const user = searchParams.get('user')

    console.log(user);

  useEffect(() => {
    if (!user) {
      setStatus('error')
      setMessage('No user information provided.')
      return
    }

    const confirmAccount = async () => {
      try {
        const formData = new URLSearchParams()
        formData.append('username', user)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/confirmaccount`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        })

        const data = await res.json()

        if (data.status === true) {
          setStatus('success')
          setMessage('Your account has been successfully activated.')
        } else {
          setStatus('already')
          setMessage(data.message || 'Your account has already been activated.')
        }
      } catch (error) {
        console.error('Activation error:', error)
        setStatus('error')
        setMessage('Something went wrong. Please try again later.')
      }
    }

    confirmAccount()
  }, [user])

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <Center>
          <Spinner size="xl" />
        </Center>
      )
    }

    const isSuccess = status === 'success'
    const isError = status === 'error'
    const isAlready = status === 'already'

    return (
      <Box maxW="lg" mx="auto" mt={10} textAlign="center">
        <Alert.Root status={isSuccess ? 'success' : 'info'} variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="auto" borderRadius="md" py={6}>
          <Alert.Indicator boxSize="40px" mr={0} />
          <Alert.Title mt={4} mb={1} fontSize="lg">
            {isSuccess ? 'Account Activated' : isAlready ? 'Already Activated' : 'Error'}
          </Alert.Title>
          <Alert.Description maxWidth="sm">{message}</Alert.Description>
        </Alert.Root>

        <Stack mt={6} align="center">
          <Button
            colorPalette="blue"
            size="md"
            onClick={() => router.push('/login')}
          >
            Go to Login
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50" px={4} py={10}>
      <Center>
        <Heading as="h1" size="lg" mb={4}>
          Account Confirmation
        </Heading>
      </Center>
      {renderContent()}
    </Box>
  )
}
