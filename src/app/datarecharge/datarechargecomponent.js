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
import { FiPhone } from 'react-icons/fi'
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
  const [loading, setLoading] = useState(false)

  const { register, formState: { errors }, watch, handleSubmit } = useForm({ mode: 'onChange' })
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

      const data = await response.json()
      setFetchedNetworks(data)
    } catch (error) {
      toaster.create({
        title: 'Error',
        description: 'Failed to load data list',
        status: 'error',
        duration: 5000,
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

  const handleConfirmedSubmit = (data) => { 
      //setOpen(false);
      //setLoading(true);
      const formData = new URLSearchParams()
      formData.append('network_name', data.network)
      formData.append('plan_name', selectedPlan?.name)
      formData.append('network_code', data.plan)
      formData.append('api', selectedPlan?.api)
      formData.append('amount', selectedPlan?.price)
      formData.append('com', selectedPlan?.com)
      formData.append('phone', data.phone)

      const response = fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/datapay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
            body: formData.toString(),
        })

        const resp = response.json();

        if(resp.status){

          toaster.create({
              title: 'Success',
              description: resp.message,
              duration: 10000,
              isClosable: true,
              type: "success"
          })

        } else {

            toaster.create({
              title: 'Error',
              description: data.message,
              status: 'error',
              duration: 5000,
              type: "error"
            })

        }
      

  }

  return (
    <Box minH="100vh" bg="gray.50">
      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />
      <Box p={6} color="black">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Data Recharge</Heading>
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
                size="sm"
                minWidth="320px"
                {...register("network", { required: "Select network" })}
                onValueChange={(details) => {
                  const selected = baseNetworks.items.find(item => item.value === details.value[0])
                  fetchNetworkData(selected.value)
                  setSelectedNetwork(selected)
                }}
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
                size="sm"
                minWidth="320px"
                {...register("plan", { required: "Select data plan" })}
                onValueChange={(details) => {
                  const selected = networks.items.find(item => item.value === details.value[0])
                  setSelectedPlan(selected)
                }}
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
                  {...register("phone", { required: true, minLength: 11, maxLength: 11 })}
                />
              </InputGroup>

              {errors.phone?.type === 'required' && <Field.HelperText color="red">Phone number is required</Field.HelperText>}
              {errors.phone?.type === 'minLength' && <Field.HelperText color="red">Minimum 11 digits</Field.HelperText>}
              {errors.phone?.type === 'maxLength' && <Field.HelperText color="red">Maximum 11 digits</Field.HelperText>}
            </Field.Root>
          </Stack>

          <Button background="#0060d1" color="white" type="submit" loading={loading} size="md" w="full">
            Continue
          </Button>
        </form>
      </Box>
    </Box>
  )
}
