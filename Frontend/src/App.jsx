import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
        <LandingPage/>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
