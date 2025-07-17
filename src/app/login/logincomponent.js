'use client';

import { useRouter } from 'next/navigation';
import { Button, Card, Field, Input, Stack, Flex, Box, Heading, Text, Checkbox } from "@chakra-ui/react"
import { PasswordInput } from "@/components/ui/password-input"
import { toaster } from "@/components/ui/toaster"
import Image from 'next/image';
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm  } from 'react-hook-form'
import { parseCookies, setCookie, destroyCookie } from 'nookies';

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
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      p={{ base: 4, md: 0 }}
    >
       <Card.Root background="white" borderWidth="1px" borderColor="gray.400" shadow="sm" color="black" w={{ base: 'full', md: 'md' }}>
            <Card.Header>
                <Image src="/elite_png.png" alt="elite Image" width={145} height={55}  />
                <Card.Title>Welcome back</Card.Title>
                    <Card.Description>
                        Sign in to your account
                    </Card.Description>
                </Card.Header>
            <Card.Body>
            <Stack spacing={6}>
            
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <Stack mb="2" spacing={4}>
                <Field.Root id="email">
                    <Field.Label color="black">Username</Field.Label>
                    <Input {...register('username',{ required: "Enter username"  })} placeholder='Enter username' variant="outline" borderColor="#9ca3af" />
                    <Field.HelperText color="red">{errors.username?.message}</Field.HelperText>
                </Field.Root>
                
                <Field.Root id="password">
                    <Field.Label color="black">Password</Field.Label>
                    <PasswordInput {...register('password',{ required: "Enter password"  })} placeholder='Enter Password' color="black" borderColor="#9ca3af" />
                    <Field.HelperText color="red">{errors.password?.message}</Field.HelperText>
                </Field.Root>
                </Stack>

                <Stack direction="row" justify="space-between" align="center" mb="5" >
                    <Link href="/forgot-password" color="blue.500">
                        Forgot password?
                    </Link>
                </Stack>

                <Button
                    background="#0060d1"
                    color="white"
                    type="submit"
                    loading={isLoading}
                    size="md"
                    w="full"
                >
                    Sign in
                </Button>

            </form>
            
            
            <Text align="center" fontSize="sm" color="gray.600">
                Don{`'`}t have an account?{' '}
                <Link href="/register" color="brand.500" fontWeight="medium">
                Sign up
                </Link>
            </Text>
            </Stack>
      </Card.Body>
      </Card.Root>
    </Flex>
  );
}


