'use client'

import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Text,
  Icon,
  Fieldset,
  Field,
  Stack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { toaster } from "@/components/ui/toaster"
import NavBar from '@/components/ui/sidebar'
import { PasswordInput } from "@/components/ui/password-input"
import Link from 'next/link'
import { useForm  } from 'react-hook-form'
import { FiKey } from "react-icons/fi";

export default function ChangePasswordComponent({user}) {

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userdetails, setUserDetails] = useState(null)
  const { register, formState: { errors }, handleSubmit, getValues, reset, watch } = useForm({ mode: 'onChange' })
    
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
    
              console.log(resp);
    
          }
    
        fetchProfileInfo();
      }, [user]);
 

    const onSubmit = async (data) => {
      setIsLoading(true)
      const formData = new URLSearchParams();
      formData.append('old_password', data.old_password);
      formData.append('new_password', data.new_password);
      formData.append('confirm_password', data.confirm_password);
      formData.append('username', user);

      //console.log(formData.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/changepassword`,{
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
      if(resp.status){

          toaster.create({
            title: 'Success',
            description: resp?.message,
            duration: 5000,
            type: 'success',
            isClosable: true,
          });

          setIsLoading(false)

      } else {

          toaster.create({
            title: 'Error',
            description: resp?.message,
            duration: 5000,
            type: 'error',
            isClosable: true,
          });

          setIsLoading(false)
      }
          
    };

  

  return (
      <Box 
        minH="100vh"
        bg="gray.50"
        bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
        bgRepeat="repeat"
        bgSize="auto"
      >
        <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} /> 

        <Box p={6} color="black">

            <Flex justify="space-between" align="center" mb={3}>
              <Heading color="black" size="lg">
                <HStack spacing={2}>
                  <FiKey /> Change Password
                </HStack>
              </Heading>
            </Flex>
            
          <Box minW={{ base: "90%", md: "400px", lg: "500px" }} placeSelf="center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack mb="2" spacing={2}>
                <Field.Root id="presentpassword">
                    <Field.Label color="black">Present Password</Field.Label>
                    <PasswordInput {...register('old_password',{ required: "Enter current password"  })} placeholder='Enter your current password' color="black" borderColor="#9ca3af" />
                    <Field.HelperText color="red">{errors.old_password?.message}</Field.HelperText>
                </Field.Root>

                <Field.Root id="newpassword">
                    <Field.Label color="black">New Password</Field.Label>
                    <PasswordInput {...register('new_password',{ required: "Enter new password"  })} placeholder='Enter your new Password' color="black" borderColor="#9ca3af" />
                    <Field.HelperText color="red">{errors.new_password?.message}</Field.HelperText>
                </Field.Root>
                
                <Field.Root id="confirmpassword">
                    <Field.Label color="black">Confirm Password</Field.Label>
                    <PasswordInput {...register('confirm_password',{ required: "Confirm new password"  })} placeholder='Confirm your Password' color="black" borderColor="#9ca3af" />
                    <Field.HelperText color="red">{errors.confirm_password?.message}</Field.HelperText>
                </Field.Root>
                </Stack>

                <Button
                    background="#0060d1"
                    color="white"
                    type="submit"
                    loading={isLoading}
                    size="md"
                    w="full"
                >
                    Continue
                </Button>

            </form>
            </Box>
        </Box>
    </Box> 
  )
}