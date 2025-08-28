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
import { FiAtSign, FiUnlock } from "react-icons/fi";

export default function ForgotComponent() {

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
        formData.append('email', data.email);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/forgotpassword`, {
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

            // Show success toast
            toaster.create({
                title: 'Success',
                description: resp.message,
                duration: 8000,
                type: 'success',
                isClosable: true,
            });

        } else {
            toaster.create({
                title: 'Error',
                description: resp.message,
                status: 'error',
                duration: 8000,
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
                    <Text fontSize="sm" color="gray.600">Forgot Password, we got you covered</Text>
                    </Box>
                </Flex>
            <Stack spacing={6}>
            
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Stack mb="2" spacing={4}>
                <Field.Root id="username">
                    <Field.Label color="black">Enter Email</Field.Label>
                    <InputGroup startElement={<FiAtSign  />}>
                        <Input {...register('email',{ required: "Enter your registered email address"  })} size="lg" placeholder='Enter registered email address' color="black" borderColor="#9ca3af" />
                    </InputGroup>
                    <Field.HelperText color="red">{errors.email?.message}</Field.HelperText>
                </Field.Root>
                </Stack>

                <Button
                    background="#7d7f81ff"
                    color="white"
                    type="submit"
                    loading={isLoading}
                    size="md"
                    w="full"
                >
                    Continue
                </Button>

            </form>

            <Text mt={4} fontSize="sm" textAlign="center" color="gray.600">
                Remember Password?{' '}
                <Link href="/login" passHref>
                    <Text as="span" color="blue.500" fontWeight="medium">Sign in</Text>
                </Link>
            </Text>

            </Stack>
            </Box>
    </Flex>
    </Flex>
  );
}


