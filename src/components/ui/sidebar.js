import {
  Drawer,
  Flex,
  CloseButton,
  IconButton,
  VStack,
  Box,
  Text,
  Heading,
  Menu,
   Avatar,
    Portal,
    Link
} from "@chakra-ui/react"
import Image from "next/image"
import { FiMenu,
  FiUser,
  FiHome,
  FiDollarSign,
  FiWifi,
  FiBook,
  FiZap,
  FiUsers,
  FiClock,
  FiSmartphone,
  FiTv,
  FiKey, FiCreditCard } from "react-icons/fi"
import { FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation' // For App Router
import { parseCookies, setCookie, destroyCookie } from 'nookies';


export default function Sidebar({ isAdmin, name }) {

 const [isDrawerOpen, setDrawerOpen] = useState(false)
 const [activeNavItem, setActiveNavItem] = useState('dashboard')
 const router = useRouter();
 const pathname = usePathname();
const currentPage = pathname.split('/')[1]; // removes leading slash
  function Logout(){
		destroyCookie(null, 'elitetoken'); router.push('/login')
	}


  return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            p={3}
            bg="#0060d1"
            boxShadow="sm"
            position="sticky"
            top={0}
            zIndex={10}
          >
    
            <Drawer.Root  open={isDrawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)}>
              <Drawer.Trigger asChild>
                <IconButton aria-label="Open menu" variant="">
                    <FiMenu color="white" />
                </IconButton>
              </Drawer.Trigger>
    
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content background="#ffffff">
                  <Drawer.Header>
                    <Drawer.Title><Image src="/elite_png.png" alt="elite Image" width={140} height={50}  /></Drawer.Title>
                    <Drawer.CloseTrigger asChild>
                      <CloseButton position="absolute" right="3" top="3" />
                    </Drawer.CloseTrigger>
                  </Drawer.Header>
                  <Drawer.Body p={0}>
                    <VStack align="stretch" spacing={0}>
    
                      <Box px={4} py={2}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" mb={1}>Main</Text>
                        <NavItem icon={<FiHome />} active={currentPage === 'dashboard'} onClick={() => handleClick('dashboard')}>
                          Dashboard
                        </NavItem>
                      </Box>
                      {isAdmin && (
                        <Box px={4} py={2}>
                          <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" mb={1}>Admin</Text>
                          <NavItem icon={<FiUser />} active={currentPage === 'allusers'} onClick={() => handleClick('allusers')}>
                            All Users
                          </NavItem>
                          <NavItem icon={<FiClock />} active={currentPage === 'alltransactions'} onClick={() => handleClick('alltransactions')}>
                            All Transactions
                          </NavItem>
                        </Box>
                      )}
    
    
                      <Box px={4} py={2}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" mb={1}>Services</Text>
                        {[
                          { label: 'Airtime', key: 'airtimerecharge',  icon: <FiSmartphone /> },
                          { label: 'Data', key: 'datarecharge',  icon: <FiWifi /> },
                          { label: 'Electricity', key: 'electricity', icon: <FiZap /> },
                          { label: 'Cable', key: 'cabletv', icon: <FiTv /> },
                        ].map((item) => (
                          <NavItem
                            key={item.key}
                            icon={item.icon}
                            active={currentPage === item.key}
                            onClick={() => handleClick(item.key)}
                          >
                            {item.label}
                          </NavItem>
                        ))}
                      </Box>
    
                      <Box px={4} py={2}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" mb={1}>Activities</Text>
                        <NavItem icon={<FiClock />} active={currentPage === 'transactionhistory'} onClick={() => handleClick('transactionhistory')}>
                          Transaction History
                        </NavItem>
                        <NavItem icon="₦" active={currentPage === 'fundwallet'} onClick={() => handleClick('fundwallet')}>
                          Fund wallet
                        </NavItem>
                        <NavItem icon={<FiCreditCard />} active={currentPage === 'fundtransfer'} onClick={() => handleClick('fundtransfer')}>
                          Fund Transfer
                        </NavItem>
                      </Box>
    
                      <Box px={4} py={2}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" mb={1}>Account</Text>
                        <NavItem icon={<FiUser />} active={currentPage === 'profile'} onClick={() => handleClick('profile')}>
                          Profile
                        </NavItem>
                        <NavItem icon={<FiUsers />} active={currentPage === 'referrals'} onClick={() => handleClick('referrals')}>
                          Your Elite Recruits
                        </NavItem>
                        <NavItem icon={<FiKey />} active={currentPage === 'changepassword'} onClick={() => handleClick('changepassword')}>
                          Change password
                        </NavItem>
                      </Box>
                    </VStack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Drawer.Root>
    
            <Heading size="md" color="white">
              Dashboard
            </Heading>
    
            <Menu.Root>
              <Menu.Trigger asChild as={Link} variant="ghost" p={0}>
                <Avatar.Root>
                    <Avatar.Fallback size="sm" name={name} />
                </Avatar.Root>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="profile" onClick={() => router.push('profile')}><FaUserAlt /> Profile</Menu.Item>
                        <Menu.Item
                          value="logout"
                          onClick={() => Logout() }
                        >
                          <FaSignOutAlt /> Logout
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
            
  )

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

  function handleClick(key) {
    setActiveNavItem(key)
    setDrawerOpen(false)
    router.push(key)
  }
}
