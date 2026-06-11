"use client";

import React, { useState } from "react";
import { User, Mail, AlertCircle, CheckCircle, ChevronRight } from "lucide-react";

interface SignupFormProps {
  sourceId: string;
}

export default function SignupForm({ sourceId }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (emailStr: string) => {
    return emailStr.includes("@") && emailStr.split("@")[1]?.includes(".");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("An email registration is required.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Kindly enter a valid electronic mail address.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Network disruption. Connection failed.");
    }
  };

  if (status === "success") {
    return (
      <div 
        className="w-full bg-[#12100e] border border-gold/30 p-8 rounded-xl text-center shadow-2xl relative overflow-hidden"
        id={`${sourceId}-success-panel`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light"></div>
        <div className="flex justify-center mb-4 text-[#dfba73]">
          <CheckCircle className="w-12 h-12 stroke-[1.25]" />
        </div>
        <h3 className="text-2xl font-serif text-white font-medium mb-3 tracking-wide">You Are Enlisted.</h3>
        <p className="text-zinc-400 font-serif italic text-sm max-w-sm mx-auto leading-relaxed">
          Welcome to the new chapter of African electronic composition. Your correspondence has been securely logged on our scrolls.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" id={`${sourceId}-form-container`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
              <User className="w-4 h-4 stroke-[1.5]" />
            </span>
            <input
              type="text"
              placeholder="YOUR NOM DE PLUME (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === "loading"}
              className="w-full bg-[#12100e]/80 border border-zinc-800/80 focus:border-gold text-white pl-10 pr-4 py-3.5 rounded-lg text-xs outline-none transition-all duration-300 placeholder-zinc-600 font-sans tracking-widest uppercase focus:ring-1 focus:ring-gold/20"
              id={`${sourceId}-name`}
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
              <Mail className="w-4 h-4 stroke-[1.5]" />
            </span>
            <input
              type="email"
              placeholder="SECURE CORRESPONDENCE EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="w-full bg-[#12100e]/80 border border-zinc-800/80 focus:border-gold text-white pl-10 pr-4 py-3.5 rounded-lg text-xs outline-none transition-all duration-300 placeholder-zinc-600 font-sans tracking-widest uppercase focus:ring-1 focus:ring-gold/20"
              id={`${sourceId}-email`}
              required
            />
          </div>
        </div>

        {status === "error" && (
          <div 
            className="flex items-center text-amber-500 text-xs gap-1.5 font-sans tracking-wider"
            id={`${sourceId}-error`}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage.toUpperCase()}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full relative group overflow-hidden bg-gradient-to-r from-gold-dark to-gold text-black hover:text-white font-sans font-extrabold tracking-[0.2em] text-xs py-4 px-6 rounded-lg transition-all duration-500 shadow-xl border border-gold/10 hover:shadow-gold/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          id={`${sourceId}-submit`}
        >
          {status === "loading" ? (
            <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <div className="flex items-center gap-2">
              AUTHENTICATE SUBSCRIPTION
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
