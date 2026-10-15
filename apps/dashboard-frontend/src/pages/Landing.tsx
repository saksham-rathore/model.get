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
  onSignIn?: () => void;
  onSignUp?: () => void;
  onDashboard?: () => void;
  className?: string;
}

export function Landing({ onSignIn, onSignUp, onDashboard, className = "" }: LandingProps): React.JSX.Element {
  return (
    <div className={`w-full min-h-screen bg-black font-sans text-zinc-100 antialiased ${className}`}>
      <Navbar onSignIn={onSignIn} onGetApiKey={onSignUp} onDashboard={onDashboard} />
      <main>
        <Hero onGetApiKey={onSignUp} />
        <ProvidersMarquee />
        <Steps />
        <Catalog />
        <Pricing onSelectFree={onSignUp} onSelectPayg={onSignUp} onSelectEnterprise={onSignUp} />
        <Faq />
        <Cta onCreateAccount={onSignUp} />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
