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
  Avatar,
  Stack,
  CloseButton,
  VStack,
  DataList,
  ButtonGroup,
  Spinner
} from '@chakra-ui/react'
import {
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { useState, useMemo, useEffect, useCallback } from 'react'
import NavBar from '@/components/ui/sidebar'

export default function MyReferralsComponent({ user }) {
  // State management
  const [searchTerm, setSearchTerm] = useState('')
  const [referrals, setReferrals] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [userdetails, setUserDetails] = useState(null)
  
  // Constants
  const REFERRALS_PER_PAGE = 8
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
    limit: REFERRALS_PER_PAGE,
    search: searchTerm,
    username: user
  }), [currentPage, searchTerm, user])

  // Fetch referrals
  const fetchReferrals = useCallback(async (params) => {
    setIsLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('page', params.page)
      formData.append('limit', params.limit)
      formData.append('search', params.search)
      formData.append('username', params.username)

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchmyreferrals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()
      if (data.status) {
        setReferrals(data.data)
        setTotalReferrals(data.total)
      }
    } catch (error) {
      console.error('Referral fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch referrals when params change
  useEffect(() => {
    fetchReferrals(queryParams)
  }, [queryParams, fetchReferrals])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Pagination logic
  const totalPages = Math.ceil(totalReferrals / REFERRALS_PER_PAGE)
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

      <NavBar isAdmin={userdetails?.data.isAdmin} name={userdetails?.data.username} />

      <Box p={6}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading color="black" size="lg">
            <HStack spacing={2}>
              <FiUsers /> 
              <Text>My Elite Recruits</Text>
            </HStack>
          </Heading>
        </Flex>

        <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup flex="1" maxW={{ md: '400px' }}>
            <Input
              placeholder="Search your recruits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Stack spacing={2} mb={4}>
          {referrals.length > 0 ? (
            referrals.map((referral) => (
              <Flex
                key={referral.id}
                p={3}
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.500"
                align="center"
                fontSize="sm"
              >
                <Avatar.Root size="xs" mr={2}>
                    <Avatar.Fallback size="sm" name={referral.username} />
                </Avatar.Root>

                <Box flex="1" minW={0}>
                  <Flex justify="space-between">
                    <Text fontWeight="medium" isTruncated>{referral.username}</Text>
                  </Flex>
                  <Flex justify="space-between" color="gray.500">
                    <Text fontSize="xs">{formatDate(referral.date)}</Text>
                  </Flex>
                </Box>
              </Flex>
            ))
          ) : (
            <Box textAlign="center" py={4} color="gray.500">
              {isLoading ? 'Loading recruits...' : 'No recruits found'}
            </Box>
          )}
        </Stack>

        {/* Pagination */}
        {totalReferrals > 0 && (
          <Flex direction="column" mt={8}>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Showing {(currentPage - 1) * REFERRALS_PER_PAGE + 1} -{' '}
              {Math.min(currentPage * REFERRALS_PER_PAGE, totalReferrals)} of{' '}
              {totalReferrals} recruits
            </Text>
            
            <ButtonGroup size="sm" isAttached variant="subtle">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                isDisabled={currentPage === 1}
                leftIcon={<FiChevronLeft />}
              >
                Previous
              </Button>
              
              {paginationRange.map(page => (
                <Button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  variant={currentPage === page ? 'solid' : 'subtle'}
                  colorPalette={currentPage === page ? 'blue' : 'gray'}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                isDisabled={currentPage === totalPages}
                rightIcon={<FiChevronRight />}
              >
                Next
              </Button>
            </ButtonGroup>
          </Flex>
        )}
      </Box>
    </Box>
  )
}