// app/actions/logout.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logout() {
  cookies().set({
    name: 'elitetoken', // Replace with your actual cookie name
    value: '',
    expires: new Date(0),
    path: '/',
  })

  redirect('/login') // Redirect after logout
}
