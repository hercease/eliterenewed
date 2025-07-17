'use client'

import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  Icon,
  Fieldset,
  Field,
  Stack
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { toaster } from "@/components/ui/toaster"
import { useColorModeValue } from "@/components/ui/color-mode"
import NavBar from '@/components/ui/sidebar'
import Link from 'next/link'

export default function FundWalletComponent({ user }) {

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userdetails, setUserDetails] = useState(null)
    
    useEffect(() => {
    
        if (!user) return;
    
          const fetchProfileInfo = async () => {
              
              const formData = new URLSearchParams()
              formData.append('username', user)
    
              const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString(),
              });
    
              const resp = await res.json();
              setUserDetails(resp);
    
              //console.log(resp);
    
          }
    
        fetchProfileInfo();
      }, [user]);

   const handleSubmit = async (e) => {
    
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
        toaster.create({
            title: 'Error',
            description: 'Please fill in all fields',
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
      
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On successful login
      toaster.create({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (error) {
      toaster.create({
        title: 'Login failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (

      <Box minH="100vh" bg="gray.50">
        <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} /> 

        <Box p={6} color="black">
            <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg">Fund Wallet</Heading>
            </Flex>

            <form onSubmit={handleSubmit}>

                <Stack mb="2" spacing={2}>

                    <Field.Root  id="presentpassword">
                        <Field.Label color="black">Enter Amount</Field.Label>
                        <InputGroup startElement="₦">
                            <Input placeholder="Enter Amount" color="black" borderColor="#9ca3af" />
                        </InputGroup>

                    </Field.Root>

                </Stack>

                <Button
                    background="#0060d1"
                    color="white"
                    type="submit"
                    isLoading={isLoading}
                    size="md"
                    w="full"
                >
                    Continue
                </Button>

            </form>
        </Box>
    ` </Box> 
  )
}