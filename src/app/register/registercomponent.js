'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Field, Input, Stack, Flex, Box, Heading, Text, Checkbox } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { toaster } from "@/components/ui/toaster"
import Image from 'next/image';
import Link from 'next/link'

export default function RegisterComponent() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      p={{ base: 4, md: 0 }}
    >
       <Card.Root background="white" borderWidth="1px" borderColor="gray.400" shadow="sm" color="black" w={{ base: 'full', md: 'md' }}>
            <Card.Header>
                <Image src="/elite_png.png" alt="elite Image" width={145} height={55}  />
                <Card.Title>Welcome here</Card.Title>
                    <Card.Description>
                        Sign up an account today
                    </Card.Description>
                </Card.Header>
            <Card.Body>
            <Stack spacing={6}>
            
            <form onSubmit={handleSubmit}>
                <Stack mb="2" spacing={4}>

                    <Field.Root>
                        <Field.Label color="black">Username</Field.Label>
                        <Input type="text" placeholder='Enter username' variant="outline" borderColor="#9ca3af" />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color="black">Email</Field.Label>
                        <Input type="email" placeholder='Enter username' variant="outline" borderColor="#9ca3af" />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color="black">Password</Field.Label>
                        <PasswordInput placeholder='Enter Password' color="black" borderColor="#9ca3af" />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color="black">Repeat Password</Field.Label>
                        <Input type="email" placeholder='Repeat password' variant="outline" borderColor="#9ca3af" />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label color="black">Sponsor(Optional)</Field.Label>
                        <Input placeholder='Enter sponsor username' color="black" borderColor="#9ca3af" />
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
                    Sign Up
                </Button>

            </form>
            
            
            <Text align="center" fontSize="sm" color="gray.600">
                Already registered ?{' '}
                <Link href="/login" color="brand.500" fontWeight="medium">
                Sign in
                </Link>
            </Text>
            </Stack>
      </Card.Body>
      </Card.Root>
    </Flex>
  );
}

// Simple icon components (you can replace with actual icons)
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
