'use client'

import {
  Box,
  Flex,
  Drawer,
  VStack,
  IconButton,
  Avatar,
  Menu,
  Text,
  Heading,
  Card,
  Button,
  Portal,
  CloseButton,
  Link,
  HStack,
  Icon,
  Grid, GridItem, Stack, Badge, Tag, defineStyle, Spinner
} from '@chakra-ui/react'
import {
  FiMenu,
  FiUser,
  FiHome,
  FiDollarSign,
  FiWifi,
  FiBook,
  FiZap,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSmartphone,
  FiTv,
  FiKey,
  FiSettings
} from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { LuDollarSign } from "react-icons/lu"
import Image from 'next/image';
import { useRouter } from 'next/navigation' // For App Router
import { Suspense } from 'react'
import { toaster } from "@/components/ui/toaster"

import dynamic from 'next/dynamic'

const NavBar = dynamic(() => import('@/components/ui/sidebar'), {
  ssr: false,
  loading: () => <Spinner />
})

export default function DashboardComponent({user}) {

  const router = useRouter();

  const [stat, setStat] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [userdetails, setUserDetails] = useState(null)
  
  const service = [
    { label: 'Airtime', icon: <FiSmartphone />, color: 'blue', path: '/airtime' },
    { label: 'Data', icon: <FiWifi />, color: 'green', path: '/data' },
    { label: 'Cable', icon: <FiTv />, color: 'orange', path: '/cable' },
    { label: 'Electricity', icon: <FiZap />, color: 'yellow', path: '/electricity' },
    { label: 'Education', icon: <FiBook />, color: 'purple', path: '/education' },
  ]

useEffect(() => {
  if (!user) return;

  const formData = new URLSearchParams()
  formData.append('username', user)

  setIsLoading(true)

  Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchdashboardstats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    }).then(res => res.json()),

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    }).then(res => res.json()),
  ])
    .then(([stats, profile]) => {
      setStat(stats)
      setTransactions(stats.trans_history || [])
      setUserDetails(profile)
    })
    .catch(error => {
      toaster.create({ title: 'Error', description: error.message, type: 'error' })
    })
    .finally(() => setIsLoading(false))
}, [user])


  const stats = [
    {
      label: 'Wallet',
      value:  stat?.wallet || '0',
      bg: 'pink.400',
      color: 'black',
      imgSrc: '/airtel.png',
      shadow: true,
    },
    {
      label: 'Electricity',
      value:  stat?.electricity || '0',
      bg: 'gray.800',
      color: 'white',
      imgSrc: '/electric_images.jpg',
      shadow: true,
    },
    {
      label: 'Airtime',
      value:  stat?.airtime,
      bg: 'red.700',
      color: 'white',
      imgSrc: '/airtime_images.jpg',
      shadow: true,
    },
    {
      label: 'Data',
      value: stat?.data,
      bg: 'gray.600',
      color: 'white',
      imgSrc: '/airtime_images.jpg',
      shadow: true,
    },
    {
      label: 'Education',
      value: stat?.education,
      bg: 'cyan.600',
      color: 'white',
      imgSrc: '/airtime_images.jpg',
      shadow: true,
    },
    {
      label: 'Cable',
      value: stat?.cable,
      bg: 'purple.600',
      color: 'white',
      imgSrc: '/airtime_images.jpg',
      shadow: true,
    },
  ];

  /*const transactions = [
    { id: 'TX-1001', type: 'Airtime', amount: 5000, status: 'completed', date: '2023-06-15', recipient: 'MTN Nigeria' },
    { id: 'TX-1002', type: 'Data', amount: 3500, status: 'completed', date: '2023-06-14', recipient: 'Airtel Nigeria' },
    { id: 'TX-1003', type: 'Electricity', amount: 12500, status: 'failed', date: '2023-06-14', recipient: 'IKEDC' },
    { id: 'TX-1004', type: 'Education', amount: 7500, status: 'pending', date: '2023-06-13', recipient: 'University of Lagos' },
    { id: 'TX-1005', type: 'Cable', amount: 4500, status: 'completed', date: '2023-06-12', recipient: 'DStv' },
    { id: 'TX-1006', type: 'Airtime', amount: 2000, status: 'completed', date: '2023-06-11', recipient: 'Glo Nigeria' },
    { id: 'TX-1007', type: 'Data', amount: 5000, status: 'completed', date: '2023-06-10', recipient: '9mobile' },
    { id: 'TX-1008', type: 'Electricity', amount: 8000, status: 'completed', date: '2023-06-09', recipient: 'EKEDC' },
  ]*/

  return (

    <Box minH="100vh" bg="gray.50">

      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />

      <Box p={4}>
        <Heading color="black" size="lg" mb={6}>
          Dashboard
        </Heading>

        <Grid templateColumns={{ base: '1fr 1fr' }} gap={4}>
            {stats.map((stat, idx) => (
            <GridItem key={idx}>
                <StatCard
                label={stat.label}
                value={stat.value}
                bg={stat.bg}
                color={stat.color}
                shadow={stat.shadow}
                />
            </GridItem>
            ))}
        </Grid>

      </Box>

      <Box p={4}>

        <Heading color="black" size="md" mb={6}>Our Services</Heading>
        
        <Grid
          templateColumns={{
            base: 'repeat(4, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)'
          }}
          gap={{ base: 2, md: 6 }}
        >

          {service.map((service, idx) => (
            <ServiceItem
              key={idx}
              icon={service.icon}
              label={service.label}
              color={service.color}
            />
           ))}
          
        </Grid>
      </Box>

         <Box p={4} mb={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading color="black" size="md">Recent Transactions</Heading>
            <Button 
              variant="link" 
              color="black" 
              size="sm"
              onClick={() => router.push('/transactionhistory')}
            >
              View All <FiChevronRight />
            </Button>
          </Flex>

          <Stack spacing={2} mb={4}>
            {transactions.length > 0 && transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </Stack>
        </Box>

    </Box>
  )

}

// Reusable NavItem component
function NavItem({ icon, children, active, ...rest }) {
  return (
    <Box
      as="button"
      w="full"
      px={4}
      py={3}
      textAlign="left"
      bg={active ? 'blue.50' : 'transparent'}
      color={active ? 'blue.600' : 'gray.600'}
      _hover={{
        bg: 'gray.100'
      }}
      {...rest}
    >
      <Flex align="center">
        <Box mr={3}>{icon}</Box>
        <Text fontWeight="medium">{children}</Text>
      </Flex>
    </Box>
  )
}

// Reusable StatCard component
function StatCard({ label, value, bg, color, shadow = false }) {
  return (
    <Card.Root
      bg={bg}
      color={color}
      p="3"
      border="0"
      borderRadius="lg"
      boxShadow={shadow ? 'md' : 'none'}
    >
      <Card.Body p="0">
        <Flex align="center">
          <Box>
            <Text fontSize="xs" mb="1">{label}</Text>
            <Text fontWeight="bold">₦{value}</Text>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

function TransactionItem({ transaction }) {
  const StatusBadge = ({ status }) => {
    const colorScheme = {
      successful: 'green',
      pending: 'orange',
      failed: 'red',
      unsuccessful: 'red'
    }[status]
    
    return (
      <Badge colorPalette={colorScheme} variant="solid" px={2} py={1} borderRadius="full">
        {status}
      </Badge>
    )
  }

  const serviceIcons = {
    Airtime: FiWifi,
    Data: FiWifi,
    Electricity: FiZap,
    Education: FiBook,
    Payment: FiDollarSign,
    Cable: FiTv,
    Fund: FiDollarSign 
  }

  const IconComponent = serviceIcons[transaction.type] || FiDollarSign

  return (
          <Flex
              key={transaction.id}
              p={2}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="white"
              align="center"
              fontSize="sm"
            >
              <Avatar.Root
                size="xs"
                bg=""
                color=""
                mr={2}
              ><Avatar.Fallback><Icon as={IconComponent} boxSize={3} /></Avatar.Fallback></Avatar.Root>
              
              <Box flex="1" minW={0}>
                <Flex color="gray.800" justify="space-between">
                  <Text fontWeight="medium" isTruncated>{transaction.type}</Text>
                  <Text fontWeight="bold">₦{transaction.amount.toLocaleString()}</Text>
                </Flex>
                <Flex justify="space-between" color="gray.500">
                  <Text fontSize="xs" isTruncated>{transaction.recipient}</Text>
                  <Text fontSize="xs">
                    {new Date(transaction.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: '2-digit' 
                    })}
                  </Text>
                </Flex>
              </Box>
              
              <Box ml={2}>
                <StatusBadge status={transaction.status} />
              </Box>
            </Flex>
  
  )
}

function TransactionCard({ transaction }) {
  const bgColor = 'gray.700';
  const borderColor = 'gray.600';

  return (
    <GridItem>
      <Card.Root
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        boxShadow="sm"
        _hover={{
          boxShadow: 'md',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease'
        }}
      >
        <Card.Body>
          <Stack spacing={3}>
            <Flex justify="space-between" align="center">
              <Heading size="sm">#{transaction.id}</Heading>
              <TransactionStatus status={transaction.status} />
            </Flex>

            <Flex align="center">
              <ServiceIcon service={transaction.service} mr={3} />
              <Box>
                <Text fontWeight="medium">{transaction.service}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Text>
              </Box>
            </Flex>

            <Flex justify="space-between" align="flex-end">
              <Box>
                <Text fontSize="sm" color="gray.500">Amount</Text>
                <Text fontSize="xl" fontWeight="bold">
                  ₦{transaction.amount.toLocaleString()}
                </Text>
              </Box>
              <Button 
                size="sm" 
                variant="outline" 
                colorScheme="brand"
                rightIcon={<FiChevronRight />}
              >
                Details
              </Button>
            </Flex>
          </Stack>
        </Card.Body>
      </Card.Root>
    </GridItem>
  )
}

// Updated ServiceIcon component (now accepts mr prop)
function ServiceIcon({ service, ...props }) {

  const icons = {
    'Airtime': <FiWifi />,
    'Data': <FiWifi />,
    'Electricity': <FiZap />,
    'Education': <FiBook />,
    'Payment': <FiDollarSign />
  }

  const colors = {
    'Airtime': 'blue',
    'Data': 'purple',
    'Electricity': 'yellow',
    'Education': 'orange',
    'Payment': 'green'
  }

  return (
    <Tag.Root 
      colorScheme={colors[service] || 'gray'} 
      size="lg" 
      borderRadius="full"
      {...props}
    >
        <Tag.StartElement>
            {icons[service] || FiDollarSign}
        </Tag.StartElement>
      <Tag.Label>{service}</Tag.Label>
    </Tag.Root>
  )
}

function TransactionStatus({ status }) {
  const statusConfig = {
    'completed': {
      icon: FiCheckCircle,
      color: 'green',
      label: 'Completed'
    },
    'pending': {
      icon: FiClock,
      color: 'orange',
      label: 'Pending'
    },
    'failed': {
      icon: FiAlertCircle,
      color: 'red',
      label: 'Failed'
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge 
      color={config.color}
      variant="muted"
      fontSize="2xs"
      px={2}
      borderRadius="full"
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Icon as={config.icon} boxSize={3} />
      <Text fontSize="sm">{config.label}</Text>
    </Badge>
  )
}

function ServiceItem({ icon, label, color, path }) {

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: `${color}.600`,
    outlineOffset: "2px",
    outlineStyle: "solid",
  })

  return (
    <VStack spacing={3} textAlign="center">
        <Link 
              href={path} 
              _hover={{ textDecoration: 'none' }}
              display="block"
            >
      <Avatar.Root variant="" css={ringCss}>
          <Avatar.Fallback size="md"  color={`${color}.600`}>{icon}</Avatar.Fallback>
      </Avatar.Root>
      <Text fontSize="sm" color="black" fontWeight="medium">{label}</Text>
      </Link>
    </VStack>
    
  )
}