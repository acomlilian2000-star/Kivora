"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, School } from "lucide-react";

type SchoolOption = {
  schoolId: string;
  schoolName: string;
  district: string;
  role: string;
};

export default function SchoolSelector({ memberships }: { memberships: SchoolOption[] }) {
  const router = useRouter();
  const [pendingSchool, setPendingSchool] = useState("");
  const [error, setError] = useState("");

  async function chooseSchool(schoolId: string) {
    setPendingSchool(schoolId);
    setError("");
    try {
      const response = await fetch("/api/schools/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not select that school.");
      router.push("/school/dashboard");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not select that school.");
    } finally {
      setPendingSchool("");
    }
  }

  return (
    <div className="school-selector-list">
      {memberships.map((membership) => (
        <button
          className="school-selector-option"
          key={membership.schoolId}
          disabled={Boolean(pendingSchool)}
          onClick={() => void chooseSchool(membership.schoolId)}
        >
          <span className="school-selector-icon"><School size={18} /></span>
          <span><strong>{membership.schoolName}</strong><small>{membership.district} · {membership.role.replace(/_/g, " ")}</small></span>
          {pendingSchool === membership.schoolId ? <span className="school-selector-pending">Opening…</span> : <ArrowRight size={16} />}
        </button>
      ))}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
