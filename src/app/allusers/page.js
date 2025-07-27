import UsersComponent from './alluserscomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Admin Portal | User Management - Elite Global Network",
  description: "Secure administrator interface for user account management",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/allusers',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png' },
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: {
    index: false, // Critical for admin pages
    follow: false,
    nocache: true, // Prevent caching of sensitive user data
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-image-preview': 'none', // Disable image previews
    },
  },
  // Minimal openGraph for security
  openGraph: {
    title: "Admin Portal - Elite Global Network",
    description: "Secure management interface",
    url: "https://eliteglobalnetwork.com.ng/",
    images: [{
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      width: 1200,
      height: 630,
      alt: "Elite Global Network Admin Portal",
    }],
  },
  // Explicitly remove Twitter cards for security
  twitter: null
};

export default async function AllUsers() {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }

  // Recommended: Add admin role verification
  // const isAdmin = await verifyAdminRole(token);
  // if (!isAdmin) redirect('/403');

  return <UsersComponent user={token} />;
}