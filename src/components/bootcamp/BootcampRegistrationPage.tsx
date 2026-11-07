import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  School, 
  Building, 
  User, 
  Phone, 
  Mail, 
  AlertCircle, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  GraduationCap, 
  ChevronDown,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Copy,
  PlusCircle,
  Table as TableIcon
} from "lucide-react";
import jsPDF from "jspdf";
import { 
  DEFAULT_SPREADSHEET_ID, 
  DEFAULT_SPREADSHEET_NAME,
  DEFAULT_SPREADSHEET_URL, 
  appendRowToSheet, 
  googleSheetsSignIn, 
  googleSheetsSignOut,
  initGoogleSheetsAuth, 
  getGoogleAccessToken,
  syncAllRegistrationsToSheet 
} from "../../services/googleSheetsService";

interface BootcampRegistrationPageProps {
  onBackToHome: () => void;
}

const CONFIGURABLE_INSTITUTES = [
  "Delhi Public School (DPS)",
  "Kendriya Vidyalaya (KV)",
  "Army Public School",
  "The Mother's International School",
  "Modern School, Barakhamba Road",
  "St. Xavier's High School",
  "Ryan International School",
  "Springdales School",
  "Apeejay School",
  "Other / Not Listed"
];

export const BootcampRegistrationPage: React.FC<BootcampRegistrationPageProps> = ({ onBackToHome }) => {
  // Navigation View: "form" or "table"
  const [activeView, setActiveView] = useState<"form" | "table">("form");

  // Form state
  const [parentName, setParentName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [parentContact, setParentContact] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentContact, setStudentContact] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [standard, setStandard] = useState("Standard 8");
  const [institute, setInstitute] = useState(CONFIGURABLE_INSTITUTES[0]);
  const [customInstitute, setCustomInstitute] = useState("");
  const [consentAccurate, setConsentAccurate] = useState(false);
  const [consentCommunication, setConsentCommunication] = useState(true);

  // Discreet background Google Sheet settings
  const [showAdminSheetModal, setShowAdminSheetModal] = useState(false);
  const [targetSpreadsheetId, setTargetSpreadsheetId] = useState<string>(() => {
    return localStorage.getItem("aifluence_target_sheet_id") || DEFAULT_SPREADSHEET_ID;
  });
  const [targetWebhookUrl, setTargetWebhookUrl] = useState<string>(() => {
    return localStorage.getItem("aifluence_target_sheet_webhook") || "";
  });
  const [sheetSaveStatus, setSheetSaveStatus] = useState<string>("");
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Registrations state for Prominent Table
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStandard, setFilterStandard] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<{
    registrationId: string;
    registrationDate: string;
    registrationTime: string;
    status: string;
    bootcampName: string;
    sheetAppended?: boolean;
  } | null>(null);

  // Load registrations from backend
  const loadRegistrations = () => {
    fetch("/api/bootcamp/registrations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.records)) {
          setRegistrations(data.records);
        }
      })
      .catch((err) => console.warn("Failed to load registrations:", err));
  };

  useEffect(() => {
    loadRegistrations();

    const unsubscribe = initGoogleSheetsAuth(
      (user, token) => {
        setIsGoogleConnected(true);
        setGoogleUserEmail(user.email || "axspecty@gmail.com");
      },
      () => {
        if (getGoogleAccessToken()) {
          setIsGoogleConnected(true);
        } else {
          setIsGoogleConnected(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Form Validation
  const validateForm = () => {
    if (!parentName.trim()) {
      setErrorMsg("Parent/Guardian Full Name is required.");
      return false;
    }
    if (!parentContact.trim() || parentContact.length < 10) {
      setErrorMsg("Please enter a valid 10-digit Parent/Guardian contact number.");
      return false;
    }
    if (!studentName.trim()) {
      setErrorMsg("Student Full Name is required.");
      return false;
    }
    if (!schoolName.trim()) {
      setErrorMsg("School Name is required.");
      return false;
    }
    if (institute === "Other / Not Listed" && !customInstitute.trim()) {
      setErrorMsg("Please enter your institute name.");
      return false;
    }
    if (parentEmail.trim() && !parentEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return false;
    }
    if (!consentAccurate) {
      setErrorMsg("You must confirm that the provided information is accurate before submitting.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) {
      const formEl = document.getElementById("registration-form");
      formEl?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsLoading(true);

    const fullParentContact = `${countryCode} ${parentContact.trim()}`;
    const fullStudentContact = studentContact.trim() ? `${countryCode} ${studentContact.trim()}` : "Not Provided";
    const finalInstitute = institute === "Other / Not Listed" ? customInstitute.trim() : institute;

    const payload = {
      parentName: parentName.trim(),
      parentContact: fullParentContact,
      parentEmail: parentEmail.trim(),
      studentName: studentName.trim(),
      studentContact: fullStudentContact,
      schoolName: schoolName.trim(),
      standard,
      institute: finalInstitute,
      source: "AI Fluence Website",
      registrationStatus: "Registered",
      paymentStatus: "Verified / Free",
      sheetsWebhookUrl: targetWebhookUrl.trim() || undefined,
    };

    try {
      const response = await fetch("/api/bootcamp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to record registration. Please try again.");
      }

      let sheetAppended = false;
      const token = getGoogleAccessToken();
      const activeSheetId = targetSpreadsheetId || DEFAULT_SPREADSHEET_ID;
      if (token && activeSheetId) {
        try {
          await appendRowToSheet(token, activeSheetId, [
            result.registrationId,
            result.registrationDate,
            result.registrationTime,
            payload.parentName,
            payload.parentContact,
            payload.parentEmail,
            payload.studentName,
            payload.studentContact,
            payload.schoolName,
            payload.standard,
            payload.institute,
            payload.registrationStatus,
            payload.source,
            payload.paymentStatus
          ]);
          sheetAppended = true;
          console.log("Successfully appended row to Google Sheet:", activeSheetId);
        } catch (err) {
          console.warn("Direct Google Sheet append note:", err);
        }
      }

      setSuccessData({
        registrationId: result.registrationId,
        registrationDate: result.registrationDate,
        registrationTime: result.registrationTime,
        status: result.status || "Registered",
        bootcampName: "7-Day AI Pioneers Bootcamp",
        sheetAppended,
      });

      // Reload updated registrations table
      loadRegistrations();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Bootcamp registration error:", err);
      setErrorMsg(err.message || "Network error occurred. Please verify your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Sign-in for Sheet owner
  const handleGoogleConnect = async () => {
    try {
      setIsSyncing(true);
      const res = await googleSheetsSignIn();
      if (res) {
        setIsGoogleConnected(true);
        setGoogleUserEmail(res.user.email || "axspecty@gmail.com");
        setSheetSaveStatus("Google account connected! Live sheet synchronization is active.");
      }
    } catch (err: any) {
      setSheetSaveStatus(err.message || "Failed to connect Google account.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync all server-stored registrations into the Google Sheet
  const handleSyncAllToSheet = async () => {
    try {
      setIsSyncing(true);
      setSheetSaveStatus("Reading registrations from database...");
      const res = await fetch("/api/bootcamp/registrations");
      const data = await res.json();
      if (!data.success || !data.records || data.records.length === 0) {
        setSheetSaveStatus("No pending registrations to sync.");
        return;
      }

      let token = getGoogleAccessToken();
      if (!token) {
        setSheetSaveStatus("Authorizing with Google Sheets...");
        const signResult = await googleSheetsSignIn();
        if (signResult) {
          token = signResult.accessToken;
          setIsGoogleConnected(true);
          setGoogleUserEmail(signResult.user.email);
        }
      }

      if (!token) {
        setSheetSaveStatus("Authorization cancelled.");
        return;
      }

      setSheetSaveStatus(`Writing ${data.records.length} registrations to Google Sheet...`);
      const syncResult = await syncAllRegistrationsToSheet(
        token, 
        targetSpreadsheetId || DEFAULT_SPREADSHEET_ID, 
        data.records
      );

      setSheetSaveStatus(`Success! Synced ${syncResult.added} registrations into "${DEFAULT_SPREADSHEET_NAME}".`);
      setTimeout(() => setSheetSaveStatus(""), 5000);
    } catch (err: any) {
      setSheetSaveStatus(`Sync failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = [
      "Registration ID",
      "Registration Date",
      "Registration Time",
      "Parent Name",
      "Parent Contact",
      "Parent Email",
      "Student Name",
      "Student Contact",
      "School Name",
      "Standard",
      "Institute",
      "Status",
      "Source"
    ];

    const rows = registrations.map((r) => [
      `"${r.registrationId || ""}"`,
      `"${r.registrationDate || ""}"`,
      `"${r.registrationTime || ""}"`,
      `"${r.parentName || ""}"`,
      `"${r.parentContact || ""}"`,
      `"${r.parentEmail || ""}"`,
      `"${r.studentName || ""}"`,
      `"${r.studentContact || ""}"`,
      `"${r.schoolName || ""}"`,
      `"${r.standard || ""}"`,
      `"${r.institute || ""}"`,
      `"${r.registrationStatus || "Registered"}"`,
      `"${r.source || "AI Fluence Website"}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AI-Pioneers-Registrations-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy ID helper
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // PDF Generator for individual registration
  const generateReceiptPDF = (record: any) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 42, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AI FLUENCE • AI PIONEERS", 15, 22);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("OFFICIAL BOOTCAMP REGISTRATION CONFIRMATION", 15, 32);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("7-Day AI Pioneers Bootcamp Receipt", 15, 58);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Registration ID: ${record.registrationId}`, 15, 68);
    doc.text(`Date & Time (IST): ${record.registrationDate} at ${record.registrationTime}`, 15, 75);

    (doc as any).setDrawColor(226, 232, 240);
    (doc as any).setLineWidth(0.5);
    doc.line(15, 82, 195, 82);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Student & Academic Profile", 15, 94);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Student Name: ${record.studentName}`, 15, 104);
    doc.text(`Current Class / Standard: ${record.standard}`, 15, 112);
    doc.text(`School: ${record.schoolName}`, 15, 120);
    doc.text(`Institute: ${record.institute}`, 15, 128);

    doc.line(15, 136, 195, 136);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Parent / Guardian Information", 15, 148);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Parent/Guardian Name: ${record.parentName}`, 15, 156);
    doc.text(`Contact Number: ${record.parentContact}`, 15, 164);
    if (record.parentEmail) {
      doc.text(`Email Address: ${record.parentEmail}`, 15, 172);
    }

    doc.line(15, 180, 195, 180);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Note: This document confirms registration for the 7-Day AI Pioneers Bootcamp.", 15, 190);
    doc.text("Payment Status: Verified / Free Registration.", 15, 197);
    doc.text("Organizer: AI Pioneers by AI Fluence", 15, 204);

    doc.save(`AI-Pioneers-Registration-${record.registrationId}.pdf`);
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setParentName("");
    setParentContact("");
    setParentEmail("");
    setStudentName("");
    setStudentContact("");
    setSchoolName("");
    setStandard("Standard 8");
    setInstitute(CONFIGURABLE_INSTITUTES[0]);
    setCustomInstitute("");
    setConsentAccurate(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveAdminSheetConfig = () => {
    try {
      localStorage.setItem("aifluence_target_sheet_id", targetSpreadsheetId.trim());
      localStorage.setItem("aifluence_target_sheet_webhook", targetWebhookUrl.trim());
      setSheetSaveStatus("Saved! Target Google Sheet configuration updated.");
      setTimeout(() => setSheetSaveStatus(""), 4000);
    } catch (e) {
      setSheetSaveStatus("Could not save settings.");
    }
  };

  // Filtered registrations for the prominent table
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = 
      (reg.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.parentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.schoolName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.registrationId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.institute || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStandard = filterStandard === "All" || reg.standard === filterStandard;
    return matchesSearch && matchesStandard;
  });

  return (
    <div className="w-full min-h-screen bg-[#030712] text-white font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic iPhone Ambient Backlight Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/25 via-cyan-500/15 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-10 w-[500px] h-[350px] bg-gradient-to-t from-indigo-600/20 to-transparent blur-[140px] pointer-events-none z-0" />

      {/* 1. iPhone-esque Floating Pill Header */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50 bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-full py-3 px-5 sm:px-6 shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-between transition-all">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-slate-300 hover:text-white font-black text-xs sm:text-sm tracking-tight transition-all cursor-pointer active:scale-95 group"
        >
          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs group-hover:bg-white/20 transition">←</span>
          <span>Home</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="font-mono text-[11px] font-black tracking-widest uppercase bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              7-Day Diwali Bootcamp
            </span>
          </div>

          {/* Quick Sheet Status Indicator */}
          <button
            onClick={() => setShowAdminSheetModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 hover:border-emerald-400/40 text-[10px] font-mono font-medium text-slate-300 hover:text-emerald-300 transition"
            title="Connected Sheet: 7days diwali Bootcamp Registation data"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Sheet Active</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Hero Title & Subtitle */}
        <section className="w-full text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl text-cyan-300 text-xs font-black tracking-wide uppercase mb-3 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: "8s" }} />
            <span>AI Pioneers • Diwali Special</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-3">
            7-Day AI Pioneers Bootcamp
          </h1>

          <p className="text-sm sm:text-base text-slate-300/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Give your child a head start in Artificial Intelligence. Secure their registration and track submissions in real time.
          </p>
        </section>

        {/* PROMINENT VIEW SELECTOR (iOS Segmented Switcher) */}
        <div className="mb-8 w-full max-w-md p-1.5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 grid grid-cols-2 gap-1.5 shadow-xl">
          <button
            type="button"
            onClick={() => setActiveView("form")}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeView === "form"
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.5)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Registration Form</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("table")}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeView === "table"
                ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.5)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Registrations Table</span>
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-mono">
              {registrations.length}
            </span>
          </button>
        </div>

        {activeView === "form" ? (
          <>
            {/* Quick Glance Widgets */}
            <section className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-black uppercase text-blue-300 tracking-wider">Duration</div>
                  <div className="text-sm font-black text-white mt-0.5">7 Days Intensive</div>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-2">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-black uppercase text-cyan-300 tracking-wider">Audience</div>
                  <div className="text-sm font-black text-white mt-0.5">Standards 7–10</div>
                </div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-2">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-black uppercase text-indigo-300 tracking-wider">Format</div>
                  <div className="text-sm font-black text-white mt-0.5">Practical & Beginner</div>
                </div>
              </div>
            </section>

            {/* Registration Form / Success */}
            <section className="w-full max-w-4xl">
              {successData ? (
                /* Success Screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-slate-900/60 backdrop-blur-2xl border border-emerald-500/40 rounded-[32px] p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] text-center relative overflow-hidden"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    ✓
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                    Registration Successful!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-lg mx-auto mb-6">
                    Registration recorded into <strong>{DEFAULT_SPREADSHEET_NAME}</strong> and ready for instant verification.
                  </p>

                  <div className="bg-black/50 border border-white/10 rounded-2xl p-6 text-left mb-6 shadow-inner font-mono">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Official Registration ID</span>
                        <span className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight">{successData.registrationId}</span>
                      </div>
                      <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                        {successData.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-sans">
                      <div><strong className="text-slate-400">Student:</strong> <span className="text-white font-bold">{studentName}</span></div>
                      <div><strong className="text-slate-400">Class:</strong> <span className="text-white font-bold">{standard}</span></div>
                      <div><strong className="text-slate-400">School:</strong> <span className="text-white font-medium">{schoolName}</span></div>
                      <div><strong className="text-slate-400">Institute:</strong> <span className="text-white font-medium">{institute === "Other / Not Listed" ? customInstitute : institute}</span></div>
                      <div><strong className="text-slate-400">Parent:</strong> <span className="text-white font-medium">{parentName}</span></div>
                      <div><strong className="text-slate-400">Date & Time:</strong> <span className="text-white font-mono">{successData.registrationDate} ({successData.registrationTime} IST)</span></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => generateReceiptPDF({
                        registrationId: successData.registrationId,
                        registrationDate: successData.registrationDate,
                        registrationTime: successData.registrationTime,
                        studentName,
                        standard,
                        schoolName,
                        institute: institute === "Other / Not Listed" ? customInstitute : institute,
                        parentName,
                        parentContact,
                        parentEmail
                      })}
                      className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF Receipt
                    </button>

                    <button
                      onClick={() => setActiveView("table")}
                      className="py-3.5 px-6 rounded-2xl bg-emerald-600/30 hover:bg-emerald-600/45 text-emerald-300 border border-emerald-400/40 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <TableIcon className="w-4 h-4" />
                      View in Registrations Table
                    </button>

                    <button
                      onClick={handleResetForm}
                      className="py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-black text-xs uppercase tracking-wider border border-white/10 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Register Another Student
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Registration Form */
                <form
                  id="registration-form"
                  onSubmit={handleSubmit}
                  className="bg-slate-900/50 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] relative overflow-hidden"
                >
                  {errorMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs sm:text-sm font-semibold animate-shake">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* SECTION A — PARENT / GUARDIAN INFORMATION */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 text-xs font-black">
                        A
                      </div>
                      <h3 className="text-base font-black tracking-tight text-white uppercase font-mono">
                        Parent / Guardian Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Parent / Guardian Full Name <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="e.g. Rajesh Kumar"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Parent / Guardian Contact Number <span className="text-rose-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-24 px-3 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono focus:outline-none focus:border-blue-500 transition-all"
                          >
                            <option value="+91" className="bg-slate-900 text-white">🇮🇳 +91</option>
                            <option value="+1" className="bg-slate-900 text-white">🇺🇸 +1</option>
                            <option value="+44" className="bg-slate-900 text-white">🇬🇧 +44</option>
                            <option value="+971" className="bg-slate-900 text-white">🇦🇪 +971</option>
                            <option value="+65" className="bg-slate-900 text-white">🇸🇬 +65</option>
                          </select>

                          <div className="relative flex-1">
                            <Phone className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              required
                              value={parentContact}
                              onChange={(e) => setParentContact(e.target.value.replace(/[^0-9]/g, ""))}
                              maxLength={10}
                              placeholder="10-digit mobile number"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION B — STUDENT INFORMATION */}
                  <div className="mb-8 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-xs font-black">
                        B
                      </div>
                      <h3 className="text-base font-black tracking-tight text-white uppercase font-mono">
                        Student Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Student Full Name <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="e.g. Aarav Kumar"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Student Contact Number <span className="text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            value={studentContact}
                            onChange={(e) => setStudentContact(e.target.value.replace(/[^0-9]/g, ""))}
                            maxLength={10}
                            placeholder="Leave blank if student has no personal number"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          School Name <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative">
                          <School className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                            placeholder="Enter the student's school name"
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          Current Standard / Class <span className="text-rose-400">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2 bg-white/[0.04] p-1.5 rounded-2xl border border-white/[0.08]">
                          {["Standard 7", "Standard 8", "Standard 9", "Standard 10"].map((cls) => {
                            const isSelected = standard === cls;
                            return (
                              <button
                                type="button"
                                key={cls}
                                onClick={() => setStandard(cls)}
                                className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-blue-600 text-white shadow-[0_2px_12px_rgba(37,99,235,0.6)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                              >
                                {cls.replace("Standard ", "Std ")}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION C — INSTITUTE INFORMATION */}
                  <div className="mb-8 border-t border-white/10 pt-6">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 text-xs font-black">
                        C
                      </div>
                      <h3 className="text-base font-black tracking-tight text-white uppercase font-mono">
                        Institute & Contact Information
                      </h3>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Affiliated Institute <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select
                          value={institute}
                          onChange={(e) => setInstitute(e.target.value)}
                          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          {CONFIGURABLE_INSTITUTES.map((inst) => (
                            <option key={inst} value={inst} className="bg-slate-900 text-white">
                              {inst}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {institute === "Other / Not Listed" && (
                      <div className="mb-4 animate-fadeIn">
                        <label className="block text-xs font-bold text-cyan-300 mb-1.5">
                          Enter Institute Name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customInstitute}
                          onChange={(e) => setCustomInstitute(e.target.value)}
                          placeholder="Enter the name of the learning center or institute"
                          className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        Parent Email Address <span className="text-slate-500 font-normal">(Optional — for PDF receipt delivery)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={parentEmail}
                          onChange={(e) => setParentEmail(e.target.value)}
                          placeholder="parent@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="mb-8 space-y-3.5 border-t border-white/10 pt-6">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        required
                        checked={consentAccurate}
                        onChange={(e) => setConsentAccurate(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded-md border-white/20 bg-slate-900 text-blue-500 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300 leading-relaxed font-medium">
                        <strong className="text-white">Required Consent:</strong> I confirm that the information provided above is accurate and that I am the parent/guardian or an authorized representative registering this student. <span className="text-rose-400">*</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consentCommunication}
                        onChange={(e) => setConsentCommunication(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded-md border-white/20 bg-slate-900 text-blue-500 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300 leading-relaxed font-medium">
                        I agree to receive program-related communications, updates, and learning materials regarding the AI Pioneers Bootcamp.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(37,99,235,0.45)] transition-all transform active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setActiveView("table")}
                      className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                    >
                      View All {registrations.length} Registrations in Prominent Table →
                    </button>
                  </div>
                </form>
              )}
            </section>
          </>
        ) : (
          /* =========================================================================
             PROMINENT REGISTRATIONS TABLE (All Individual Form Fields Displayed)
             ========================================================================= */
          <section className="w-full">
            {/* Table Control Bar */}
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] p-6 shadow-2xl mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      AI Pioneers Registrations Table
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                    <span>Target Google Sheet:</span>
                    <strong className="text-emerald-300 font-mono">"{DEFAULT_SPREADSHEET_NAME}"</strong>
                    <span className="text-slate-600">•</span>
                    <span>Account:</span>
                    <strong className="text-slate-300 font-mono">axspecty@gmail.com</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSyncAllToSheet}
                    disabled={isSyncing}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Sync to Google Sheet</span>
                  </button>

                  <a
                    href={DEFAULT_SPREADSHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <span>Open in Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-300" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("form")}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Student</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student, parent, school, ID, or institute..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={filterStandard}
                    onChange={(e) => setFilterStandard(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="All" className="bg-slate-900">All Standards</option>
                    <option value="Standard 7" className="bg-slate-900">Standard 7</option>
                    <option value="Standard 8" className="bg-slate-900">Standard 8</option>
                    <option value="Standard 9" className="bg-slate-900">Standard 9</option>
                    <option value="Standard 10" className="bg-slate-900">Standard 10</option>
                  </select>
                </div>
              </div>

              {sheetSaveStatus && (
                <div className="mt-4 p-3 rounded-xl bg-blue-500/20 border border-blue-400/40 text-cyan-200 text-xs font-bold text-center">
                  {sheetSaveStatus}
                </div>
              )}
            </div>

            {/* The Prominent Table with Horizontal Scroll & Responsive Design */}
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/[0.12] rounded-[32px] overflow-hidden shadow-2xl">
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-white/15 text-slate-300 font-mono text-[11px] uppercase tracking-wider font-bold">
                      <th className="py-4 px-4"># Reg ID</th>
                      <th className="py-4 px-4">Date & Time (IST)</th>
                      <th className="py-4 px-4">Student Name</th>
                      <th className="py-4 px-4">Class</th>
                      <th className="py-4 px-4">School</th>
                      <th className="py-4 px-4">Institute</th>
                      <th className="py-4 px-4">Parent / Guardian</th>
                      <th className="py-4 px-4">Parent Contact</th>
                      <th className="py-4 px-4">Student Contact</th>
                      <th className="py-4 px-4">Parent Email</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-4 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] font-medium text-slate-200">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-16 text-center text-slate-400">
                          <p className="text-sm font-bold text-slate-300 mb-2">No registrations found</p>
                          <p className="text-xs text-slate-500">
                            {searchQuery ? "Try refining your search terms." : "Submit the first registration above to populate this table."}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg, idx) => (
                        <tr 
                          key={reg.registrationId || idx}
                          className="hover:bg-white/[0.04] transition-colors"
                        >
                          {/* 1. Registration ID */}
                          <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                            <div className="flex items-center gap-1.5">
                              <span>{reg.registrationId}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyId(reg.registrationId)}
                                className="text-slate-500 hover:text-white transition cursor-pointer"
                                title="Copy Registration ID"
                              >
                                {copiedId === reg.registrationId ? (
                                  <span className="text-[10px] text-emerald-400 font-sans">Copied!</span>
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 2. Date & Time */}
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                            {reg.registrationDate} {reg.registrationTime ? `• ${reg.registrationTime}` : ""}
                          </td>

                          {/* 3. Student Name */}
                          <td className="py-3.5 px-4 font-bold text-white">
                            {reg.studentName}
                          </td>

                          {/* 4. Standard */}
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-lg bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold">
                              {reg.standard}
                            </span>
                          </td>

                          {/* 5. School */}
                          <td className="py-3.5 px-4 text-slate-300 max-w-[200px] truncate" title={reg.schoolName}>
                            {reg.schoolName}
                          </td>

                          {/* 6. Institute */}
                          <td className="py-3.5 px-4 text-slate-300 max-w-[180px] truncate" title={reg.institute}>
                            {reg.institute}
                          </td>

                          {/* 7. Parent Name */}
                          <td className="py-3.5 px-4 text-white font-semibold">
                            {reg.parentName}
                          </td>

                          {/* 8. Parent Contact */}
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {reg.parentContact}
                          </td>

                          {/* 9. Student Contact */}
                          <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                            {reg.studentContact || "—"}
                          </td>

                          {/* 10. Parent Email */}
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {reg.parentEmail || "—"}
                          </td>

                          {/* 11. Status */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                              {reg.registrationStatus || "Registered"}
                            </span>
                          </td>

                          {/* 12. Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => generateReceiptPDF(reg)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition cursor-pointer"
                              title="Download PDF Receipt"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-slate-950/70 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <span>Showing {filteredRegistrations.length} of {registrations.length} total registrations</span>
                <span className="font-mono text-[11px]">Connected Tab: Sheet1 • Live Sync Ready</span>
              </div>
            </div>
          </section>
        )}

        {/* Discreet Admin Footer Link */}
        <footer className="mt-16 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
          <span>AI Pioneers by AI Fluence • All Rights Reserved</span>
          <span>•</span>
          <button
            onClick={() => setShowAdminSheetModal(true)}
            className="text-slate-400 hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5 font-mono text-[11px]"
            title="Configure target Google Sheet ID / Sync registrations"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Connected Sheet (axspecty)</span>
          </button>
        </footer>
      </main>

      {/* Admin Google Sheet Configuration & Sync Modal */}
      <AnimatePresence>
        {showAdminSheetModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-white/20 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative text-left"
            >
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-black text-white">Google Sheet Storage</h4>
                </div>
                <button
                  onClick={() => setShowAdminSheetModal(false)}
                  className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Status Header */}
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Connected Sheet Name</div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{DEFAULT_SPREADSHEET_NAME}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">Account: axspecty@gmail.com</div>
                </div>
                <a
                  href={`https://docs.google.com/spreadsheets/d/${targetSpreadsheetId || DEFAULT_SPREADSHEET_ID}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1 transition"
                >
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-3.5 mb-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Google Spreadsheet ID
                  </label>
                  <input
                    type="text"
                    value={targetSpreadsheetId}
                    onChange={(e) => setTargetSpreadsheetId(e.target.value)}
                    placeholder={DEFAULT_SPREADSHEET_ID}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Preconfigured to your provided axspecty spreadsheet ID.
                  </span>
                </div>

                {/* Google Sign-in action if not already authorized */}
                {!isGoogleConnected ? (
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/20">
                    <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">
                      Sign in with your <strong>axspecty@gmail.com</strong> Google account to authorize direct live updates to this sheet:
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleConnect}
                      disabled={isSyncing}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                      <span>Sign in with Google (axspecty)</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between">
                    <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Google OAuth Active ({googleUserEmail})
                    </span>
                    <button
                      type="button"
                      onClick={() => googleSheetsSignOut().then(() => setIsGoogleConnected(false))}
                      className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                )}

                {/* Bulk Sync Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSyncAllToSheet}
                    disabled={isSyncing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Sync All Registrations to "{DEFAULT_SPREADSHEET_NAME}"</span>
                  </button>
                  <span className="text-[10px] text-slate-400 text-center block mt-1.5">
                    Total recorded submissions in database: {registrations.length}
                  </span>
                </div>
              </div>

              {sheetSaveStatus && (
                <div className="mb-4 p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/40 text-cyan-200 text-xs font-bold text-center">
                  {sheetSaveStatus}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminSheetModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={saveAdminSheetConfig}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Save ID
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
