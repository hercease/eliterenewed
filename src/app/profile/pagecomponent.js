'use client'

import {
  Box,
  Flex,
  Heading,
  Dialog,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  DataList,
  Icon,
  Portal,
  Field,
  Stack,
  CloseButton
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { toaster } from "@/components/ui/toaster"
import NavBar from '@/components/ui/sidebar'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useForm  } from 'react-hook-form'
const FiUser = dynamic(() =>
  import('react-icons/fi').then(mod => mod.FiUser), {
  ssr: false,
  loading: () => null
})

export default function ProfilePageComponent({user}) {

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

          console.log(resp);

      }

    fetchProfileInfo();
  }, [user]);

   

  return (

      <Box minH="100vh" bg="gray.50">

        <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} /> 

        <Box p={6} color="black">
            <Flex justify="space-between" align="center" mb={8}>
                <Heading size="lg">Profile Page</Heading>
            </Flex>

             <DataList.Root orientation="horizontal" divideY="1px" maxW="md">
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Username</DataList.ItemLabel>
                    <DataList.ItemValue>{userdetails?.data.username}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Email</DataList.ItemLabel>
                    <DataList.ItemValue>{userdetails?.data.email}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Sponsor</DataList.ItemLabel>
                    <DataList.ItemValue>{userdetails?.data.sponsor}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Reg Date</DataList.ItemLabel>
                    <DataList.ItemValue>{userdetails?.data.reg_date}</DataList.ItemValue>
                </DataList.Item>
             </DataList.Root>
           
        </Box>
     </Box> 
  )
}