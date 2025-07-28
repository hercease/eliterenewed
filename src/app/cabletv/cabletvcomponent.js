'use client'

import {
  Box, Flex, Heading, Button, Stack,
  InputGroup, Input, Field, useSelectContext,
  Select, Spinner, HStack, Avatar, createListCollection,
  Portal, NumberInput, useDialog, Dialog, CloseButton, DataList, Badge
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useForm  } from 'react-hook-form'
import dynamic from 'next/dynamic'
import NavBar from '@/components/ui/sidebar'
import { toaster } from "@/components/ui/toaster"
import { FiTv } from "react-icons/fi"

// Dynamic Icon import
const FaIdCard = dynamic(() =>
  import('react-icons/fa').then(mod => mod.FaIdCard), {
  ssr: false,
  loading: () => null
})

const MdError = dynamic(() =>
  import('react-icons/md').then(mod => mod.MdError), {
  ssr: false,
  loading: () => null
})

export default function CableTvComponent({user}) {

  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isHideButton, setisHideButton] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState('')
  const [fetchedNetworks, setFetchedNetworks] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [cablePlans, setCablePlans] = useState(null)
  const [cableAddons, setCableAddons] = useState(null)
  const [selectedAddons, setselectedAddons] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationSuccess, setValidationSuccess] = useState(false)
  const [smartCard, setsmartCard] = useState('')
  const [customerName, setcustomerName] = useState('')
  const [open, setOpen] = useState(false)
  const [totalprice, setTotalPrice] = useState(0)
  const { register, formState: { errors }, handleSubmit, getValues, watch, reset } = useForm({ mode: 'onChange' })
  const [periodvalue, setPeriodValue] = useState(1)
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


  const baseNetworks = createListCollection({
    items: [
      { label: 'DSTV', value: 'DSTV', img: '/dstv.jpg' },
      { label: 'GOTV', value: 'GOTV', img: '/gotv.png' },
      { label: 'STARTIMES', value: 'STARTIMES', img: '/startimes.png' },
      { label: 'SHOWMAX', value: 'SHOWMAX', img: '/showmax.png' },
    ]
  })


    const fakeSmartcardValidation = async () => {
    try {
        if (!selectedNetwork?.trim()) {
            toaster.create({
                title: 'Error',
                description: 'Select cable network',
                status: 'error',
                duration: 7000,
                isClosable: true,
                type: "error"
            })
            return
        }

        const smartCardNo = getValues('smart_cardno');
        if (!smartCardNo?.trim()) {
            toaster.create({
                title: 'Error',
                description: 'Enter Smart card no',
                status: 'error',
                duration: 7000,
                isClosable: true,
                type: "error"
            })
            return
        }


        setIsValidating(true)
        const formData = new URLSearchParams()
        formData.append('network', selectedNetwork)
        formData.append('smart_card', getValues('smart_cardno'))

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchcableplanlist`, {
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

            setsmartCard(data.smartCardNo);
            setcustomerName(data.customerName);
            setCablePlans(data.cable_plans)
            setCableAddons(data.cable_addons)

            setisHideButton(true)
            setIsValidating(false)
            setValidationSuccess(true)

        } else {

            setsmartCard(data.smartCardNo);
            setcustomerName(data.customerName);
            setCablePlans(data.cable_plans)
            setCableAddons(data.cable_addons)

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

            //setisHideButton(false)
            
            //setValidationSuccess(false)
        }

        // Only do these if all went well

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


  const plans = useMemo(() => {
    if (!cablePlans?.length) return createListCollection({ items: [] })
    return createListCollection({ items: cablePlans })
  }, [cablePlans])

  const addons = useMemo(() => {
    if (!cableAddons?.length) return createListCollection({ items: [] })
    return createListCollection({ items: cableAddons })
  }, [cableAddons])

    const onSubmit = (data) => {
        setOpen(true);
        console.log(data);

        const addon_price = selectedAddons ? parseInt(selectedAddons?.price) : 0;
        const cable_price = selectedPlan?.price;
        const period = selectedNetwork=="SHOWMAX" ? parseInt(selectedPlan?.period) : parseInt(periodvalue);
        const total_price = selectedNetwork=="SHOWMAX" ? cable_price : period * cable_price + addon_price;
        console.log(period);
        setTotalPrice(total_price);
    }


  const handleConfirmedSubmit = async (data) => {
    try {
      setOpen(false);
      setIsLoading(true);

      const formData = new URLSearchParams();
      const addon_price = selectedAddons ? parseInt(selectedAddons?.price) : 0;
      const cable_price = selectedPlan?.price;
      const period = selectedNetwork == "SHOWMAX" ? parseInt(selectedPlan?.period) : parseInt(periodvalue);

      formData.append('cable_name', selectedNetwork);
      formData.append('network_code', selectedPlan?.value);
      formData.append('network_name', selectedPlan?.name);
      formData.append('smart_card', getValues('smart_cardno'));
      formData.append('addon_name', selectedAddons?.name ?? '');
      formData.append('addon_code', selectedAddons?.value ?? '');
      formData.append('total_price', totalprice);
      formData.append('customer_name', customerName);
      formData.append('period', period);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cablepay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      setIsLoading(false);

      if (!response.ok) {
        const text = await response.text();
        toaster.create({
          title: 'Error',
          description: `Server error ${response.status}: ${text}`,
          status: 'error',
          duration: 7000,
          type: 'error',
        });
        return;
      }

      const resp = await response.json();

      if (resp.status) {
        toaster.create({
          title: 'Success',
          description: resp.message,
          duration: 10000,
          isClosable: true,
          type: 'success',
        });
      } else {
        toaster.create({
          title: 'Error',
          description: resp.message ?? 'An error occurred',
          status: 'error',
          duration: 7000,
          type: 'error',
        });
      }
    } catch (error) {
      setIsLoading(false);
      toaster.create({
        title: 'Network Error',
        description: error.message,
        status: 'error',
        duration: 7000,
        type: 'error',
      });
    }
  };


    const SelectValue = () => {
        const select = useSelectContext()
        const items = select.selectedItems

        return (
            <Select.ValueText placeholder="Select plan">
                <HStack>
                <Avatar.Root shape="full" size="2xs">
                    <Avatar.Image src={items[0]?.img} alt={items[0]?.label} />
                </Avatar.Root>
                {items[0]?.label}
                </HStack>
            </Select.ValueText>
        )
    }

    const SelectCableValue = () => {
        const select = useSelectContext()
        const items = select.selectedItems

        return (
        <Select.ValueText placeholder="Select Cable">
            <HStack>
            {items[0]?.price} - {items[0]?.name}
            </HStack>
        </Select.ValueText>
        )
    }

    const SelectAddonValue = () => {
        const select = useSelectContext()
        const items = select.selectedItems

        return (
        <Select.ValueText placeholder="Select Addon">
            <HStack>
            {items[0]?.price} - {items[0]?.name}
            </HStack>
        </Select.ValueText>
        )
    }

    //console.log(selectedNetwork);

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
              <FiTv />
              Cable TV Subscription
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
                    <Dialog.Title>You are about to process the following transaction?</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemLabel>Cable Name</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {selectedNetwork}
                    </DataList.ItemValue>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.ItemLabel>Plan Name</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {selectedPlan?.name}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Plan Price</DataList.ItemLabel>
                    <DataList.ItemValue>
                      ₦ {selectedPlan?.price?.toLocaleString()}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Smart Card No</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {getValues('smart_cardno')}
                    </DataList.ItemValue>
                  </DataList.Item>

                   <DataList.Item>
                    <DataList.ItemLabel>Smart Card Name</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {customerName}
                    </DataList.ItemValue>
                  </DataList.Item>

                    {selectedNetwork=="DSTV" && selectedAddons && (
                        <>
                            <DataList.Item>
                                <DataList.ItemLabel>Addon name</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {selectedAddons.name}
                                </DataList.ItemValue>
                            </DataList.Item>

                            <DataList.Item>
                                <DataList.ItemLabel>Addon price</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    ₦ {selectedAddons.price?.toLocaleString()}
                                </DataList.ItemValue>
                            </DataList.Item>
                        </>

                        )
                    }

                  <DataList.Item>
                    <DataList.ItemLabel>Total Price</DataList.ItemLabel>
                    <DataList.ItemValue>
                      ₦ {totalprice.toLocaleString()}
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
          <Stack spacing={4} mb={4}>
            <Select.Root
              collection={baseNetworks}
              size="sm"
              positioning={{ sameWidth: true }}
              onValueChange={(details) => {
                const selected = baseNetworks.items.find(
                  item => item.value === details.value[0]
                )
                setSelectedNetwork(selected?.value || '')

                setisHideButton(false)
                setIsValidating(false)
                setValidationSuccess(false)
                setcustomerName('')
                setPeriodValue(1);


              }}
              className="dark"
            >
              <Select.HiddenSelect />
              <Select.Label>Select Cable Network</Select.Label>
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
                            <Avatar.Root shape="full" size="2xs" mr="2">
                              <Avatar.Image src={network.img} alt={network.label} />
                            </Avatar.Root>
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

            <Field.Root id="smart_cardno">
                <Field.Label color="black">Smart Card No</Field.Label>
                <InputGroup
                    startElement={<FaIdCard />}
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
                        placeholder="Enter Smart Card No"
                        color="black"
                        borderColor="#9ca3af"
                        type="text"
                        {...register('smart_cardno',{ required: true  })}
                    />
                   
                </InputGroup>
                 <Field.HelperText color="green"> {customerName}</Field.HelperText>
            </Field.Root>

        
                <Field.Root>
                    <Select.Root
                    collection={plans}
                    size="sm"
                    {...register('plans',{ required: "Select your desired plan"  })}
                    onValueChange={(details) => {
                        const selected = plans.items.find(
                            item => item.value === details.value[0]
                        )
                        setSelectedPlan(selected)
                    }}
                    className="dark"
                    >
                        <Select.HiddenSelect />
                        <Select.Label>Select Plan</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <SelectCableValue />
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
                                    {plans.items.map((item) => (
                                    <Select.Item item={item} key={item?.value}>
                                        <Stack gap="0">
                                        <Select.ItemText>
                                            ₦{item.price?.toLocaleString()}
                                        </Select.ItemText>
                                        <Box color="gray.500" fontSize="xs">
                                            {item?.name}
                                        </Box>
                                        </Stack>
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                    <Field.HelperText color="red">{errors.plans?.message}</Field.HelperText>
                </Field.Root>


            {selectedNetwork === 'DSTV' && isHideButton && (
              <>

                <Field.Root>
                  <Field.Label color="black">Period</Field.Label>
                  <NumberInput.Root defaultValue={periodvalue} value={periodvalue} onValueChange={(e) => setPeriodValue(e.value)}>
                    <NumberInput.Control />
                    <NumberInput.Input {...register('period',{ required: "Enter number of periods"  })} />
                  </NumberInput.Root>
                  <Field.HelperText color="red">{errors.period?.message}</Field.HelperText>
                </Field.Root>

                <Select.Root
                  collection={addons}
                  size="sm"
                  onValueChange={(details) => {

                    const selected = addons.items.find(
                      item => item.value === details.value[0]
                    )

                    setselectedAddons(selected)

                  }}
                  className="dark"
                >
                  <Select.HiddenSelect />
                  <Select.Label>Add Addon (Optional)</Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <SelectAddonValue />
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
                        {addons.items.map((framework) => (
                          <Select.Item item={framework} key={framework?.value}>
                            <Stack gap="0">
                              <Select.ItemText>
                                ₦{framework.price?.toLocaleString()}
                              </Select.ItemText>
                              <Box color="gray.500" fontSize="xs">
                                {framework?.name}
                              </Box>
                            </Stack>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </>
            )}
          </Stack>

        {isHideButton && (

            <Button
                bg="#0060d1"
                color="white"
                type="submit"
                size="md"
                w="full"
                loading={isLoading}
            >
                Continue
            </Button>

            )
        }
        </form>
        </Box>
      </Box>
  )
}
