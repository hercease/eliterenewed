'use client'

import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  Badge,
  Select,
  HStack,
  Button,
  Icon,
  Text,
  useDisclosure,
  Dialog,
  Table,
  Portal,
  createListCollection,
  GridItem,
  Grid,
  Avatar,
  Stack,
  CloseButton,
  VStack,
  DataList,
  ButtonGroup,
  Spinner
} from '@chakra-ui/react'
import {
  FiSearch,
  FiChevronLeft,
  FiWifi,
  FiChevronRight,
  FiZap,
  FiBook,
  FiTv,
  FiSmartphone,
} from 'react-icons/fi'
import { useState, useMemo, useEffect } from 'react'
import NavBar from '@/components/ui/sidebar'
import { toaster } from '@/components/ui/toaster'

export default function TransactionComponent({ user }) {

  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage, setTransactionsPerPage] = useState(8)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState([])
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

  const handleCardClick = (transaction) => {
    setSelectedTransaction(transaction)
    setOpen(true)
  }

  const frameworks = createListCollection({
    items: [
      { label: 'All Types', value: 'all' },
      { label: 'Airtime', value: 'Airtime' },
      { label: 'Data', value: 'Data' },
      { label: 'Electricity', value: 'Electricity' },
      { label: 'Cable', value: 'Cable' },
    ],
  })

  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: transactionsPerPage,
      search: searchTerm,
    };
  }, [currentPage, transactionsPerPage, searchTerm]);

  const fetchUsers = async (params) => {
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('page', params.page);
      formData.append('limit', params.limit);
      formData.append('search', params.search);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchalltransactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      const data = await res.json();
      if (data.status) {
        setTransactions(data.data);
        setTotalTransactions(data.total);
      } else {
        toaster.create({ title: 'Error', description: 'Failed to fetch transactions', type: 'error' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalTransactions / transactionsPerPage)

  useEffect(() => {
    setTransactions([]);
    fetchUsers(queryParams);
  }, [queryParams]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);



  const StatusBadge = ({ status }) => {
    const colorScheme = {
      successful: 'green',
      Successful: 'green',
      Unsuccessful: 'red',
      pending: 'orange',
      failed: 'red',
    }[status]

    return (
      <Badge colorPalette={colorScheme} variant="solid" px={2} py={1} borderRadius="full">
        {status}
      </Badge>
    )
  }

  const serviceIcons = {
    Airtime: FiSmartphone,
    Data: FiWifi,
    Electricity: FiZap,
    Education: FiBook,
    Cable: FiTv,
    Fund: FiTv,
  }

  const formatDateWithOrdinal = (dateString) => {
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

  const cardBg = 'gray.100'

  return (
    <Box minH="100vh" bg="gray.50" color="black">

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
          
        
            )
          }


      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />

      <Box p={6}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">All Transactions</Heading>
        </Flex>

        <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup flex="1" maxW={{ md: '400px' }}>
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
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
                onClick={() => handleCardClick(tx)}
              >
                <Avatar.Root size="xs" mr={2}>
                  <Avatar.Fallback>
                    <Icon as={serviceIcons[tx.type]} boxSize={3} />
                  </Avatar.Fallback>
                </Avatar.Root>

                <Box flex="1" minW={0}>
                  <Flex justify="space-between">
                    <Text fontWeight="medium" isTruncated>{tx.type}</Text>
                    <Text fontWeight="bold">₦ {tx.amount.toLocaleString()}</Text>
                  </Flex>
                  <Flex justify="space-between" color="gray.500">
                    <Text fontSize="xs" isTruncated>{tx.recipient}</Text>
                    <Text fontSize="xs">
                      {new Date(tx.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit',
                      })}
                    </Text>
                  </Flex>
                </Box>

                <Box ml={2}>
                  <StatusBadge status={tx.status} />
                </Box>
              </Flex>
            ))
          ) : (
            <Box textAlign="center" py={4} color="gray.500">
              No transactions found
            </Box>
          )}
        </Stack>

        <VStack alignItems="start">
          <Dialog.Root
            colorPalette="gray"
            placement="center"
            size="full"
            closeOnInteractOutside={false}
            motionPreset="slide-in-bottom"
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
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
                        <DataList.ItemValue>{selectedTransaction?.description}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Amount</DataList.ItemLabel>
                        <DataList.ItemValue>₦{selectedTransaction?.amount?.toLocaleString()}</DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.ItemLabel>Description</DataList.ItemLabel>
                        <DataList.ItemValue>{selectedTransaction?.comment}</DataList.ItemValue>
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
        </VStack>

        {/* Pagination */}
          <Flex align="center" mt={8}>
            <Text fontSize="sm" color="gray.500">
              Showing {(currentPage - 1) * transactionsPerPage + 1}–
              {Math.min(currentPage * transactionsPerPage, totalTransactions)} of {totalTransactions} transactions
            </Text>
          </Flex>
          <Flex align="center" mt={3}>
            <ButtonGroup size="xs" isAttached variant="subtle">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                isDisabled={currentPage === 1}
              >
                <FiChevronLeft /> Previous
              </Button>
  
              {Array.from({ length: Math.min(3, totalPages) }).map((_, idx) => {
                let pageNum
                if (totalPages <= 5) pageNum = idx + 1
                else if (currentPage <= 3) pageNum = idx + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + idx
                else pageNum = currentPage - 2 + idx
  
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    variant={currentPage === pageNum ? 'solid' : 'subtle'}
                    colorPalette={currentPage === pageNum ? 'blue' : 'gray'}
                  >
                    {pageNum}
                  </Button>
                )
              })}
  
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                isDisabled={currentPage === totalPages}
              >
                Next <FiChevronRight />
              </Button>
            </ButtonGroup>
          </Flex>
      </Box>
    </Box>
  )
}
