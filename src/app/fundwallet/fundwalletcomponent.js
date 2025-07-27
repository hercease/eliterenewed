'use client'

import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Spinner,
  Button,
  Text,
  HStack,
  Fieldset,
  Field,
  Stack,
  Alert,
  Grid,
  Card,
  DataList
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { toaster } from "@/components/ui/toaster"
import { useColorModeValue } from "@/components/ui/color-mode"
import NavBar from '@/components/ui/sidebar'
import Link from 'next/link'
import { FiHash } from "react-icons/fi"
import { useForm  } from 'react-hook-form'
import { useRouter } from 'next/navigation' // For App Router
import Script from 'next/script'
import dynamic from 'next/dynamic';
const Paystack = dynamic(() => import('@paystack/inline-js'), { ssr: false });


export default function FundWalletComponent({ user }) {

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userdetails, setUserDetails] = useState(null)
  const [maxAmount, setMaxAmount] = useState(userdetails?.virtual_account.status > 0 ? 20000 : 5000)
  const { register, formState: { errors }, handleSubmit, getValues, reset, watch } = useForm({ mode: 'onChange' })
  const router = useRouter();
    
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
              ;
              console.log(resp);
    
          }
    
        fetchProfileInfo();

      }, [user]);

    async function Processpayment(ref, amt, username) {
      try {
      setIsLoading(true);
      const formData = new URLSearchParams();
      formData.append('reference', ref);
      formData.append('amount', amt);
      formData.append('username', username);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/processpayment`, {
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

      const result = await response.json();

      if(result.status){

        toaster.create({
            title: 'Success',
            description: `Wallet funding of ${amount} is successful`,
            duration: 5000,
            type: 'success',
            isClosable: true,
        });

          setTimeout(() => {
            router.push('/dashboard');
          }, 3000); // 3000ms = 3 seconds

      } else {

        toaster.error({
            title: 'Error',
            description: `Wallet funding is not successful at this time`,
            duration: 5000,
            type: 'success',
            isClosable: true,
        });

      }

      } catch (error) {
        console.error('Payment processing error:', error);

        toaster.error({
            title: 'Error',
            description: error.message,
            duration: 5000,
            type: 'success',
            isClosable: true,
        });
      }
    }

   const payWithPaystack = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const amount = watch('amount');
    if (!amount || isNaN(amount)) {
      toaster.create({
        title: 'Error',
        description: 'Please enter a valid amount',
        type: 'error',
      });
      return;
    }

    // Calculate amount with fee (1.6%)
    const percent = amount * 0.016;
    const finalAmount = parseFloat(percent) + parseInt(amount);
    const amountInKobo = Math.floor(finalAmount * 100);

    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
        email: userdetails?.data?.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: `ref_${Date.now()}`,
        callback: (response) => {
          //Processpayment(response.reference,amount,user);
          toaster.create({
            title: 'Success',
            description: "Transaction completed, awaiting confirmation",
            duration: 5000,
            type: 'success',
            isClosable: true,
          });

        },
        onClose: () => {
          toaster.create({
            title: 'Info',
            description: 'Payment window closed',
            type: 'info',
          });
        },
      });
      handler.openIframe();
    }
  };



  return (
    <>

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
              <FiHash /> Fund Wallet
            </HStack>
          </Heading>
        </Flex>
        
      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        <Card.Root background="white" maxW="sm" mb={5} color="black" placeSelf="center" variant="elevated" w={{ base: 'full', md: 'md' }}>
            <Card.Header>
              <Card.Title>Online Funding</Card.Title>
              <Card.Description>
                Fund your wallet with your debit card and other available channels
              </Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack>
                <form onSubmit={payWithPaystack}> {/* Wrap in form */}
                <Stack>
                  <Field.Root id="amount">
                    <Field.Label color="black">Enter Amount</Field.Label>
                    <InputGroup startElement="₦">
                      <Input 
                        placeholder="Enter amount" 
                        {...register('amount', { 
                          required: "Enter amount", 
                          max: maxAmount,
                          validate: value => value > 0 || "Amount must be greater than 0"
                        })} 
                        color="black" 
                        borderColor="#9ca3af" 
                      />
                    </InputGroup>
                    <Field.HelperText color="red">
                      {errors.amount?.message}
                      {errors.amount?.type === 'max' && `Maximum amount is ₦${maxAmount}`}
                    </Field.HelperText>
                  </Field.Root>

                  <Button
                    type="submit" // Change to submit button
                    background="#0060d1"
                    color="white"
                    isLoading={isLoading}
                    size="md"
                  >
                    Continue
                  </Button>
                </Stack>
              </form>
              </Stack>
            </Card.Body>
          </Card.Root>
        
          <Card.Root maxW="sm" mb="4" placeSelf="center" background="blue.700" variant="elevated">
            <Card.Header>
              <Card.Title>Automated Funding</Card.Title>
              {userdetails?.virtual_account.status > 0 && (
                <Card.Description>
                  Pay into the account details below and your wallet gets funded immediately
                </Card.Description>
              )}
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full" spacing={2}>

              {userdetails?.virtual_account.status === 0 && (
                  <p>Hi {userdetails?.data.username}, Kindly perform the KYC (Know your customer) to have access to the Automated funding, on successful activation, a bank account will be created mainly for funding your wallet on Elite Global Network. Click the button below to get started. <br /> <Button
                    background="#0060d1"
                    color="white" onClick={() => router.push('/kyc')}>Get started</Button></p>
              )}


              {userdetails?.virtual_account.status > 0 && (

                <DataList.Root orientation="horizontal">
     
                    <DataList.Item>
                      <DataList.ItemLabel>Bank Name</DataList.ItemLabel>
                      <DataList.ItemValue>{userdetails?.virtual_account.bank_name}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Account Name</DataList.ItemLabel>
                      <DataList.ItemValue>{userdetails?.virtual_account.acct_name}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Account Number</DataList.ItemLabel>
                      <DataList.ItemValue>{userdetails?.virtual_account.acct_number}</DataList.ItemValue>
                    </DataList.Item>
              
                </DataList.Root>

            )}
              </Stack>
            </Card.Body>
          </Card.Root>

          <Card.Root maxW="sm" placeSelf="center" background="black.700" variant="elevated">
            <Card.Header>
              <Card.Title>Manual Funding</Card.Title>
                <Card.Description>
                  Pay into the account details below and send the confirmation receipt the phone number on whatsapp 
                </Card.Description>
            </Card.Header>
            <Card.Body>
              <Stack gap="4" w="full" spacing={2}>

                <DataList.Root orientation="horizontal">
     
                    <DataList.Item>
                      <DataList.ItemLabel>Bank Name</DataList.ItemLabel>
                      <DataList.ItemValue>Jaiz Bank</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Account Name</DataList.ItemLabel>
                      <DataList.ItemValue>Faaz Tech Solution</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Account Number</DataList.ItemLabel>
                      <DataList.ItemValue>0014219322</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Phone Number</DataList.ItemLabel>
                      <DataList.ItemValue>08116666994</DataList.ItemValue>
                    </DataList.Item>
              
                </DataList.Root>

              </Stack>
            </Card.Body>
          </Card.Root>

        </Grid>
        
      </Box>
    </Box>

      <Script 
        src="https://js.paystack.co/v1/inline.js" 
        strategy="lazyOnload" 
        onLoad={() => console.log('Paystack loaded')}
        onError={() => console.error('Paystack failed to load')}
      />

   </>
  )
}