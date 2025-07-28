'use client'

import {
  Box,
  Flex,
  Heading,
  Dialog,
  Input,
  InputGroup,
  Spinner,
  Button,
  CloseButton,
  Field,
  Stack,
  Portal,
  Select,
  DataList,
  createListCollection,
  Avatar,
  HStack
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { toaster } from "@/components/ui/toaster"
import NavBar from '@/components/ui/sidebar'
import { useColorModeValue } from "@/components/ui/color-mode"
import { useForm  } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { FiSmartphone, FiZap } from "react-icons/fi"
import { duration } from '@mui/material'
const FaIdCard = dynamic(() =>
  import('react-icons/fa').then(mod => mod.FaIdCard), {
  ssr: false,
  loading: () => null
})

export default function ElectricityComponent({user}) {

  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [networkData, setNetworkData] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [fetchedNetworks, setFetchedNetworks] = useState([])
  const [open, setOpen] = useState(false)
  const { register, formState: { errors }, handleSubmit, getValues, watch, reset } = useForm({ mode: 'onChange' })
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [amount, setAmount] = useState(0)
  const [userdetails, setUserDetails] = useState(null)
  const [networks, setNetworks] = useState(createListCollection({ items: [] }));
  const [isValidating, setIsValidating] = useState(false)
  const [validationSuccess, setValidationSuccess] = useState(false)
  const [meterNo, setMeterNo] = useState('')
  const [customerName, setcustomerName] = useState('')
  const [isHideButton, setisHideButton] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

 useEffect(() => {
  if (!user) return;

  const fetchData = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', user);

      const [networkRes, profileRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchelectricityplans`, {
          method: 'POST',
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        })
      ]);

      const networkDataJson = networkRes.ok ? await networkRes.json() : [];
      //console.log(networkDataJson);
      const profileData = profileRes.ok ? await profileRes.json() : [];

      setNetworkData(networkDataJson);
      setUserDetails(profileData);

      // ✅ Now transform and set networks
      setNetworks(createListCollection({ items: networkDataJson }));

    } catch (error) {
      console.error(error);
      toaster.create({
        title: 'Error',
        description: 'Failed to load data',
        duration : 7000,
        type: 'error'
      });
    }
  };

  fetchData();
}, [user]);

//console.log(selectedNetwork);

  const onSubmit = (data) => {

    // Validate form inputs
    if (!selectedNetwork) {

        toaster.create({
          title: 'Error',
          description: 'Please select a network',
          status: 'error',
          duration: 7000,
          isClosable: true,
          type: 'error'
        });

        setIsLoading(false);
        return;

    }

    setOpen(true);
    console.log(data);
    setAmount(data.amount);

  };


  const handleConfirmedSubmit = async (data) => {
    try {
      setOpen(false);
      setLoading(true);

      if (!selectedNetwork?.code || !selectedNetwork?.api || !data.meter_no || !data.amount || !data.phone || !user || !customerName) {
          toaster.create({
            title: 'Error',
            description: 'Missing required input fields.',
            type: 'error',
            duration: 7000,
          });
          return;
      }

      const payload = {
        disco: selectedNetwork.code,
        meter_no: data.meter_no,
        api: selectedNetwork.api,
        amount : data.amount,
        phone: data.phone,
        username: user,
        customer_name: customerName,
      };

      const formData = new URLSearchParams(payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/electricitypay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const resp = await res.json();

      toaster.create({
        title: resp.status ? 'Success' : 'Error',
        description: resp.message,
        type: resp.status ? 'success' : 'error',
        duration: 7000,
      });
      
      reset();

    } catch (error) {

      console.error("Electricity Payment Error:", error);
      toaster.create({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        type: 'error',
        duration: 7000,
      });

    } finally {
      setLoading(false);
    }
  };


  const fakeSmartcardValidation = async () => {
    try {
      const smartCardNo = getValues('meter_no')?.trim();
      
      if (!selectedNetwork) {
        toaster.create({
          title: 'Error',
          description: 'Select network',
          type: "error",
          duration: 7000,
          isClosable: true,
        });
        return;
      }

      if (!smartCardNo) {
        toaster.create({
          title: 'Error',
          description: 'Enter meter no',
          type: "error",
          duration: 7000,
          isClosable: true,
        });
        return;
      }

      setIsValidating(true);
      setMeterNo(smartCardNo);

      const formData = new URLSearchParams();
      formData.append('meter_no', smartCardNo);
      formData.append('api', selectedNetwork?.api);
      formData.append('disco', selectedNetwork?.code)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/validatemeterno`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.status) {
        setcustomerName(data.message);
        setisHideButton(true);
        setValidationSuccess(true);


      } else {
        setValidationSuccess(false);
        toaster.create({
          title: 'Error',
          description: data.message,
          type: "error",
          duration: 7000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Validation Error:", error);
      toaster.create({
        title: 'Error',
        description: error?.message || "An unexpected error occurred",
        type: "error",
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsValidating(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'meter_no') {
        // When meter number is cleared or changed
        if (!value.meter_no || value.meter_no !== meterNo) {
          setValidationSuccess(false);
          setisHideButton(false);
          setcustomerName('');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, meterNo]);


  return (
    <Box  
      minH="100vh" 
      bg="white"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat"
      bgSize="auto"
    >
      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />
      <Box 
        color="black"
        w="full"
        maxW={{ base: "95%", md: "500px", lg: "640px" }}
        mx="auto"
        mt={{ base: 4, md: 8 }}
        p={{ base: 4, md: 6 }}
        borderRadius="md"
      >

        <Flex justify="space-between" align="center" mb={3}>
          <Heading color="black" size="lg">
            <HStack spacing={2}>
              <FiZap />
              Electricity Recharge
            </HStack>
          </Heading>
        </Flex>

            {networks && (
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
                            <DataList.ItemLabel>Network</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {selectedNetwork?.name}
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Meter No</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {meterNo}
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Customer Name</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {customerName || 'N/A'}
                            </DataList.ItemValue>
                          </DataList.Item>
        
                          <DataList.Item>
                            <DataList.ItemLabel>Amount</DataList.ItemLabel>
                            <DataList.ItemValue>
                              ₦ {amount?.toLocaleString()}
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
                )}
        <form onSubmit={handleSubmit(onSubmit)}>

          <Stack mb="2" spacing={2}>
            {networks?.items.length > 0 && (
            <Select.Root
              collection={networks}
              size="sm"
              minWidth="320px"
              positioning={{ sameWidth: true }}
              defaultValue=""
              onValueChange={(details) => {
                const selected = networks.items.find(
                  item => item.value === details.value[0]
                );
                setSelectedNetwork(selected);
              }}
              className="dark"
            >
              <Select.HiddenSelect />
              <Select.Label>Select Network</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select framework" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {networks && networks.items.map((network) => (
                      <Select.Item item={network} key={network.value}>
                        <Stack gap="0">
                          <Select.ItemText>
                            <Avatar.Root shape="full" size="2xs" mr="2">
                              <Avatar.Image src={network.img} alt={network.name} />
                            </Avatar.Root>
                            {network.name} - {network.description}
                          </Select.ItemText>
                        </Stack>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            )}

            <Field.Root id="smart_cardno">
            <Field.Label color="black">Meter No</Field.Label>
            <InputGroup
                startElement={<FaIdCard /> || null}
                endElement={
                  isValidating ? (
                      <Spinner size="sm" />
                  ) : validationSuccess ? null : (
                      <Button size="xs" onClick={fakeSmartcardValidation}>
                      Validate
                      </Button>
                  )
                }
            >
                <Input
                    placeholder="Enter Meter No"
                    color="black"
                    borderColor="#9ca3af"
                    type="text"
                    {...register('meter_no',{ required: true  })}
                     onChange={(e) => {
                    // Clear validation if user edits the field
                    if (customerName && e.target.value !== meterNo) {
                      setcustomerName('');
                      setValidationSuccess(false);
                      setisHideButton(false);
                    }
                  }}
                />
                
            </InputGroup>
            <Field.HelperText color="green">{customerName}</Field.HelperText>
        </Field.Root>

            <Field.Root id="amount">
              <Field.Label color="black">Enter Amount</Field.Label>
              <InputGroup startElement="₦">
                <Input 
                  placeholder="Enter Amount" 
                  color="black" 
                  borderColor="#9ca3af" 
                  type="number"
                  {...register("amount",{ required: "Enter amount to buy"  })} 
                />
              </InputGroup>
              <Field.HelperText color="blue">Wallet Balance : ₦{userdetails?.data.account_balance?.toLocaleString()}</Field.HelperText>
              <Field.HelperText color="red">{errors.amount?.message}</Field.HelperText>
            </Field.Root>

            <Field.Root id="phone">
              <Field.Label color="black">Phone no</Field.Label>
              <InputGroup startElement={<FiSmartphone />}>
                <Input 
                  placeholder="Enter Phone no" 
                  color="black" 
                  borderColor="#9ca3af" 
                  type="number"
                  {...register("phone",{ required: true, minLength: "Minimum input is 11 characters", maxLength: "Maximum input of 11 characters is required" })} 
                />
              </InputGroup>

              {errors.phone?.type === 'required' && <Field.HelperText color="red"> Phone is required</Field.HelperText>}
              {errors.phone?.type === 'minLength' && <Field.HelperText color="red"> Minimum input is 11 characters</Field.HelperText>}
              {errors.phone?.type === 'maxLength' && <Field.HelperText color="red"> Maximum input of 11 characters is required</Field.HelperText>}
            </Field.Root>

            
          </Stack>

        {isHideButton && (
          <Button
            background="#0060d1"
            color="white"
            type="submit"
            loading={loading}
            size="md"
            w="full"
          >
            Continue
          </Button>
        )}

        </form>
      </Box>
    </Box>
  )
}