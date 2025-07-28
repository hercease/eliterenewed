'use client'

import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
  DataList,
  Dialog,
  Field,
  Stack,
  Portal,
  Select,
  Span,
  createListCollection,
  Avatar,
  HStack,
  useSelectContext,
  Spinner, 
  CloseButton
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { FiPhone, FiWifi } from 'react-icons/fi'
import { toaster } from "@/components/ui/toaster"
import { useColorModeValue } from "@/components/ui/color-mode"
import NavBar from '@/components/ui/sidebar'
import { useForm } from 'react-hook-form'

const baseNetworksData = [
  {
    label: "Select Network",
    value: "select_network",
    description: "Select a network",
    img: null,
  },
  { label: "AIRTEL", value: "AIRTEL", description: "Network", img: "/airtel.png" },
  { label: "MTN", value: "MTN", description: "Network", img: "/mtn.png" },
  { label: "GLO", value: "GLO", description: "Network", img: "/glo.png" },
  { label: "9Mobile", value: "9MOBILE", description: "Network", img: "/9mobile.png" }
]

export default function DataComponent({user}) {

  const [isLoading, setIsLoading] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [fetchedNetworks, setFetchedNetworks] = useState([])
  const [hasMounted, setHasMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [areLoading, setAreLoading] = useState(false)

  const { register, formState: { errors }, watch, handleSubmit, reset } = useForm({ mode: 'onChange' })
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



const baseNetworks = useMemo(() => createListCollection({ items: baseNetworksData }),[]);

  const networks = useMemo(() => {
    if (!fetchedNetworks?.length) return createListCollection({ items: [] })
    return createListCollection({ items: fetchedNetworks })
  }, [fetchedNetworks])



  const fetchNetworkData = async (networkvalue) => {
    try {
      setIsLoading(true)
      const formData = new URLSearchParams()
      formData.append('network', networkvalue)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchdataplanlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!response.ok) {
          const text =  response.text();
            toaster.create({
                title: 'Error',
                description: `Server error ${response.status}: ${text}`,
                status: 'error',
                duration: 7000,
                type: "error"
            })
            return;
        }

      const data = await response.json()
      setFetchedNetworks(data)
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to load data list',
        status: 'error',
        duration: 7000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  console.log('Selected Plan:', selectedPlan)

  const SelectValue = () => {
    const select = useSelectContext()
    const items = select.selectedItems
    return (
      <Select.ValueText placeholder="Select Network">
        <HStack>
          {items[0]?.img && (
            <Avatar.Root shape="full" size="2xs">
              <Avatar.Image src={items[0]?.img} alt={items[0]?.label} />
            </Avatar.Root>
          )}
          {items[0]?.label}
        </HStack>
      </Select.ValueText>
    )
  }

  const SelectValueNetwork = () => {
    const select = useSelectContext()
    const items = select.selectedItems
    return (
      <Select.ValueText placeholder="Select Plan">
        <HStack>
          ₦{items[0]?.price?.toLocaleString()} - {items[0]?.name}
        </HStack>
      </Select.ValueText>
    )
  }

  const onSubmit = (data) => {
    console.log(data)
    setOpen(true);
  }

  const handleConfirmedSubmit = async (data) => {
    try {
      // Optional UI updates (e.g. modal close, loading spinner)
      setOpen(false);
      setAreLoading(true);

      if (!data.network || !data.plan || !data.phone || !selectedPlan?.price || !user) {
        toaster.create({
          title: 'Error',
          description: 'Missing required input fields.',
          type: 'error',
          duration: 7000,
          isClosable: true,
        });
        return;
      }

      const payload = {
        network_name: data.network,
        plan_name: selectedPlan?.name,
        network_code: data.plan,
        api: selectedPlan?.api,
        amount: selectedPlan?.price,
        com: selectedPlan?.com,
        phone: data.phone,
        profit: selectedPlan?.profit,
        username: user,
      };

      const formData = new URLSearchParams(payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/datapay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error ${response.status}: ${text}`);
      }

      const resp = await response.json();

      setAreLoading(false);

      if (resp.status) {

        toaster.create({
          title: 'Success',
          description: resp.message || 'Data purchase successful!',
          duration: 10000,
          isClosable: true,
          type: 'success',
        });
        
        reset();

      } else {
        toaster.create({
          title: 'Error',
          description: resp.message || 'Something went wrong',
          duration: 7000,
          isClosable: true,
          type: 'error',
        });
      }

    } catch (error) {
      console.error("Data Purchase Error:", error);
      toaster.create({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        duration: 5000,
        isClosable: true,
        type: 'error',
      });
    } finally {
      // Optional loading reset
      setAreLoading(false);
    }
  };


  return (
    <Box minH="100vh"
      bg="gray.50"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat"
      bgSize="auto">
      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />
      <Box 
        w="full"
        maxW={{ base: "95%", md: "500px", lg: "640px" }}
        mx="auto"
        mt={{ base: 4, md: 8 }}
        p={{ base: 4, md: 6 }}
        borderRadius="md" 
        placeSelf="center"
        color="black"
      >

        <Flex justify="space-between" align="center" mb={3}>
          <Heading color="black" size="lg">
            <HStack spacing={2}>
              <FiWifi />  Data Recharge
            </HStack>
          </Heading>
        </Flex>

     
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
                          <Dialog.Title>You are about to process the following data plan ?</Dialog.Title>
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
                          <DataList.ItemLabel>Plan name</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {selectedPlan?.name}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>Price</DataList.ItemLabel>
                          <DataList.ItemValue>
                          ₦ {selectedPlan?.price?.toLocaleString()}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                          <DataList.ItemLabel>Phone no</DataList.ItemLabel>
                          <DataList.ItemValue>
                            {watch('phone')}
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mb="2" spacing={2}>
            <Field.Root>
              <Select.Root
                collection={baseNetworks}
                size="md"
                {...register("network", { required: "Select network" })}
                onValueChange={(details) => {
                  const selected = baseNetworks.items.find(item => item.value === details.value[0])
                  fetchNetworkData(selected.value)
                  setSelectedNetwork(selected)
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
                      {baseNetworks.items.map((network) => (
                        <Select.Item item={network} key={network.value}>
                          <Stack gap="0">
                            <Select.ItemText>
                              {network.img && (
                                <Avatar.Root shape="full" size="2xs" mr="2">
                                  <Avatar.Image src={network.img} alt={network.label} />
                                </Avatar.Root>
                              )}
                              {network.label}
                            </Select.ItemText>
                          </Stack>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              <Field.HelperText color="red">{errors.network?.message}</Field.HelperText>
            </Field.Root>

            <Field.Root>
              <Select.Root
                collection={networks}
                size="md"
                {...register("plan", { required: "Select data plan" })}
                onValueChange={(details) => {
                  const selected = networks.items.find(item => item.value === details.value[0])
                  setSelectedPlan(selected)
                }}
                className="dark"
              >
                <Select.HiddenSelect />
                <Select.Label>Select Plan</Select.Label>
                <Select.Control>
                  <Select.Trigger>
                    <SelectValueNetwork />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    {isLoading && (
                      <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />
                    )}
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {networks.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          <Stack gap="0">
                            <Select.ItemText>₦{item.price?.toLocaleString()}</Select.ItemText>
                            <Span color="fg.muted" textStyle="xs">{item.name}</Span>
                          </Stack>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
              <Field.HelperText color="red">{errors.plan?.message}</Field.HelperText>
            </Field.Root>

            <Field.Root id="phone">
              <Field.Label color="black">Phone no</Field.Label>
              <InputGroup startElement={<FiPhone />}>
                <Input
                  placeholder="Enter Phone Number"
                  color="black"
                  borderColor="#9ca3af"
                  type="tel"
                  size="md"
                  {...register("phone", { required: true, minLength: 11, maxLength: 11 })}
                />
              </InputGroup>
              <Field.HelperText color="blue">Wallet Balance : ₦{userdetails?.data.account_balance?.toLocaleString()}</Field.HelperText>
              {errors.phone?.type === 'required' && <Field.HelperText color="red">Phone number is required</Field.HelperText>}
              {errors.phone?.type === 'minLength' && <Field.HelperText color="red">Minimum 11 digits</Field.HelperText>}
              {errors.phone?.type === 'maxLength' && <Field.HelperText color="red">Maximum 11 digits</Field.HelperText>}
            </Field.Root>
          </Stack>

          <Button background="#0060d1" color="white" type="submit" loading={areLoading} size="md" w="full">
            Continue
          </Button>
        </form>
      </Box>
      </Box>
  )
}
