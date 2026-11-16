"use client";

import { ArrowRight, MessageSquareText, Send, Smartphone } from "lucide-react";
import { useState } from "react";

export default function MobileAccess() {
  const [phone, setPhone] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [enteredText, setEnteredText] = useState("");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(inputText?: string) {
    setBusy(true);
    setError("");
    const activeSessionId = sessionId || crypto.randomUUID();
    const nextText = inputText === undefined
      ? enteredText
      : enteredText ? `${enteredText}*${inputText}` : inputText;
    try {
      const body = new URLSearchParams({ sessionId: activeSessionId, phoneNumber: phone, text: nextText });
      const result = await fetch("/api/ussd", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
      const message = await result.text();
      if (!result.ok) throw new Error(message || "The USSD simulator could not connect.");
      setSessionId(activeSessionId);
      setEnteredText(nextText);
      setResponse(message);
      setInput("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The USSD simulator could not connect.");
    } finally {
      setBusy(false);
    }
  }

  const isConnected = response.startsWith("CON");
  const menuIsVisible = response.includes("1. Submit a community problem");
  return <div className="inner-view">
    <div className="page-intro"><div><p className="section-kicker">BASIC-PHONE ACCESS</p><h1>USSD & SMS</h1><p>No smartphone or mobile data is needed to use USSD. A mobile network signal and a registered KIVORA shortcode are required.</p></div><div className="intro-art"><Smartphone size={28} /></div></div>
    <div className="mobile-access-grid">
      <section className="ussd-simulator panel">
        <div className="simulator-heading"><span className="simulator-icon"><Smartphone size={18} /></span><div><h2>Developer USSD test</h2><p>This browser simulator tests the callback. It is not a live shortcode.</p></div><span className="sandbox-pill">TEST</span></div>
        <label className="form-label simulator-phone">Ugandan test phone<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+256 7XX XXX XXX" aria-label="Simulator phone number" /></label>
        <div className="phone-frame"><div className="phone-screen">
          <div className="phone-status"><span>12:06</span><span>● ● ● ▰</span></div>
          <div className="phone-carrier">KIVORA · USSD</div>
          {response ? <p className="ussd-response">{response.replace(/^(CON|END)\s?/, "")}</p> : <div className="phone-placeholder"><span>USSD test</span><small>Start a simulated session</small></div>}
          {menuIsVisible && <div className="ussd-quick-options">{["1", "2", "3", "4"].map((choice) => <button key={choice} disabled={busy} onClick={() => void send(choice)}>{choice}</button>)}</div>}
          {isConnected && !menuIsVisible && <form className="ussd-input" onSubmit={(event) => { event.preventDefault(); if (input.trim()) void send(input.trim()); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your response" autoComplete="off" /><button disabled={busy || !input.trim()}>{busy ? "…" : "Send"}</button></form>}
          {!response && <button className="dial-button" disabled={busy || !phone.trim()} onClick={() => void send()}>{busy ? "Connecting…" : "Test USSD flow"}</button>}
          {response.startsWith("END") && <button className="dial-button" onClick={() => { setSessionId(""); setEnteredText(""); setResponse(""); setInput(""); }}>Start a new session</button>}
        </div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="simulator-caption">Callback endpoint: <code>POST /api/ussd</code>. The live shortcode must be assigned and activated by Africa’s Talking and the supported mobile networks.</p>
      </section>
      <aside className="mobile-info">
        <div className="mobile-info-card"><span className="mobile-info-icon"><MessageSquareText size={18} /></span><h3>How a village phone connects</h3><p>After the shortcode is active, dial it from any supported basic phone. The mobile network carries the USSD session to KIVORA; no app or internet bundle is needed. A cellular signal is still required.</p></div>
        <div className="mobile-info-card sms-info"><span className="mobile-info-icon"><Send size={17} /></span><h3>What must be set up first</h3><p>Register a Uganda USSD service with Africa’s Talking, provide this app’s public HTTPS callback URL, and confirm the shortcode works on target networks. SMS also needs server-side AT credentials.</p><span className="env-hint">/api/ussd · AT_USERNAME · AT_API_KEY</span></div>
        <div className="ussd-flow"><span>PHONE</span><ArrowRight size={14} /><span>KIVORA WEBHOOK</span><ArrowRight size={14} /><span>CHALLENGE REVIEW</span></div>
      </aside>
    </div>
  </div>;
}
