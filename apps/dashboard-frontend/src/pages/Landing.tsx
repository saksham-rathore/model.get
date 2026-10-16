import React from "react";
import {
  Navbar,
  Hero,
  ProvidersMarquee,
  Steps,
  Catalog,
  Pricing,
  Faq,
  Cta,
  Footer,
} from "../components";

export interface LandingProps {
  isLoggedIn?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onSignUp?: () => void;
  onDashboard?: () => void;
  className?: string;
}

export function Landing({
  isLoggedIn = false,
  onSignIn,
  onSignOut,
  onSignUp,
  onDashboard,
  className = "",
}: LandingProps): React.JSX.Element {
  return (
    <div className={`w-full min-h-screen bg-black font-sans text-zinc-100 antialiased ${className}`}>
      <Navbar
        isLoggedIn={isLoggedIn}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        onGetApiKey={onSignUp}
        onDashboard={onDashboard}
      />
      <main>
        <Hero
          isLoggedIn={isLoggedIn}
          onGetApiKey={onSignUp}
          onDashboard={onDashboard}
        />
        <ProvidersMarquee />
        <Steps />
        <Catalog />
        <Pricing
          isLoggedIn={isLoggedIn}
          onSelectFree={isLoggedIn ? onDashboard : onSignUp}
          onSelectPayg={isLoggedIn ? onDashboard : onSignUp}
          onSelectEnterprise={onSignUp}
        />
        <Faq />
        <Cta
          isLoggedIn={isLoggedIn}
          onCreateAccount={onSignUp}
          onDashboard={onDashboard}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
