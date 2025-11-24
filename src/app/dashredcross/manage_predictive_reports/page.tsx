"use client";

import { useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

//========================================================//
// 1. ICONS                                               //
//========================================================//
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 4.078a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0zM15.625 9a2.375 2.375 0 100-4.75 2.375 2.375 0 000 4.75zM12.5 10.75a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0z" /></svg>;
const AppointmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.25 2a.75.75 0 00-1.5 0v1.361A8.96 8.96 0 002.57 6.38a.75.75 0 001.362.614A7.46 7.46 0 0110 4.5c2.993 0 5.542 1.72 6.822 4.108a.75.75 0 001.362-.614A8.96 8.96 0 0011.25 3.361V2zM2.5 10a.75.75 0 01.75-.75h14a.75.75 0 010 1.5h-14a.75.75 0 01-.75-.75zm0 4.25a.75.75 0 001.362.614 7.46 7.46 0 0112.276 0 .75.75 0 101.362-.614A8.96 8.96 0 0010 12.5a8.96 8.96 0 00-7.43 3.138z" clipRule="evenodd" /></svg>;
const RequestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.5 10a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /><path d="M10 2a.75.75 0 00-7.465 5.222.75.75 0 001.478.204A6.5 6.5 0 0110 3.5a.75.75 0 000-1.5zM3.28 8.243a6.5 6.5 0 0111.41-3.662.75.75 0 101.246-.828A8 8 0 002.09 7.648a.75.75 0 101.19.595z" /></svg>;
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0V2.75z" /><path d="M18.25 3.5a.75.75 0 00-1.5 0v1.636a.25.25 0 01-.25.25H6.5a.75.75 0 000 1.5h10a1.75 1.75 0 001.75-1.75V3.5z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /><path d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 000 2h8a1 1 0 100-2H5zm1 3a1 1 0 100 2h5a1 1 0 100-2H6z" /></svg>;
const HospitalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" /><path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-7a7 7 0 100 14 7 7 0 000-14z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ExportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm5 1a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const LoadingIcon = () => <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;

//========================================================//
// 2. CHILD COMPONENTS                                    //
//========================================================//
function BloodbankSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/dashredcross", icon: <DashboardIcon /> },
    { name: "Manage Inventory", href: "/dashredcross/manage_inventory", icon: <InventoryIcon /> },
    { name: "Manage Accounts", href: "/dashredcross/manage_users_account", icon: <UsersIcon /> },
    { name: "Manage Appointments", href: "/dashredcross/manage_donor_appointment", icon: <AppointmentIcon /> },
    { name: "Predictive Reports", href: "/dashredcross/manage_predictive_reports", icon: <ReportIcon /> },
    { name: "Blood Requests", href: "/dashredcross/manage_blood_request", icon: <RequestIcon /> },
    { name: "Blood Campaigns", href: "/dashredcross/manage_blood_campaign", icon: <CampaignIcon /> },
    { name: "Scan Blood Bags", href: "/dashredcross/manage_scan_blood_bag", icon: <ScanIcon /> },
    { name: "Hospital Inventory", href: "/dashredcross/manage_hospital_inventory", icon: <HospitalIcon /> },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose}></div>}
      <aside className={`w-72 min-h-screen fixed left-0 top-0 bg-white shadow-lg p-6 flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-red-600">DUGO</h2>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon />
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-semibold ${pathname === link.href ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

function BloodbankHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full dark:text-gray-700 hover:bg-gray-100"><MenuIcon /></button>
                <h1 className="text-xl font-bold text-gray-800">Predictive Reports</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>{children}</div>
);

const StatCard = ({ title, value, change, icon }: {title: string, value: string, change?: string, icon: ReactNode}) => (
    <Card>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                {change && <p className={`text-xs mt-1 ${change.startsWith("Need") || change.startsWith("Short") ? "text-red-600" : "text-green-600"}`}>{change}</p>}
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                {icon}
            </div>
        </div>
    </Card>
);

// --- Define Types for our data ---
interface MonthlyTrendData { month: string; demand: number; supply: number; }
interface SupplyForecastData { type: string; needed: number; available: number; shortfall: number; }
interface DemandForecastData { type: string; predicted_demand: number; }
interface PastSupplyPrediction { blood_type: string; predicted_units: number; }
interface PastDemandPrediction { component_type: string; predicted_units: number; }
// NEW: Updated Type for Reason Analytics with index signature for Recharts
interface RequestReasonData { 
  reason: string; 
  count: number; 
  [key: string]: any; // FIX: Allows dynamic keys for Recharts
}

// Colors for Pie Chart
const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

//========================================================//
// 3. MAIN PAGE COMPONENT                                 //
//========================================================//
export default function PredictiveReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [monthlyTrendData, setMonthlyTrendData] = useState<MonthlyTrendData[]>([]);
  const [supplyForecast, setSupplyForecast] = useState<SupplyForecastData[]>([]);
  const [demandForecast, setDemandForecast] = useState<DemandForecastData[]>([]);
  const [totalShortfall, setTotalShortfall] = useState(0);
  const [mostNeeded, setMostNeeded] = useState({ type: 'N/A', shortfall: 0 });
  const [nextMonthName, setNextMonthName] = useState('');
  const [availablePredictionMonths, setAvailablePredictionMonths] = useState<string[]>([]);
  const [selectedPredictionMonth, setSelectedPredictionMonth] = useState<string>('');
  const [pastSupplyPrediction, setPastSupplyPrediction] = useState<PastSupplyPrediction[]>([]);
  const [pastDemandPrediction, setPastDemandPrediction] = useState<PastDemandPrediction[]>([]);
  const [loadingPastPrediction, setLoadingPastPrediction] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // 4. NEW State for Reasons
  const [reasonStats, setReasonStats] = useState<RequestReasonData[]>([]);
  const [recentReasonMonth, setRecentReasonMonth] = useState('');

  useEffect(() => {
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    setNextMonthName(formatter.format(nextMonthDate));

    // Set current month name for reason analytics
    const currentFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    setRecentReasonMonth(currentFormatter.format(now));
  }, []);

  useEffect(() => {
    async function fetchPredictiveData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Trends
        const { data: trendData, error: trendError } = await supabase.rpc('get_historical_trends');
        if (trendError) throw new Error(`Error fetching historical trends: ${trendError.message}`);
        const formattedTrendData = trendData.map((d: any) => ({ month: d.month_text, demand: d.demand, supply: d.supply }));
        setMonthlyTrendData(formattedTrendData);

        // 2. Supply Forecast
        const { data: predictedSupply, error: supplyError } = await supabase.rpc('get_monthly_supply_forecast');
        if (supplyError) throw new Error(`Error fetching predicted supply: ${supplyError.message}`);

        const { data: inventoryData, error: inventoryError } = await supabase.rpc('get_current_inventory_by_type');
        if (inventoryError) throw new Error(`Error fetching current inventory: ${inventoryError.message}`);

        const allBloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
        const combinedSupplyData = allBloodTypes.map(type => {
          const prediction = predictedSupply.find((p: any) => p.blood_type === type);
          const inventory = inventoryData.find((i: any) => i.blood_type === type);
          const needed = prediction ? prediction.predicted_supply : 0;
          const available = inventory ? inventory.current_available : 0;
          const shortfall = Math.max(0, needed - available);
          return { type, needed, available, shortfall };
        });
        setSupplyForecast(combinedSupplyData);

        // 3. Demand Forecast
         const { data: predictedDemandData, error: demandError } = await supabase.rpc(
            'get_monthly_demand_forecast'
         );
         if (demandError) throw new Error(`Error fetching predicted demand: ${demandError.message}`);
         const formattedDemandData = predictedDemandData.map((d: any) => ({
             type: d.component_type,
             predicted_demand: d.predicted_demand
         })).sort((a: DemandForecastData, b: DemandForecastData) => b.predicted_demand - a.predicted_demand);
         setDemandForecast(formattedDemandData);

        // Calculations
        const total = combinedSupplyData.reduce((acc, item) => acc + item.shortfall, 0);
        setTotalShortfall(total);
        const most = combinedSupplyData.reduce((max, item) => (item.shortfall > max.shortfall ? item : max), { type: 'N/A', shortfall: 0 });
        setMostNeeded({ type: most.type, shortfall: most.shortfall });

        // 4. NEW: Fetch Request Reasons (Current Month Only)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);
        const startOfMonthStr = startOfMonth.toISOString();

        const { data: requestData, error: requestError } = await supabase
            .from('blood_requests')
            .select('request_reason')
            .gte('requested_at', startOfMonthStr); // Filter by date
        
        if (!requestError && requestData) {
            const counts: Record<string, number> = {};
            requestData.forEach((item: any) => {
                let reason = (item.request_reason || "Unspecified").trim();
                if(reason) reason = reason.charAt(0).toUpperCase() + reason.slice(1).toLowerCase();
                else reason = "Unspecified";
                counts[reason] = (counts[reason] || 0) + 1;
            });

            const formattedReasons = Object.keys(counts)
                .map(key => ({ reason: key, count: counts[key] }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6); 

            setReasonStats(formattedReasons);
        }

      } catch (err: any) {
        console.error("Error fetching current prediction data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictiveData();
  }, []);

  useEffect(() => {
    async function fetchAvailableMonths() {
        const { data, error } = await supabase
            .from('predicted_supply_history')
            .select('prediction_for_month')
            .order('prediction_for_month', { ascending: false });

        if (error) {
            console.error("Error fetching available prediction months:", error);
        } else if (data) {
            const months = [...new Set(data.map(item => item.prediction_for_month))].filter(Boolean) as string[];
            setAvailablePredictionMonths(months);
        }
    }
    fetchAvailableMonths();
}, []);

  useEffect(() => {
    async function fetchPastPredictionData() {
        if (!selectedPredictionMonth) {
             setPastSupplyPrediction([]);
             setPastDemandPrediction([]);
             return;
        };
        setLoadingPastPrediction(true);
        try {
            const { data: supplyData, error: supplyErr } = await supabase
                .from('predicted_supply_history')
                .select('blood_type, predicted_units')
                .eq('prediction_for_month', selectedPredictionMonth)
                .order('blood_type');
            if (supplyErr) throw new Error(`Error fetching past supply prediction: ${supplyErr.message}`);
            setPastSupplyPrediction(supplyData || []);

            const { data: demandData, error: demandErr } = await supabase
                .from('predicted_demand_history')
                .select('component_type, predicted_units')
                .eq('prediction_for_month', selectedPredictionMonth)
                .order('predicted_units', { ascending: false });
            if (demandErr) throw new Error(`Error fetching past demand prediction: ${demandErr.message}`);
            setPastDemandPrediction(demandData || []);
        } catch (err: any) {
            console.error("Error fetching past prediction data:", err);
            setError(err);
            setPastSupplyPrediction([]);
            setPastDemandPrediction([]);
        } finally {
            setLoadingPastPrediction(false);
        }
    }
    fetchPastPredictionData();
  }, [selectedPredictionMonth]);

  const handleExportPDF = () => {
    setIsExporting(true);
    setError(null);
    if (loading || supplyForecast.length === 0) {
        setError({ message: "Current prediction data is still loading or unavailable for export." });
        setIsExporting(false); return;
    }
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15; let currentY = margin;

        pdf.setFontSize(18); pdf.text(`DUGO Predictive & Analytics Report`, pageWidth / 2, currentY, { align: 'center' }); currentY += 8;
        pdf.setFontSize(14); pdf.text(`Forecast for ${nextMonthName}`, pageWidth / 2, currentY, { align: 'center' }); currentY += 12;
        pdf.setFontSize(12); pdf.text("Key Insights:", margin, currentY); currentY += 6;
        pdf.setFontSize(10);
        pdf.text(`- Predicted Supply Shortfall: ${totalShortfall} Units (vs. Target)`, margin + 5, currentY); currentY += 5;
        pdf.text(`- Top Priority Collection: Type ${mostNeeded.type}`, margin + 5, currentY); currentY += 5;
        
        const topReason = reasonStats.length > 0 ? reasonStats[0].reason : "N/A";
        pdf.text(`- Top Request Reason (${recentReasonMonth}): ${topReason}`, margin + 5, currentY); currentY += 10;

        const addTable = (title: string, head: any[], body: any[], addTotalRow: boolean = false, totalColumns: number[] = []) => {
           let finalY = currentY; const titleSpace = 6; const tableHeaderSpace = 10;
           if (currentY + titleSpace + tableHeaderSpace > pageHeight - margin) { pdf.addPage(); currentY = margin; }
           pdf.setFontSize(12); pdf.text(title, margin, currentY); currentY += titleSpace;
           let totalRow: any[] | null = null;
           if (addTotalRow && body.length > 0) {
               totalRow = ['Total', ...Array(head[0].length - 1).fill(0)];
               body.forEach(row => { totalColumns.forEach(colIndex => { if (colIndex > 0 && colIndex < head[0].length) { totalRow![colIndex] += row[colIndex] || 0; } }); });
           }
           autoTable(pdf, { startY: currentY, head, body, foot: totalRow ? [totalRow] : undefined, footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' }, theme: 'grid', headStyles: { fillColor: [239, 68, 68] }, margin: { left: margin, right: margin }, didDrawPage: (data) => { finalY = data.cursor?.y ?? currentY; } });
           currentY = finalY + 10;
        };

        addTable(`Supply Forecast Data for ${nextMonthName}`, [['Blood Type', 'Predicted Target', 'Currently Available', 'Shortfall']], supplyForecast.map(item => [item.type, item.needed, item.available, item.shortfall]), true, [1, 2, 3]);
        addTable(`Demand Forecast Data for ${nextMonthName}`, [['Component', 'Predicted Demand']], demandForecast.map(item => [item.type, item.predicted_demand]), true, [1]);
        // NEW Table for Reason Analytics
        addTable(`Top Reasons for Blood Requests (${recentReasonMonth})`, [['Reason', 'Count']], reasonStats.map(item => [item.reason, item.count]));
        addTable(`Historical Trend Data (Last 12 Months)`, [['Month', 'Demand', 'Supply']], monthlyTrendData.map(item => [item.month, item.demand, item.supply]));

        pdf.save(`DUGO_Predictive_Report_${nextMonthName.replace(/ /g, '_')}.pdf`);
    } catch (exportError) { console.error("Error exporting current prediction PDF:", exportError); }
    finally { setIsExporting(false); }
  };

  const handleExportPastPDF = () => {
    if (!selectedPredictionMonth || pastSupplyPrediction.length === 0 || pastDemandPrediction.length === 0) {
        setError({ message: "No past prediction data selected or available to export." });
        return;
    }
    setIsExporting(true);
    setError(null);
    const date = new Date(selectedPredictionMonth + 'T00:00:00');
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }); 
    const formattedMonth = formatter.format(date);
    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15; let currentY = margin;

        pdf.setFontSize(18); pdf.text(`DUGO Past Predictive Report`, pageWidth / 2, currentY, { align: 'center' }); currentY += 8;
        pdf.setFontSize(14); pdf.text(`Prediction Made For ${formattedMonth}`, pageWidth / 2, currentY, { align: 'center' }); currentY += 12;

        const addTable = (title: string, head: any[], body: any[]) => {
            let finalY = currentY; const titleSpace = 6; const tableHeaderSpace = 10;
            if (currentY + titleSpace + tableHeaderSpace > pageHeight - margin) { pdf.addPage(); currentY = margin; }
            pdf.setFontSize(12); pdf.text(title, margin, currentY); currentY += titleSpace;
            let totalRow: any[] | null = null;
            if (body.length > 0 && head[0].length > 1) {
                totalRow = ['Total', ...Array(head[0].length - 1).fill(0)];
                body.forEach(row => { totalRow![head[0].length - 1] += row[head[0].length - 1] || 0; });
            }
            autoTable(pdf, { startY: currentY, head, body, foot: totalRow ? [totalRow] : undefined, footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' }, theme: 'grid', headStyles: { fillColor: [239, 68, 68] }, margin: { left: margin, right: margin }, didDrawPage: (data) => { finalY = data.cursor?.y ?? currentY; } });
            currentY = finalY + 10;
        };
        addTable(`Past Supply Prediction for ${formattedMonth}`, [['Blood Type', 'Predicted Units']], pastSupplyPrediction.map(item => [item.blood_type, item.predicted_units]));
        addTable(`Past Demand Prediction for ${formattedMonth}`, [['Component', 'Predicted Units']], pastDemandPrediction.map(item => [item.component_type, item.predicted_units]));

        pdf.save(`DUGO_Past_Prediction_${formattedMonth.replace(/ /g, '_')}.pdf`);
    } catch (exportError) { console.error("Error exporting past prediction PDF:", exportError); }
    finally { setIsExporting(false); }
  };


  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <BloodbankHeader toggleSidebar={toggleSidebar} />
        <main id="report-content-area" className="mt-20 p-4 md:p-8">
          {!loading && !error && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleExportPDF}
                disabled={isExporting || loading}
                className={`bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm flex items-center gap-2 ${(isExporting || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isExporting ? ( <><LoadingIcon/> Exporting... </> ) : ( <><ExportIcon/> Export Current Report</> )}
              </button>
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center h-64 p-6 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-lg font-semibold text-gray-600 ml-4">Loading Predictive Data...</p>
            </div>
          )}
          {!loading && error && (
            <Card className="bg-red-50 border border-red-200 mb-6"> 
                <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
                <p className="text-red-600 font-mono bg-red-100 p-2 rounded">{error.message}</p>
                 <p className="text-gray-600 mt-2 text-sm">
                    Please check your Supabase setup and browser console for more details.
                </p>
            </Card>
          )}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <StatCard title="Predicted Supply Shortfall" value={`${totalShortfall} Units`} change={`vs. Target for ${nextMonthName}`} icon={<UsersIcon/>} />
                 <StatCard title="Top Priority Collection" value={mostNeeded.type} change={mostNeeded.shortfall > 0 ? `Need ${mostNeeded.shortfall} more units` : "Sufficient"} icon={<InventoryIcon/>} />
                 <StatCard title="Highest Predicted Demand" value={demandForecast.length > 0 ? demandForecast[0].type : "N/A"} change={`Est: ${demandForecast.length > 0 ? demandForecast[0].predicted_demand : 0} units for ${nextMonthName}`} icon={<ReportIcon/>} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 dark:text-gray-700">
                <Card>
                  <div className="bg-white p-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Supply Forecast (Collection)</h2>
                    <p className="text-sm text-gray-500 mb-4">Predicted Supply Target vs. Current Inventory for <strong>{nextMonthName}</strong></p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={supplyForecast} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="type" fontSize={12} /> <YAxis fontSize={12} /> <Tooltip /> <Legend />
                          <Bar dataKey="needed" fill="#ef4444" name="Predicted Supply (Target)" /> <Bar dataKey="available" fill="#a3a3a3" name="Currently Available" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card>
                  <div className="bg-white p-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Demand Forecast (Issuance)</h2>
                    <p className="text-sm text-gray-500 mb-4">Predicted demand by component for <strong>{nextMonthName}</strong>.</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={demandForecast} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="type" fontSize={12} /> <YAxis fontSize={12} /> <Tooltip /> <Legend />
                          <Bar dataKey="predicted_demand" fill="#3b82f6" name="Predicted Demand" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* NEW Analytics Section for Request Reasons */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                 {/* Pie Chart for Reasons */}
                 <Card className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Request Reason Analytics</h2>
                    <p className="text-sm text-gray-500 mb-4">Breakdown for {recentReasonMonth}</p>
                    <div className="h-[300px] flex justify-center items-center">
                        {reasonStats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={reasonStats}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="reason"
                                        label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                                    >
                                        {reasonStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-400 italic">No request data for {recentReasonMonth}.</p>
                        )}
                    </div>
                 </Card>

                 {/* Historical Trend (Wide) */}
                 <Card className="lg:col-span-2">
                    <div className="bg-white p-2">
                      <h2 className="text-xl font-bold text-gray-800 mb-1">12-Month Historical Trend</h2>
                      <p className="text-sm text-gray-500 mb-4">Historical demand vs. supply from your data.</p>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrendData} margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
                            <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="month" fontSize={12} /> <YAxis fontSize={12} /> <Tooltip /> <Legend />
                            <Line type="monotone" dataKey="demand" name="Historical Demand" stroke="#ef4444" strokeWidth={2} dot={false} /> <Line type ="monotone" dataKey="supply" name="Historical Supply" stroke="#22c55e" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                 </Card>
              </div>

              <Card>
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Actionable Recommendations for {nextMonthName}</h2>
                 <ul className="space-y-3 list-disc list-inside text-gray-700">
                   <li>
                     {mostNeeded.shortfall > 0
                         ? <>Focus collection efforts on <strong>Type {mostNeeded.type} donors</strong>. You are predicted to be <strong>{mostNeeded.shortfall} units</strong> short of the target.</>
                         : "All blood types are predicted to be at or above the supply target. Maintain regular collection drives."
                     }
                   </li>
                   <li>
                     {demandForecast.length > 0 &&
                         <>Prepare for high demand of <strong>{demandForecast[0].type}</strong>. Ensure component preparation is prioritized, as it's predicted to be the most requested item.</>
                     }
                   </li>
                   <li>
                     {reasonStats.length > 0 && 
                        <>A significant portion of requests this month are for <strong>{reasonStats[0].reason}</strong>. Consider specialized campaigns or stockpiling specific components often needed for this condition.</>
                     }
                   </li>
                   <li>Review the 12-month trend to identify seasonal peaks in demand and plan major campaigns around those months.</li>
                 </ul>
              </Card>

              {availablePredictionMonths.length > 0 && (
                <Card className="mt-8 border-t-4 border-blue-600">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">View Past Predictions</h2>
                    <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
                        <label htmlFor="pastMonthSelect" className="block text-sm font-medium text-gray-700 whitespace-nowrap">Select Month:</label>
                        <select
                            id="pastMonthSelect"
                            value={selectedPredictionMonth}
                            onChange={(e) => setSelectedPredictionMonth(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full sm:w-auto p-2.5 dark:text-gray-700"
                        >
                            <option value="">-- Select a Month --</option>
                            {availablePredictionMonths.map(month => {
                                const date = new Date(month + 'T00:00:00');
                                const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
                                return ( <option key={month} value={month}>{formatter.format(date)}</option> );
                            })}
                        </select>
                        {/* Export Button for Past Prediction */}
                        {selectedPredictionMonth && (pastSupplyPrediction.length > 0 || pastDemandPrediction.length > 0) && (
                             <button
                                onClick={handleExportPastPDF}
                                disabled={isExporting || loadingPastPrediction}
                                className={`ml-0 sm:ml-auto mt-2 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm flex items-center gap-2 ${(isExporting || loadingPastPrediction) ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                                 {isExporting || loadingPastPrediction ? ( <><LoadingIcon/> Exporting... </> ) : ( <><ExportIcon/> Export Selected Prediction </>)}
                             </button>
                        )}
                    </div>

                    {loadingPastPrediction && (
                         <div className="flex justify-center items-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><p className="ml-3 text-gray-500">Loading prediction...</p></div>
                    )}

                    {!loadingPastPrediction && selectedPredictionMonth && (pastSupplyPrediction.length > 0 || pastDemandPrediction.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* Past Supply Table */}
                            <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-2">Supply Prediction</h3>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50"><tr className="text-xs font-medium text-gray-500 uppercase tracking-wider"><th className="px-4 py-2 text-left">Blood Type</th><th className="px-4 py-2 text-right">Predicted Units</th></tr></thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pastSupplyPrediction.map((item, index) => (<tr key={`supply-${index}`}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.blood_type}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{item.predicted_units}</td></tr>))}
                                             <tr className="bg-gray-50 font-bold"><td className="px-4 py-2 text-left text-sm text-gray-700">Total</td><td className="px-4 py-2 text-right text-sm text-gray-700">{pastSupplyPrediction.reduce((sum, item) => sum + item.predicted_units, 0)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-2">Demand Prediction</h3>
                                 <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50"><tr className="text-xs font-medium text-gray-500 uppercase tracking-wider"><th className="px-4 py-2 text-left">Component</th><th className="px-4 py-2 text-right">Predicted Units</th></tr></thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pastDemandPrediction.map((item, index) => (<tr key={`demand-${index}`}><td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.component_type}</td><td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-right">{item.predicted_units}</td></tr>))}
                                             <tr className="bg-gray-50 font-bold"><td className="px-4 py-2 text-left text-sm text-gray-700">Total</td><td className="px-4 py-2 text-right text-sm text-gray-700">{pastDemandPrediction.reduce((sum, item) => sum + item.predicted_units, 0)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                     {/* Message when a month is selected but no data found */}
                     {!loadingPastPrediction && selectedPredictionMonth && pastSupplyPrediction.length === 0 && pastDemandPrediction.length === 0 && (
                         <p className="text-center text-gray-500 py-4">No prediction data found for the selected month.</p>
                     )}
                     {/* Initial message when no month is selected */}
                     {!loadingPastPrediction && !selectedPredictionMonth && (
                         <p className="text-center text-gray-400 py-4 italic">Select a month above to view its prediction history.</p>
                     )}
                </Card>
             )}
           
             {!loading && availablePredictionMonths.length === 0 && (
                <Card className="mt-8 border-t-4 border-blue-600">
                     <h2 className="text-xl font-bold text-gray-800 mb-4">View Past Predictions</h2>
                     <p className="text-center text-gray-500 py-4">No past prediction data has been recorded yet. The system will start saving predictions next month.</p>
                </Card>
             )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}