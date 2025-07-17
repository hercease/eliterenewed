'use client'

import {
  Box,
  Flex,
  Heading,
  Dialog,
  FormLabel,
  Input,
  InputGroup,
  Spinner,
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
  useSelectContext
} from '@chakra-ui/react'
import { useState, useEffect, useMemo } from 'react'
import { toaster } from "@/components/ui/toaster"
import NavBar from '@/components/ui/sidebar'
import { useForm  } from 'react-hook-form'
import dynamic from 'next/dynamic'
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
  const { register, formState: { errors }, handleSubmit, getValues, watch } = useForm({ mode: 'onChange' })
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

      const networkDataJson = await networkRes.json();
      console.log(networkDataJson);
      const profileData = await profileRes.json();

      setNetworkData(networkDataJson);
      setUserDetails(profileData);

      // ✅ Now transform and set networks
      setNetworks(createListCollection({ items: networkDataJson }));

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



console.log(networks);


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
    console.log(data);
    setAmount(data.amount);

  };

  const handleConfirmedSubmit = async (data) => { 
      setOpen(false);
      setLoading(true);
      const formData = new URLSearchParams()
      formData.append('network_name', selectedNetwork?.label)
      formData.append('network_code', selectedNetwork?.product_id)
      formData.append('api', selectedNetwork?.api)
      formData.append('amount', amount)
      formData.append('phone', phone)
      formData.append('username', user)
      
      console.log(formData.toString());

     
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/airtimepay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const resp = await res.json();

      setLoading(false);

      if (resp.status) {
        toaster.create({ title: 'Success', description: resp?.message, type: 'success' });
      } else {
        toaster.create({ title: 'Error', description: resp?.message, type: 'error' });
      }

  }

  console.log(selectedNetwork)

  const fakeSmartcardValidation = async () => {
      try {
          if (!selectedNetwork) {
              toaster.create({
                  title: 'Error',
                  description: 'Select network',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  type: "error"
              })
              return
          }
  
          const smartCardNo = getValues('meter_no');
          if (!smartCardNo?.trim()) {
              toaster.create({
                  title: 'Error',
                  description: 'Enter meter no',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  type: "error"
              })
              return
          }
  
  
          setIsValidating(true)
          const formData = new URLSearchParams()
          formData.append('meter_no', getValues('meter_no'))
          setMeterNo(getValues('meter_no'));
  
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/validatemeterno`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
              body: formData.toString(),
          })
  
          // ✅ Check if response was OK
          if (!response.ok) {
              const errorText = await response.text() // to show full error if JSON fails
              throw new Error(`API error: ${response.status} - ${errorText}`)
          }
  
          const data = await response.json()
          console.log(data)
          if(data.status){
  
              setcustomerName(data.customerName);
  
              setisHideButton(true)
              setIsValidating(false)
              setValidationSuccess(true)
  
          } else {
  
              setValidationSuccess(false)
              setIsValidating(false)
  
              toaster.create({
                  title: 'Error',
                  description: data.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                  type: "error"
              })

          }
  
      } catch (error) {
  
          console.error("Validation Error:", error)
  
          toaster.create({
            title: 'Error',
            description: error,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
  
      } finally {
          setIsLoading(false)
      }
      }

  const SelectValue = () => {
    const select = useSelectContext()
    const items = select.selectedItems

    return (
      <Select.ValueText placeholder="Select plan">
        <HStack>
          <Avatar.Root shape="full" size="2xs">
            <Avatar.Image src={items[0]?.img} alt={items[0]?.name} />
          </Avatar.Root>
          {items[0]?.name} - {items[0]?.description}
        </HStack>
      </Select.ValueText>
    )
  }


  return (
    <Box minH="100vh" bg="gray.50">
      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />
      <Box p={6} color="black">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Electricity Recharge</Heading>
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
              <Field.HelperText color="red">{errors.amount?.message}</Field.HelperText>
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