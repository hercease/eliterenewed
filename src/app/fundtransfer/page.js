import FundTransferComponent from './fundtransfercomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "Elite Global Network | Send Funds Between Members Instantly",
  description: "Transfer funds securely between Elite Global Network members. Fast internal wallet payments with zero wait time.",
  metadataBase: new URL("https://eliteglobalnetwork.com.ng"),
  alternates: {
    canonical: "/fundtransfer",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png" },
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Elite Members | Secure Fund Transfer",
    description: "Fast and seamless wallet-to-wallet fund transfers within the Elite Global Network platform. Send payments between members without delay.",
    url: "https://eliteglobalnetwork.com.ng/fundtransfer",
    siteName: "Elite Global Network",
    images: [
      {
        url: "https://eliteglobalnetwork.com.ng/elite_png.png",
        width: 1200,
        height: 630,
        alt: "Transfer funds between Elite members",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Network | Member Fund Transfers",
    description: "Send payments directly to Elite members with secure wallet-to-wallet transfer.",
    images: {
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      alt: "Elite Member Transfer Page",
    },
    creator: "@EliteNetwork", // Update if you have an official Twitter handle
  },
};



export default async function FundTransferPage() {

const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }
    return (
        
        <FundTransferComponent user={token} />
        
    )
    
}