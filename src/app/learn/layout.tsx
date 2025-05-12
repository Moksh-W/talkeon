import { type Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Nunito_Sans } from 'next/font/google';
import '../globals.css';
import Image from 'next/image';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Talkeon',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${nunitoSans.className} antialiased`}>
          {/* Header with Clerk Buttons */}
          <header className="flex justify-between items-center p-4 h-16 text-white bg-[#2a323f] overflow-visible">
            <a href="/">
              <img src="/talkeon.png" className="w-35 h-auto" alt="Talkeon Logo" />
            </a>
            {/* Logo on the left */}
            <div className="flex items-center bg-transparent">
              {/* <Image
                alt="logo"
                src="/logo.png"
                width={500}   // Explicitly set width
                height={100}  // Explicitly set height
                className="object-contain"
              />  */}
            </div>

            {/* Buttons on the right */}
            <div className="flex items-center gap-5">
              <a href="/learn/shop" className="font-refrigerator text-[#fbdb2b]">
                SHOP
              </a>
              <p className="font-refrigerator">/</p>
              <a href="/learn/lingopass" className="font-refrigerator text-[#fbdb2b]">
                LINGOPASS
              </a>
              <p className="font-refrigerator">/</p>
              <a href="/learn/courses" className="font-refrigerator text-[#fbdb2b]">
                COURSES
              </a>
              <p className="font-refrigerator">/</p>
              <a href="/learn/plan" className="font-refrigerator text-[#fbdb2b]">
                COURSE PLAN
              </a>
              <p className="font-refrigerator">/</p>
              
              <SignedOut>
                {/* Customize SignIn and SignUp Buttons */}
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                {/* Customize UserButton */}
                <UserButton />
              </SignedIn>
            </div>
          </header>

          {/* Main Content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}