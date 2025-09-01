'use client'

import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  Badge,
  HStack,
  Button,
  Icon,
  Text,
  Dialog,
  Portal,
  createListCollection,
  Avatar,
  Stack,
  CloseButton,
  VStack,
  DataList,
  ButtonGroup,
  Spinner
} from '@chakra-ui/react'
import {
  FiClock,
  FiChevronLeft,
  FiWifi,
  FiChevronRight,
  FiZap,
  FiBook,
  FiTv,
  FiSmartphone,
  FiDollarSign,
  FiCreditCard,
} from 'react-icons/fi'
import { useState, useMemo, useEffect, useCallback } from 'react'
import NavBar from '@/components/ui/sidebar'
import { toaster } from '@/components/ui/toaster'

// Constants
const TRANSACTIONS_PER_PAGE = 8
const SERVICE_ICONS = {
  Airtime: FiSmartphone,
  Data: FiWifi,
  Electricity: FiZap,
  Education: FiBook,
  Cable: FiTv,
  Fund: FiCreditCard,
  Recruit: FiUser,
}

export default function MyTransactionComponent({ user }) {
  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [userdetails, setUserDetails] = useState(null)
  const cardBg = 'gray.100'

  // Fetch user profile
  useEffect(() => {
    if (!user) return

    const fetchProfileInfo = async () => {
      const formData = new URLSearchParams()
      formData.append('username', user)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        })
        const resp = await res.json()
        setUserDetails(resp)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfileInfo()
  }, [user])

  // Memoized query parameters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: TRANSACTIONS_PER_PAGE,
    search: searchTerm,
    username: user
  }), [currentPage, searchTerm, user])

  // Fetch transactions
  const fetchTransactions = useCallback(async (params) => {
    setIsLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('page', params.page)
      formData.append('limit', params.limit)
      formData.append('search', params.search)
      formData.append('username', params.username)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchusertransactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()
      if (data.status) {
        setTransactions(data.data)
        setTotalTransactions(data.total)
      }
    } catch (error) {
      console.error('Transaction fetch error:', error)
      toaster.create({ 
        title: 'Error', 
        description: 'Failed to fetch transactions', 
        type: 'error' 
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch transactions when params change
  useEffect(() => {
    fetchTransactions(queryParams)
  }, [queryParams, fetchTransactions])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Helper components
  const StatusBadge = ({ status }) => {
    const colorScheme = {
      successful: 'green',
      unsuccessful: 'red',
      pending: 'orange',
      failed: 'red',
    }[status]

    return (
      <Badge colorPalette={colorScheme} variant="solid" px={2} py={1} borderRadius="full">
        {status}
      </Badge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateWithOrdinal = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'long' })
    const year = date.getFullYear()
    
    const getOrdinal = (n) => {
      const s = ['th', 'st', 'nd', 'rd']
      const v = n % 100
      return n + (s[(v - 20) % 10] || s[v] || s[0])
    }
    
    return `${getOrdinal(day)} ${month} ${year}`
  }

  const handleCardClick = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDialogOpen(true)
  }

  // Pagination logic
  const totalPages = Math.ceil(totalTransactions / TRANSACTIONS_PER_PAGE)
  const paginationRange = useMemo(() => {
    const range = []
    const maxVisiblePages = 3
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i)
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2)
      let start = Math.max(1, currentPage - half)
      const end = Math.min(totalPages, start + maxVisiblePages - 1)
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1)
      }
      
      for (let i = start; i <= end; i++) {
        range.push(i)
      }
    }
    
    return range
  }, [currentPage, totalPages])

  return (
    <Box 
      minH="100vh" 
      bg="gray.50"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat"
      color="black"
    >
      {isLoading && (
        <Flex
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(255, 255, 255, 0.8)"
          align="center"
          justify="center"
          zIndex={9999}
        >
          <Spinner size="xl" />
        </Flex>
      )}

      <NavBar isAdmin={userdetails?.data?.isAdmin} name={userdetails?.data?.username} />

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
              <FiClock /> 
              <Text>My Transactions</Text>
            </HStack>
          </Heading>
        </Flex>

        <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup flex="1">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark"
            />
          </InputGroup>
        </Flex>

        <Stack spacing={2} mb={4}>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <Flex
                key={tx.id}
                p={2}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                align="center"
                fontSize="sm"
                cursor="pointer"
                _hover={{ bg: 'gray.200' }}
                transition="background 0.2s"
                onClick={() => handleCardClick(tx)}
              >
                <Avatar.Root size="xs" mr={2}>
                  <Avatar.Fallback>
                    <Icon as={SERVICE_ICONS[tx.type] || FiDollarSign} boxSize={3} />
                  </Avatar.Fallback>
                </Avatar.Root>

                <Box flex="1" minW={0}>
                  <Flex justify="space-between">
                    <Text fontWeight="medium" isTruncated>{tx.type}</Text>
                    <Text fontWeight="bold">₦{tx.amount?.toLocaleString() || '0'}</Text>
                  </Flex>
                  <Flex justify="space-between" color="gray.500">
                    <Text fontSize="xs" isTruncated>{tx.recipient || 'N/A'}</Text>
                    <Text fontSize="xs">{formatDate(tx.date)}</Text>
                  </Flex>
                </Box>

                <Box ml={2}>
                  <StatusBadge status={tx.status} />
                </Box>
              </Flex>
            ))
          ) : (
            <Box textAlign="center" py={4} color="gray.500">
              {isLoading ? 'Loading transactions...' : 'No transactions found'}
            </Box>
          )}
        </Stack>

        {/* Transaction Details Dialog */}
        <Dialog.Root
          colorPalette="gray"
          placement="center"
          size="full"
          closeOnInteractOutside={false}
          motionPreset="slide-in-bottom"
          lazyMount
          open={isDialogOpen}
          onOpenChange={(e) => setIsDialogOpen(e.open)}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Transaction Details</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  <DataList.Root orientation="horizontal">
                    <DataList.Item>
                      <DataList.ItemLabel>Status</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <StatusBadge status={selectedTransaction?.status} />
                      </DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Type</DataList.ItemLabel>
                      <DataList.ItemValue>{selectedTransaction?.description || 'N/A'}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Amount</DataList.ItemLabel>
                      <DataList.ItemValue>₦{selectedTransaction?.amount?.toLocaleString() || '0'}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Description</DataList.ItemLabel>
                      <DataList.ItemValue>{selectedTransaction?.comment || 'N/A'}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                      <DataList.ItemLabel>Date</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {selectedTransaction?.date && formatDateWithOrdinal(selectedTransaction.date)}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        {/* Pagination */}
        {totalTransactions > 0 && (
          <Flex direction="column" mt={8}>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Showing {(currentPage - 1) * TRANSACTIONS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * TRANSACTIONS_PER_PAGE, totalTransactions)} of{' '}
              {totalTransactions} transactions
            </Text>
            
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                isDisabled={currentPage === 1}
                variant='solid'
              >
              <FiChevronLeft />  Prev
              </Button>
              
              {paginationRange.map(page => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? 'solid' : 'subtle'}
                  colorScheme={currentPage === page ? 'blue' : 'gray'}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                isDisabled={currentPage === totalPages}
                variant='solid'
              >
                Next <FiChevronRight />
              </Button>
            </ButtonGroup>
          </Flex>
        )}
      </Box>
    </Box>
  )
}