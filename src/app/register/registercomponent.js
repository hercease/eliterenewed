'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Field,
  Input,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  InputGroup
} from "@chakra-ui/react";
import { PasswordInput } from "@/components/ui/password-input";
import { toaster } from "@/components/ui/toaster";
import Image from 'next/image'; 
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { setCookie } from 'nookies'; // You forgot to import this
import { FiUser, FiUnlock, FiMail, FiUserPlus  } from "react-icons/fi";
import { useSearchParams } from 'next/navigation'

export default function RegisterComponent() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: 'onChange' });

  const handleFormSubmit = async (data) => {
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', data.username);
      formData.append('password', data.password);
      formData.append('confirm_password', data.confirm_password);
      formData.append('sponsor', data.sponsor);
      formData.append('email', data.email);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/runregistration`, {
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

      if (resp.status) {

        toaster.create({
          title: 'Success',
          description: resp.message,
          duration: 5000,
          type: 'success',
          isClosable: true,
        });

      } else {

        toaster.create({
          title: 'Error',
          description: resp.message,
          duration: 5000,
          type: 'error',
          isClosable: true,
        });

      }
    } catch (error) {

      toaster.create({
        title: 'Error',
        description: error.message,
        duration: 5000,
        type: 'error',
        isClosable: true,
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const searchParams = useSearchParams()
  const userType = searchParams.get('user') // 'FREE'

  console.log(userType)



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
      {/* Logo and Description */}
      

      {/* Center Form */}
      <Flex flex="1" justify="center" align="center">
        <Box w={{ base: '100%', sm: '400px' }} p={8} >
            <Flex justify="flex-start" mb={4}>
                <Box textAlign="right">
                <Image src="/elite_png.png" alt="elite" width={140} height={50} />
                <Text fontSize="sm" color="gray.600">Sign up an account today</Text>
                </Box>
            </Flex>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Stack spacing={5}>

              <Field.Root>
                <Field.Label color="black">Username</Field.Label>
                <InputGroup startElement={<FiUser />}>
                    <Input
                    {...register('username', { required: "Enter username" })}
                    placeholder="Enter username"
                    color="black"
                    borderColor="#9ca3af"
                    />
                </InputGroup>
                <Field.HelperText color="red">{errors.username?.message}</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label color="black">Email</Field.Label>
                <InputGroup startElement={<FiMail />}>
                    <Input
                    type="email"
                    {...register('email', { required: "Enter email" })}
                    placeholder="Enter email"
                    color="black"
                    borderColor="#9ca3af"
                    />
                </InputGroup>
                <Field.HelperText color="red">{errors.email?.message}</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label color="black">Password</Field.Label>
                <InputGroup startElement={<FiUnlock />}>
                <PasswordInput
                  {...register('password', { required: "Enter password" })}
                  placeholder="Enter password"
                  color="black"
                  borderColor="#9ca3af"
                />
                </InputGroup>
                <Field.HelperText color="red">{errors.password?.message}</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label color="black">Repeat Password</Field.Label>
                <InputGroup startElement={<FiUnlock />}>
                <PasswordInput
                  {...register('confirm_password', { required: "Confirm password" })}
                  placeholder="Confirm password"
                  color="black"
                  borderColor="#9ca3af"
                />
                </InputGroup>
                <Field.HelperText color="red">{errors.confirm_password?.message}</Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label color="black">Sponsor (Optional)</Field.Label>
                <InputGroup startElement={<FiUserPlus />}>
                <Input
                  {...register('sponsor')}
                  placeholder="Enter sponsor username"
                  color="black"
                  borderColor="#9ca3af"
                  value={userType}
                />
                </InputGroup>
              </Field.Root>

              <Button
                mt={4}
                type="submit"
                background="#7d7f81ff"
                color="white"
                loading={isLoading}
                w="full"
              >
                Sign Up
              </Button>
            </Stack>
          </form>

          <Text mt={4} fontSize="sm" textAlign="center" color="gray.600">
            Already registered?{' '}
            <Link href="/login" passHref>
              <Text as="span" color="blue.500" fontWeight="medium">Sign in</Text>
            </Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}
