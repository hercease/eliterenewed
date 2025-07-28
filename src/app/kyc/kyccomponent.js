'use client'

import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  CloseButton,
  Button,
  Text,
  Icon,
  HStack,
  Field,
  Stack,
  Alert,
  List,
  createListCollection,
  useSelectContext,
  Dialog,
  Portal,
  NativeSelect
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { toaster } from "@/components/ui/toaster"
import { useColorModeValue } from "@/components/ui/color-mode"
import NavBar from '@/components/ui/sidebar'
import Link from 'next/link'
import { FiUser, FiHardDrive, FiSmartphone } from "react-icons/fi"
import { useForm  } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export default function KycComponent({ user }) {

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userdetails, setUserDetails] = useState(null)
  const [banks, setBanks] = useState([])
  const [open, setOpen] = useState(false)
  const { register, formState: { errors }, handleSubmit, getValues, reset, watch } = useForm({ mode: 'onChange' })
  const router = useRouter()
    
    useEffect(() => { 
    
        if (!user) return;
    
          const fetchProfileInfo = async () => {
              
              const formData = new URLSearchParams()
              formData.append('username', user)

            try {

            const [profileRes, banksRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString(),
                }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchbanklist`, {
                    method: 'POST',
                }),
            ]);

            const [profileData, banksData] = await Promise.all([
                profileRes.json(),
                banksRes.json()
            ]);

            console.log(profileData);

            setUserDetails(profileData);
            setBanks(banksData.message);           // You’ll need to define this state

            } catch (error) {
                console.error('Error fetching data:', error);
            }
    
    
          }
    
        fetchProfileInfo();

      }, [user]);

      //console.log(banks);

    /*const frameworks = useMemo(() => {
        if (!banks?.length) return createListCollection({ items: [] })
        return createListCollection({ items: banks })
      }, [banks])*/

    const onSubmit = (data) => {
      setOpen(true);
    }

    const refreshData = () => {
      router.refresh() // Soft refresh (no full reload)
    }

  const handleFormSubmit = async (data) => {
    
        setIsLoading(true);
        
        try {
    
            const formData = new URLSearchParams();
            formData.append('firstname', data.firstname);
            formData.append('middlename', data.middlename);
            formData.append('lastname', data.lastname);
            formData.append('phone', data.phone);
            formData.append('account_number', data.account_number);
            formData.append('bank_code', data.bank_code);
            formData.append('bvn', data.bvn);
            formData.append('username', user);
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/createvirtualwallet`, {
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
            //console.log(resp);
    
            if (resp.status) {
                // Show success toast
                toaster.create({
                    title: 'Success',
                    description: resp.message,
                    duration: 7000,
                    type: 'success',
                    isClosable: true,
                });

                refreshData();
    
            } else {
                toaster.create({
                    title: 'Error',
                    description: resp.message,
                    status: 'error',
                    duration: 7000,
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
    <Box
      minH="100vh" 
      bg="gray.50"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat"
      bgSize="auto"
    >
      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />

      <Box maxW="lg" placeSelf="center" p={6} color="black">

        <Flex mb={8}>
          <Heading size="lg">Kyc Registration</Heading>
        </Flex>

        {userdetails?.virtual_account.reason != "" && (
          <Alert.Root mb={4} status="info">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Info</Alert.Title>
              <Alert.Description>
                {userdetails?.virtual_account.reason}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        {userdetails?.virtual_account.status == 'pending' && (
          <Alert.Root status="info" colorPalette="teal">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Hi {userdetails?.data.username}</Alert.Title>
              <Alert.Description>
                To ensure the security of your account and comply with regulatory requirements, we kindly ask you to complete your KYC (Know Your Customer) verification.
                <br /><br />
                Completing your KYC will:
                <List.Root>
                  <List.Item>
                    Help us protect your account from unauthorized access
                  </List.Item>
                  <List.Item>
                    Allow you to access higher transaction limits
                  </List.Item>
                  <List.Item>
                    Enable faster resolution of issues and withdrawals
                  </List.Item>
                  <List.Item>
                    Give you access to special offers and promotions
                  </List.Item>
                </List.Root>
                <br />
                Your information is 100% secure and will only be used for verification purposes in accordance with our privacy policy.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

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
                                  <Dialog.Title>Confirmation</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    You sure you want to proceed?
                                </Dialog.Body>
                                <Dialog.Footer>
                                  <Dialog.ActionTrigger asChild>
                                    <Button onClick={() => handleFormSubmit(watch())} variant="outline">Continue</Button>
                                  </Dialog.ActionTrigger>
                                </Dialog.Footer>
                                <Dialog.CloseTrigger asChild>
                                  <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                              </Dialog.Content>
                            </Dialog.Positioner>
                          </Portal>
                        </Dialog.Root>

        {userdetails?.virtual_account.status == "pending" && (

           <form onSubmit={handleSubmit(onSubmit)}>

          <Stack mb="2" mt="5" spacing={2}>
            <Field.Root id="firstname">
              <Field.Label color="black">First Name</Field.Label>
              <InputGroup startElement={<FiUser />}>
                <Input placeholder="Enter First Name" {...register('firstname',{ required: "Enter firstname"  })} color="black" borderColor="#9ca3af" />
              </InputGroup>
              <Field.HelperText color="red">{errors.firstname?.message}</Field.HelperText>
            </Field.Root>

            <Field.Root id="middlename">
              <Field.Label color="black">Middle Name</Field.Label>
              <InputGroup startElement={<FiUser />}>
                <Input placeholder="Enter Middle Name" {...register('middlename',{ required: "Enter middlename"  })} color="black" borderColor="#9ca3af" />
              </InputGroup>
              <Field.HelperText color="red">{errors.middlename?.message}</Field.HelperText>
            </Field.Root>

            <Field.Root id="lastname">
              <Field.Label color="black">Last Name</Field.Label>
              <InputGroup startElement={<FiUser />}>
                <Input placeholder="Enter Last Name" {...register('lastname',{ required: "Enter lastname"  })} color="black" borderColor="#9ca3af" />
              </InputGroup>
              <Field.HelperText color="red">{errors.lastname?.message}</Field.HelperText>
            </Field.Root>
            <Field.Root id="phone">
              <Field.Label color="black">Phone</Field.Label>
              <InputGroup startElement={<FiSmartphone />}>
                <Input placeholder="Enter phone no" {...register('phone',{ required: "Enter phone"  })} color="black" borderColor="#9ca3af" />
              </InputGroup>
              <Field.HelperText color="red">{errors.phone?.message}</Field.HelperText>
            </Field.Root>
            <Field.Root id="bvn">
              <Field.Label color="black">Bvn</Field.Label>
              <InputGroup startElement={<FiHardDrive />}>
                <Input placeholder="Enter bvn no" {...register('bvn',{ required: "Enter bvn"  })} color="black" borderColor="#9ca3af" />
              </InputGroup>
              <Field.HelperText color="red">{errors.bvn?.message}</Field.HelperText>
            </Field.Root>
            <Field.Root id="bank">
                <Field.Label color="black">Select bank attached to your bvn</Field.Label>
                    <NativeSelect.Root size="md">
                        <NativeSelect.Field
                            style={{background:'white'}} placeholder="Select option"
                            {...register("bank_code",{ required: "Select a bank attached to the bvn provided"  })}
                        >
                            {banks.map((framework) => (
                                <option key={framework.value} style={{background:'white'}} value={framework.code}>{framework.name}</option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
              <Field.HelperText color="red">{errors.bank_code?.message}</Field.HelperText>
            </Field.Root>
            <Field.Root id="account_number">
              <Field.Label color="black">Enter bank account no</Field.Label>
              <InputGroup startElement={<FiSmartphone />}>
                <Input placeholder="Enter account number" {...register('account_number',{ required: "Enter your selected bank account no"  })} color="black" borderColor="#9ca3af" />
              </InputGroup>
              <Field.HelperText color="red">{errors.account_number?.message}</Field.HelperText>
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
        )}
      </Box>
    </Box>
  )
}