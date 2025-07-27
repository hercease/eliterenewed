'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Field, Input, Stack, Flex, Box, Text, InputGroup } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { toaster } from "@/components/ui/toaster"
import Image from 'next/image';
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm  } from 'react-hook-form'
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { FiUser, FiUnlock } from "react-icons/fi";

export default function LoginComponent() {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, formState: { errors }, handleSubmit, getValues, reset, watch } = useForm({ mode: 'onChange' })

  const handleFormSubmit = async (data) => {

    setIsLoading(true);
    
    try {

        const formData = new URLSearchParams();
        formData.append('username', data.username);
        formData.append('password', data.password);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/runlogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const resp = await response.json();
        console.log(resp);

        if (resp.status) {
            // Save token to cookies
            setCookie(null, 'elitetoken', resp?.message, { 
                maxAge: 30 * 24 * 60 * 60, 
                path: '/',
                secure: true,
                sameSite: 'strict',
            });

            // Show success toast
            toaster.create({
                title: 'Success',
                description: "Login successful! Redirecting to dashboard...",
                duration: 5000,
                type: 'success',
                isClosable: true,
            });

            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000); // 3000ms = 3 seconds

        } else {
            toaster.create({
                title: 'Error',
                description: resp.message,
                status: 'error',
                duration: 5000,
                type: 'error',
                isClosable: true,
            });
        }
    } catch (error) {
        toaster.create({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 5000,
            type: 'error',
            isClosable: true,
        });
    } finally {
        setIsLoading(false);
    }
};

  return (
    <Flex
      direction="column"
      minH="100vh"
      bg="gray.50"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat"
      bgSize="auto"
      px={4}
    >
       
        <Flex flex="1" justify="center" align="center">
            <Box w={{ base: '100%', sm: '400px' }} p={8} >
                <Flex justify="flex-start" mb={4}>
                    <Box textAlign="right">
                    <Image src="/elite_png.png" alt="elite" width={140} height={50} />
                    <Text fontSize="sm" color="gray.600">Welcome back, Sign in to your account</Text>
                    </Box>
                </Flex>
            <Stack spacing={6}>
            
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Stack mb="2" spacing={4}>
                <Field.Root id="username">
                    <Field.Label color="black">Username</Field.Label>
                    <InputGroup startElement={<FiUser />}>
                        <Input {...register('username',{ required: "Enter username"  })} size="lg" placeholder='Enter username' color="black" borderColor="#9ca3af" />
                    </InputGroup>
                    <Field.HelperText color="red">{errors.username?.message}</Field.HelperText>
                </Field.Root>
                
                <Field.Root id="password">
                    <Field.Label color="black">Password</Field.Label>
                    <InputGroup startElement={<FiUnlock />}>
                        <PasswordInput {...register('password',{ required: "Enter password"  })} size="lg" placeholder='Enter Password' color="black" borderColor="#9ca3af" />
                    </InputGroup>
                    <Field.HelperText color="red">{errors.password?.message}</Field.HelperText>
                </Field.Root>
                </Stack>

                <Stack direction="row" justify="space-between" align="center" color="black" mb="5" >
                    <Link href="/forgot-password" color="blue.500">
                        Forgot password?
                    </Link>
                </Stack>

                <Button
                    background="#7d7f81ff"
                    color="white"
                    type="submit"
                    loading={isLoading}
                    size="md"
                    w="full"
                >
                    Sign in
                </Button>

            </form>
            
            

            <Text mt={4} fontSize="sm" textAlign="center" color="gray.600">
                Don{`'`}t have an account?{' '}
                <Link href="/register" passHref>
                    <Text as="span" color="blue.500" fontWeight="medium">Sign up</Text>
                </Link>
            </Text>

            </Stack>
            </Box>
    </Flex>
    </Flex>
  );
}


