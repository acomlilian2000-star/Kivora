"use client";

import { ArrowRight, MessageSquareText, Send, Smartphone } from "lucide-react";
import { useState } from "react";

export default function MobileAccess() {
  const [phone, setPhone] = useState("+255700000000");
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
      const body = new URLSearchParams({ sessionId: activeSessionId, phoneNumber: phone, serviceCode: "*384*123#", text: nextText });
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
    <div className="page-intro"><div><p className="section-kicker">KIVORA GOES WHERE YOU ARE</p><h1>Mobile access</h1><p>Try the USSD journey for a basic phone, or connect a sandbox number for real SMS updates.</p></div><div className="intro-art"><Smartphone size={28} /></div></div>
    <div className="mobile-access-grid">
      <section className="ussd-simulator panel">
        <div className="simulator-heading"><span className="simulator-icon"><Smartphone size={18} /></span><div><h2>USSD simulator</h2><p>Try the same flow that runs through the Africa’s Talking callback.</p></div><span className="sandbox-pill">SANDBOX</span></div>
        <label className="form-label simulator-phone">Phone number<input value={phone} onChange={(event) => setPhone(event.target.value)} aria-label="Simulator phone number" /></label>
        <div className="phone-frame"><div className="phone-screen">
          <div className="phone-status"><span>12:06</span><span>● ● ● ▰</span></div>
          <div className="phone-carrier">KIVORA · USSD</div>
          {response ? <p className="ussd-response">{response.replace(/^(CON|END)\s?/, "")}</p> : <div className="phone-placeholder"><span>*384*123#</span><small>Dial to begin</small></div>}
          {menuIsVisible && <div className="ussd-quick-options">{["1", "2", "3", "4"].map((choice) => <button key={choice} disabled={busy} onClick={() => void send(choice)}>{choice}</button>)}</div>}
          {isConnected && !menuIsVisible && <form className="ussd-input" onSubmit={(event) => { event.preventDefault(); if (input.trim()) void send(input.trim()); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type your response" autoComplete="off" /><button disabled={busy || !input.trim()}>{busy ? "…" : "Send"}</button></form>}
          {!response && <button className="dial-button" disabled={busy} onClick={() => void send()}>{busy ? "Connecting…" : "Dial KIVORA"}</button>}
          {response.startsWith("END") && <button className="dial-button" onClick={() => { setSessionId(""); setEnteredText(""); setResponse(""); setInput(""); }}>Start a new session</button>}
        </div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="simulator-caption">Demo shortcode: <strong>*384*123#</strong> · API endpoint: <code>/api/ussd</code></p>
      </section>
      <aside className="mobile-info">
        <div className="mobile-info-card"><span className="mobile-info-icon"><MessageSquareText size={18} /></span><h3>For every kind of phone</h3><p>People can share local challenges without installing an app or needing mobile data.</p></div>
        <div className="mobile-info-card sms-info"><span className="mobile-info-icon"><Send size={17} /></span><h3>SMS keeps people in the loop</h3><p>Set Africa’s Talking sandbox credentials to send submission confirmations and teacher alerts.</p><span className="env-hint">AT_USERNAME · AT_API_KEY</span></div>
        <div className="ussd-flow"><span>PHONE</span><ArrowRight size={14} /><span>KIVORA WEBHOOK</span><ArrowRight size={14} /><span>CHALLENGE REVIEW</span></div>
      </aside>
    </div>
  </div>;
}
