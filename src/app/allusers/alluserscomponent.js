'use client'

import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  Spinner,
  Button,
  Badge,
  Avatar,
  Text,
  MenuItem,
  IconButton,
  Tag,
  Grid,
  Card,
  Stack,
  ButtonGroup,
  Menu,
  MenuList,
  Portal
} from '@chakra-ui/react'

import {
  FiMoreVertical,
  FiSearch,
  FiUser,
  FiMail,
  FiDollarSign,
  FiCalendar,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'

import { useEffect, useState, useMemo } from 'react'
import { toaster } from '@/components/ui/toaster'
import NavBar from '@/components/ui/sidebar'

export default function UserManagement({user}) {

  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(8)
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(false)
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

  const queryParams = useMemo(() => {
    return {
      page: currentPage,
      limit: usersPerPage,
      search: searchTerm,
    };
  }, [currentPage, usersPerPage, searchTerm]);

  const fetchUsers = async (params) => {
    setIsLoading(true)
    try {

      const formData = new URLSearchParams()
      formData.append('page', params.page);
      formData.append('limit', params.limit);
      formData.append('search', params.search);

      console.log(formData.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/fetchallusers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })

      const data = await res.json()
      console.log(data)
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
  }

 
    useEffect(() => {
      setUsers([]);
      fetchUsers(queryParams);
    }, [queryParams]);

  const totalPages = Math.ceil(totalUsers / usersPerPage)

  const handleDelete = (userId) => {
    toaster.create({
      title: 'User Deleted',
      description: `User ID ${userId} has been removed`,
      type: 'success'
    })
  }

  const toggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    toaster.create({
      title: 'Status updated',
      description: `User status changed to ${newStatus}`,
      type: 'success'
    })
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
   
    

    <Box minH="100vh" bg="gray.100" color="black">
      
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
          <Heading size="lg">Registered Users</Heading>
        </Flex>

        {/* Search */}
        <Flex mb={6} gap={4} direction={{ base: 'column', md: 'row' }}>
          <InputGroup flex="1" maxW={{ md: '400px' }}>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </InputGroup>
        </Flex>

        {/* Users Grid */}
        <Grid
          templateColumns={{
            base: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
          }}
          gap={6}
        >
          {users.map((user) => (
            <Card.Root key={user.id}  boxShadow="sm" _hover={{ boxShadow: 'md' }}>
              <Card.Header pb={0}>
                <Flex justify="space-between" align="center">
                   <Avatar.Root size="xs" bg="" color="white" mr={2}><Avatar.Fallback name={user.username} /></Avatar.Root>
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
                    <Text fontSize="lg" fontWeight="bold">{user.username}</Text>
                    <Text fontSize="sm" color="gray.500">{user.email}</Text>
                  </Box>

                  <Flex justify="space-between" align="center">
                     <Tag.Root colorPalette="blue" size="sm">
                        <Tag.Label>₦{user.balance.toLocaleString()}</Tag.Label>
                      </Tag.Root>
                    <Badge colorScheme={user.status === 'active' ? 'green' : 'red'}>
                      {user.status}
                    </Badge>
                  </Flex>

                  <Stack spacing={1} fontSize="sm">
                  <Flex align="center">
                    <FiCalendar style={{ marginRight: '8px', color: '#718096' }} />
                    <Text>Joined: {formatDate(user.regDate)}</Text>
                  </Flex>
                  <Flex align="center">
                    <FiUser style={{ marginRight: '8px', color: '#718096' }} />
                    <Text>Sponsor: {user.sponsor}</Text>
                  </Flex>
                </Stack>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>

        {/* Pagination */}
        <Flex align="center" mt={8}>
          <Text fontSize="sm" color="gray.500">
            Showing {(currentPage - 1) * usersPerPage + 1}–
            {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers} users
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
