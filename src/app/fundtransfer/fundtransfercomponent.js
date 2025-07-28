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
  HStack,
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
import {
  FiUser,
  FiCreditCard,
} from 'react-icons/fi'

export default function FundTransferComponent({user}) {

  const [showCurrent, setShowCurrent] = useState(false)
  const [open, setOpen] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  const [recipient, setRecipient] = useState('')
  const { register, formState: { errors }, handleSubmit, getValues, reset, watch } = useForm({ mode: 'onChange' })
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
 
  const onSubmit = (data) => {
    setOpen(true);
    setAmount(data.amount);
    setRecipient(data.recipient);
  };

  const handleConfirmedSubmit = async (data) => { 
      setOpen(false);
      setIsLoading(true);
      const formData = new URLSearchParams()
      formData.append('username', user)
      formData.append('amount', data.amount)
      formData.append('recipient', data.recipient)
      
      console.log(formData.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fundtransfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const resp = await res.json();

      setIsLoading(false);

      if (!res.ok) {
        const text =  resp.text();
          toaster.create({
              title: 'Error',
              description: `Server error ${resp.status}: ${text}`,
              status: 'error',
              duration: 7000,
              type: "error"
          })
          return;
      }

      if (resp.status) {

        toaster.create({ title: 'Success', description: resp?.message, type: 'success', duration: 7000 });

        reset();

      } else {
        toaster.create({ title: 'Error', description: resp?.message, type: 'error', duration: 7000 });
      }
  }

  return (

      <Box
        minH="100vh" 
        bg="gray.50"
        bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
        bgRepeat="repeat"
        bgSize="auto"
      >

          <Dialog.Root
            key="center"
            placement="center"
            motionPreset="slide-in-bottom"
            closeOnInteractOutside={false}
            lazyMount 
            open={open}
            bgColor="white"
            onOpenChange={(e) => setOpen(e.open)}
          >
            
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>You are about to process the following transaction?</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemLabel>Recipient</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {recipient ? recipient : ''}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Amount</DataList.ItemLabel>
                    <DataList.ItemValue>
                      ₦ {amount ? Number(amount).toLocaleString() : 0}
                    </DataList.ItemValue>
                  </DataList.Item>


                  </DataList.Root>

                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button onClick={() => handleConfirmedSubmit(watch())} variant="outline">Continue</Button>
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

        <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username}  /> 

        <Box p={6} color="black">

            <Flex justify="space-between" align="center" mb={3}>
              <Heading color="black" size="lg">
                <HStack spacing={2}>
                  <FiCreditCard /> Wallet Transfer 
                </HStack>
              </Heading>
            </Flex>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Stack mb="2" spacing={2}>

                    <Field.Root  id="">
                        <Field.Label color="black">Enter Amount</Field.Label>
                        <InputGroup startElement="₦">
                            <Input placeholder="Enter Amount" color="black" borderColor="#9ca3af" {...register("amount",{ required: "Enter transfer amount" })}  />
                        </InputGroup>
                        <Field.HelperText color="blue">Wallet Balance : ₦{userdetails?.data.account_balance?.toLocaleString()}</Field.HelperText>
                        <Field.HelperText color="red">{errors.amount?.message}</Field.HelperText>
                    </Field.Root>

                    <Field.Root  id="">
                        <Field.Label color="black">Recipient Username</Field.Label>
                        <InputGroup startElement={<FiUser />}>
                            <Input placeholder="Enter Recipient Username" color="black" borderColor="#9ca3af" {...register("recipient",{ required: "Enter recipient username" })} />
                        </InputGroup>
                        <Field.HelperText color="red">{errors.recipient?.message}</Field.HelperText>
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
  )
}