import AllTransactionComponent from './alltransactioncomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Admin Dashboard | Transaction History - Elite Global Network",
  description: "Secure admin interface for monitoring all user transactions including airtime recharge, data purchases, and bill payments across Nigerian networks.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/alltransactions',
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
    nocache: true, // Prevent caching of sensitive data
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-image-preview': 'none',
    },
  },
  // Minimal openGraph for security (no sensitive data)
  openGraph: {
    title: "Admin Portal - Elite Global Network",
    description: "Secure management portal for Elite Global Network services",
    url: "https://eliteglobalnetwork.com.ng/alltransactions",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Elite Global Network Admin Portal",
      },
    ],
  },
  // No twitter metadata for admin pages (security best practice)
};

export default async function AllTransactionHistory() {
  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }

  return (
    <AllTransactionComponent user={token} />
  )
}