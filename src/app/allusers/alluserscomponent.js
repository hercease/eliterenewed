'use client'

import {
  Box, Flex, Heading, Input, InputGroup, Spinner, Button,
  Badge, Avatar, Text, Menu, MenuList, MenuItem, HStack, Tag,
  Grid, Card, Stack, ButtonGroup, Portal
} from '@chakra-ui/react'

import {
  FiMoreVertical, FiSearch, FiUser, FiUsers,
  FiCalendar, FiTrash2, FiCheckCircle, FiChevronLeft, FiChevronRight
} from 'react-icons/fi'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { toaster } from '@/components/ui/toaster'
import NavBar from '@/components/ui/sidebar'

export default function UserManagement({ user }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 8
  const [totalUsers, setTotalUsers] = useState(0)
  const [userDetails, setUserDetails] = useState(null)

  const totalPages = useMemo(() => Math.ceil(totalUsers / usersPerPage), [totalUsers])

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: usersPerPage,
    search: searchTerm,
  }), [currentPage, usersPerPage, searchTerm])

  const fetchProfileInfo = useCallback(async () => {
    if (!user) return

    const formData = new URLSearchParams({ username: user })
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchprofileinfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    })
    const data = await res.json()
    setUserDetails(data)
  }, [user])

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    try {
      const formData = new URLSearchParams({
        page: queryParams.page,
        limit: queryParams.limit,
        search: queryParams.search,
      })

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchallusers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      const data = await res.json()
      if (data.status) {
        setUsers(data.data)
        setTotalUsers(data.total)
      } else {
        toaster.create({ title: 'Error', description: 'Failed to fetch users', type: 'error' })
      }
    } catch (error) {
      toaster.create({ title: 'Error', description: error.message, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }, [queryParams])

  useEffect(() => {
    fetchProfileInfo()
  }, [fetchProfileInfo])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = (userId) => {
    toaster.create({
      title: 'User Deleted',
      description: `User ID ${userId} has been removed`,
      type: 'success'
    })
  }

  const toggleStatus = (userId, status) => {
    const newStatus = status === 'active' ? 'inactive' : 'active'
    toaster.create({
      title: 'Status updated',
      description: `User status changed to ${newStatus}`,
      type: 'success'
    })
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <Box minH="100vh" bg="gray.50" color="black"
      bgImage="url('https://www.transparenttextures.com/patterns/exclusive-paper.png')"
      bgRepeat="repeat">

      {isLoading && (
        <Flex position="fixed" top="0" left="0" right="0" bottom="0" bg="rgba(255, 255, 255, 0.8)" zIndex="9999" align="center" justify="center">
          <Spinner size="xl" />
        </Flex>
      )}

      <NavBar isAdmin={userDetails?.data?.isAdmin} name={userDetails?.data?.username} />

      <Box p={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg" color="black">
            <HStack><FiUsers /> <Text>Registered Users</Text></HStack>
          </Heading>
        </Flex>

        <InputGroup mb={6} maxW="400px">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </InputGroup>

        <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} gap={6}>
          {users.length > 0 ? (
            users.map((user) => (
            <Card.Root key={user.id} boxShadow="sm" _hover={{ boxShadow: 'md' }}>
              <Card.Header pb={0}>
                <Flex justify="space-between" align="center">
                    <Avatar.Root size="xs" bg="" color="white" mr={2}>
                      <Avatar.Fallback name={user.username} />
                    </Avatar.Root>

                    <Menu.Root>
                      <Menu.Trigger asChild>
                          <Button variant="subtle" size="sm">
                              Action <FiMoreVertical />
                          </Button>
                      </Menu.Trigger>
                      <Portal>
                          <Menu.Positioner>
                              <Menu.Content>
                                  <Menu.Item onClick={() => toggleStatus(user.id, user.status)} color={user.status === 'active' ? 'red.500' : 'green.500'} value=""><FiCheckCircle /> {user.status === 'active' ? 'Deactivate' : 'Activate'} </Menu.Item>
                                  <Menu.Item color="red.500" onClick={() => handleDelete(user.id)}> <FiTrash2 /> Delete</Menu.Item>
                              </Menu.Content>
                          </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                </Flex>
              </Card.Header>

              <Card.Body>
                <Stack spacing={3}>
                  <Box>
                    <Text fontWeight="bold">{user.username}</Text>
                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                  </Box>

                  <Flex justify="space-between" align="center">
                    <Tag.Root colorPalette="blue" size="sm">
                      <Tag.Label>₦{user.balance.toLocaleString()}</Tag.Label>
                    </Tag.Root>
                    <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>{user.status}</Badge>
                  </Flex>

                  <Stack spacing={1} fontSize="sm">
                    <HStack><FiCalendar /><Text>Joined: {formatDate(user.regDate)}</Text></HStack>
                    <HStack><FiUser /><Text>Sponsor: {user.sponsor}</Text></HStack>
                  </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>
            ))
            ) : (
              <Box textAlign="center" py={8} color="gray.500">
                {isLoading ? 'Loading users...' : 'No users found'}
              </Box>
            )}
        </Grid>

       {users.length > 0 && (

        <Flex align="center" mt={8} justify="space-between" flexWrap="wrap">
          <Text fontSize="sm" color="gray.500" mb={2}>
            Showing {(currentPage - 1) * usersPerPage + 1} - {' '}{Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
          </Text>

          <ButtonGroup size="sm" isAttached>
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} isDisabled={currentPage === 1}>
              <FiChevronLeft /> Prev
            </Button>

            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNum = totalPages <= 5
                ? i + 1
                : currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 1 + i

              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  variant={currentPage === pageNum ? 'solid' : 'subtle'}
                  colorScheme={currentPage === pageNum ? 'blue' : 'gray'}
                >
                  {pageNum}
                </Button>
              )
            })}

            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} isDisabled={currentPage === totalPages}>
              Next <FiChevronRight />
            </Button>
          </ButtonGroup>
        </Flex>

       )}
     
      </Box>
    </Box>
  )
}
