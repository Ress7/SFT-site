import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import PaywallGate from "@/components/paywall/PaywallGate";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Trade from "./Trade";
import Portfolio from "./Portfolio";
import Social from "./Social";
import Settings from "./Settings";
import Orion from "./Orion";
import Account from "./Account";
import MeetOrion from "./MeetOrion";
import Application from "./Application";
import CreateAccount from "./CreateAccount";
import Subscription from "./Subscription";
import TraderProfile from "./TraderProfile";
import AccessCode from "./AccessCode";
import Payment from "./Payment";

export default function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Layout currentPageName="Dashboard"><PaywallGate><Dashboard /></PaywallGate></Layout>} />
      <Route path="/access" element={<AccessCode />} />
      <Route path="/trade" element={<Layout currentPageName="Trade"><PaywallGate><Trade /></PaywallGate></Layout>} />
      <Route path="/portfolio" element={<Layout currentPageName="Portfolio"><PaywallGate><Portfolio /></PaywallGate></Layout>} />
      <Route path="/social" element={<Layout currentPageName="Social"><PaywallGate><Social /></PaywallGate></Layout>} />
      <Route path="/settings" element={<Layout currentPageName="Settings"><PaywallGate><Settings /></PaywallGate></Layout>} />
      <Route path="/orion" element={<Layout currentPageName="Orion"><PaywallGate><Orion /></PaywallGate></Layout>} />
      <Route path="/account" element={<Layout currentPageName="Account"><Account /></Layout>} />
  <Route path="/subscription" element={<Layout currentPageName="Subscription"><Subscription /></Layout>} />
  <Route path="/meetorion" element={<MeetOrion />} />
  <Route path="/application" element={<Application />} />
  <Route path="/createaccount" element={<CreateAccount />} />
  <Route path="/traderprofile" element={<Layout currentPageName="TraderProfile"><TraderProfile /></Layout>} />
  <Route path="/trader/:stoneforgeId" element={<Layout currentPageName="TraderProfile"><TraderProfile /></Layout>} />
  <Route path="/payment" element={<Layout currentPageName="Payment"><Payment /></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
