import ProfilePageComponent from './pagecomponent';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: "My Profile | Account Settings & Security - Elite Global Network",
  description: "Manage your personal information, security settings, and preferences. Update your contact details and password securely.",
  metadataBase: new URL('https://eliteglobalnetwork.com.ng'),
  alternates: {
    canonical: 'https://eliteglobalnetwork.com.ng/profile',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  openGraph: {
    title: "My Profile | Elite Global Network",
    description: "Secure profile management dashboard",
    url: "https://eliteglobalnetwork.com.ng/profile",
    images: [{
      url: "https://eliteglobalnetwork.com.ng/elite_png.png",
      width: 1200,
      height: 630,
      alt: "Profile management dashboard",
    }],
  },
  robots: {
    index: false, // Critical for privacy
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: true,
      noimageindex: true,
    },
  },
};

// Minimal schema for account pages
export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Profile Management",
  "url": "https://eliteglobalnetwork.com.ng/profile",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Elite Global Network"
  }
};

export default async function Profile() {

  const cookieStore = await cookies();
  const token = cookieStore.get('elitetoken')?.value;

  if (!token) {
    redirect('/login');
  }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <ProfilePageComponent user={token} />
    </>
   
    )
}