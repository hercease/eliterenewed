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
  Text,
  Icon,
  CloseButton,
  Field,
  Stack,
  Portal,
  Select,
  DataList,
  createListCollection,
  Avatar,
  HStack,
  useSelectContext,
  Spinner
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { toaster } from "@/components/ui/toaster"
import { useForm  } from 'react-hook-form'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { FiSmartphone } from "react-icons/fi"
import { duration } from '@mui/material'
const NavBar = dynamic(() => import('@/components/ui/sidebar'), {
  ssr: false,
  loading: () => <Spinner />
})

const FiPhone = dynamic(() =>
  import('react-icons/fi').then(mod => mod.FiPhone), {
  ssr: false,
  loading: () => null
})


export default function AirtimeRechargeComponent({user}) {

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [networkData, setNetworkData] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [fetchedNetworks, setFetchedNetworks] = useState([])
  const [open, setOpen] = useState(false)
  const { register, formState: { errors }, handleSubmit, getValues, watch, reset } = useForm({ mode: 'onChange' })
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [api, setApi] = useState('')
  const [product_id, setProductId] = useState('')
  const [userdetails, setUserDetails] = useState(null)

  const baseNetworks = useMemo(() => [
    {
      label: "AIRTEL",
      value: "ringo_airtel",
      description: "Network 1",
      img: "/airtel.png",
      api: "ringo",
      product_id: 'MFIN-1-OR',
    },
    {
      label: "MTN",
      value: "ringo_mtn",
      description: "Network 1",
      img: "/mtn.png",
      api: "ringo",
      product_id: 'MFIN-5-OR'
    },
    {
      label: "GLO",
      value: "ringo_glo",
      description: "Network 1",
      img: "/glo.png",
      api: "ringo",
      product_id: "MFIN-6-OR"
    },
    {
      label: "9MOBILE",
      value: "ringo_9mobile",
      description: "Network 1",
      img: "/9mobile.png",
      api: "ringo",
      product_id: "MFIN-2-OR"
    },
    {
      label: "9MOBILE",
      value: "cashless_9mobile",
      description: "Network 3",
      img: "/9mobile.png",
      api: "cashless",
      product_id: 'etisalat'
    },
    {
      label: "MTN",
      value: "cashless_mtn",
      description: "Network 3",
      img: "/mtn.png",
      api: "cashless",
      product_id: 'mtn'
    },
    {
      label: "AIRTEL",
      value: "cashless_airtel",
      description: "Network 3",
      img: "/airtel.png",
      api: "cashless",
      product_id: 'airtel'
    },
    {
      label: "GLO",
      value: "cashless_glo",
      description: "Network 3",
      img: "/glo.png",
      api: "cashless",
      product_id: 'glo'
    }
  ], [])

  const [networks, setNetworks] = useState(() =>
    createListCollection({ items: baseNetworks })
  )

  // Fetch network data once
  useEffect(() => {
  if (!user) return;

  const fetchData = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', user);

      const [networkRes, profileRes] = await Promise.all([
        fetch(process.env.NEXT_PUBLIC_PLANETFURL, {
          method: 'POST',
          headers: {
            'Authorization': process.env.NEXT_PUBLIC_PLANETFTOKEN,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ service: 'airtime' })
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        })
      ]);

      const networkData = await networkRes.json();
      const profileData = await profileRes.json();

      setFetchedNetworks(Array.isArray(networkData.data) ? networkData.data : networkData);
      setUserDetails(profileData);
    } catch (error) {
      console.error(error);
      toaster.create({
        title: 'Error',
        description: 'Failed to load data',
        type: 'error'
      });
    }
  };

  fetchData();
}, [user]);


  // Memoized transformation of fetched networks
  const transformedNetworks = useMemo(() => {
    return fetchedNetworks.map((item) => {
      const lowercase = item.network.toLowerCase()
      return {
        label: item.network,
        value: lowercase,
        description: "Network 2",
        img: `/${lowercase}.png`,
        api: "planetf",
        product_id: item.network + 1
      }
    })
  }, [fetchedNetworks])

  // Update collection when fetched data changes
  useEffect(() => {
    const combined = [...baseNetworks, ...transformedNetworks]
    const newCollection = createListCollection({ items: combined })
    setNetworks(newCollection)
  }, [transformedNetworks, baseNetworks])

  const onSubmit = (data) => {

    // Validate form inputs
    if (!selectedNetwork) {

        toaster.create({
          title: 'Error',
          description: 'Please select a network',
          status: 'error',
          duration: 5000,
          isClosable: true,
          type: 'error'
        });

        setIsLoading(false);
        return;

    }

    setOpen(true);
    //console.log(data);

    setPhone(getValues('phone'));
    setAmount(getValues('amount'));

  };

  const handleConfirmedSubmit = async (data) => { 
      setOpen(false);
      setIsLoading(true);
      const formData = new URLSearchParams()
      formData.append('network_name', selectedNetwork?.label)
      formData.append('network_code', selectedNetwork?.product_id)
      formData.append('api', selectedNetwork?.api)
      formData.append('amount', amount)
      formData.append('phone', phone)
      formData.append('username', user)
      
      //console.log(formData.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airtimepay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      setIsLoading(false);

      if (!res.ok) {
        const text =  res.text();
          toaster.create({
              title: 'Error',
              description: `Server error ${res.status}: ${text}`,
              status: 'error',
              duration: 7000,
              type: "error"
          })
          return;
      }

      const resp = await res.json();

      if (resp.status) {
        toaster.create({ title: 'Success', description: resp?.message, type: 'success', duration: 7000 });
      } else {
        toaster.create({ title: 'Error', description: resp?.message, type: 'error', duration: 7000 });
      }

  }

  const SelectValue = () => {
    const select = useSelectContext()
    const items = select.selectedItems

    return (
      <Select.ValueText placeholder="Select plan">
        <HStack>
          <Avatar.Root shape="full" size="2xs">
            <Avatar.Image src={items[0]?.img} alt={items[0]?.label} />
          </Avatar.Root>
          {items[0]?.label} - {items[0]?.description}
        </HStack>
      </Select.ValueText>
    )
  }


  return (
    <Box 
      minH="100vh" 
      bg="white"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat"
      bgSize="auto"
    >
      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />

      
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
                              {selectedNetwork?.label}
                            </DataList.ItemValue>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.ItemLabel>Phone no</DataList.ItemLabel>
                            <DataList.ItemValue>
                              {phone}
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
                              <Button loading={isLoading} onClick={() => handleConfirmedSubmit(watch())} variant="outline">Continue</Button>
                            </Dialog.ActionTrigger>
                          </Dialog.Footer>
                          <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                          </Dialog.CloseTrigger>
                        </Dialog.Content>
                      </Dialog.Positioner>
                    </Portal>
                  </Dialog.Root>
                  
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
              <FiSmartphone />
              Airtime Recharge
            </HStack>
          </Heading>
        </Flex>



        <form onSubmit={handleSubmit(onSubmit)}>

          <Stack mb="2" spacing={2}>
            <Field.Root id="amount">
              <Field.Label color="black">Enter Amount</Field.Label>
              <InputGroup startElement="₦">
                <Input 
                  placeholder="Enter Amount" 
                  color="black" 
                  borderColor="#9ca3af" 
                  type="number"
                  {...register("amount",{ required: "Enter airtime amount", min:100, max:5000  })} 
                />
              </InputGroup>
               <Field.HelperText color="blue">Wallet Balance : ₦{userdetails?.data.account_balance?.toLocaleString()}</Field.HelperText>
              <Field.HelperText color="red">{errors.amount?.message}</Field.HelperText>
              {errors.amount?.type === 'min' && <Field.HelperText color="red"> Minimum amount buyable is &#8358; 100 </Field.HelperText>}
              {errors.amount?.type === 'max' && <Field.HelperText color="red"> Maximum amount buyable is &#8358; 5000 </Field.HelperText>}
            </Field.Root>

            <Select.Root
              collection={networks}
              size="sm"
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
                  <SelectValue />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {networks.items.map((network) => (
                      <Select.Item item={network} key={network.value}>
                        <Stack gap="0">
                          <Select.ItemText>
                            <Avatar.Root shape="full" size="2xs" mr="2">
                              <Avatar.Image src={network.img} alt={network.label} />
                            </Avatar.Root>
                            {network.label} - {network.description}
                          </Select.ItemText>
                        </Stack>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <Field.Root id="phone">
              <Field.Label color="black">Phone no</Field.Label>
              <InputGroup startElement={<FiPhone />}>
                <Input 
                  placeholder="Enter Phone Number" 
                  color="black" 
                  borderColor="#9ca3af" 
                  type="tel"
                  {...register('phone',{ required: "Enter your phone number"  })}
                />
              </InputGroup>
              <Field.HelperText color="red">{errors.phone?.message}</Field.HelperText>
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