"use client";

import { useState, useEffect, FC, ReactNode } from "react"; // useRef removed
import { supabase } from "@/lib/supabaseClient";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import jsPDF from 'jspdf';
// html2canvas import removed
import autoTable from 'jspdf-autotable';

//========================================================//
// 1. ICONS (No changes)                                  //
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

//========================================================//
// 2. CHILD COMPONENTS (No changes)                       //
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
interface MonthlyTrendData { month: string; demand: number; supply: number; }
interface SupplyForecastData { type: string; needed: number; available: number; shortfall: number; }
interface DemandForecastData { type: string; predicted_demand: number; }

//========================================================//
// 3. MAIN PAGE COMPONENT (Simplified PDF Export)         //
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

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const now = new Date();
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    setNextMonthName(formatter.format(nextMonthDate));
  }, []);

  useEffect(() => {
    async function fetchPredictiveData() {
      setLoading(true);
      setError(null);
      try {
        const { data: trendData, error: trendError } = await supabase.rpc('get_historical_trends');
        if (trendError) throw new Error(`Error fetching historical trends: ${trendError.message}`);
        const formattedTrendData = trendData.map((d: any) => ({ month: d.month_text, demand: d.demand, supply: d.supply })).reverse();
        setMonthlyTrendData(formattedTrendData);

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

        const { data: predictedDemand, error: demandError } = await supabase.functions.invoke('predictive-demand-forecast');
        if (demandError) throw new Error(`Error fetching predicted demand: ${demandError.message}`);
        setDemandForecast(predictedDemand as DemandForecastData[]);

        const total = combinedSupplyData.reduce((acc, item) => acc + item.shortfall, 0);
        setTotalShortfall(total);
        const most = combinedSupplyData.reduce((max, item) => (item.shortfall > max.shortfall ? item : max), { type: 'N/A', shortfall: 0 });
        setMostNeeded({ type: most.type, shortfall: most.shortfall });

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictiveData();
  }, []);

  const handleExportPDF = () => {
    setIsExporting(true);
    setError(null);
    if (loading || supplyForecast.length === 0 || demandForecast.length === 0 || monthlyTrendData.length === 0) {
        setError({ message: "Data is still loading or unavailable for export." });
        setIsExporting(false); 
        return;
    }


    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let currentY = margin;

        pdf.setFontSize(18);
        pdf.text(`DUGO Predictive Report`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
        pdf.setFontSize(14);
        pdf.text(`Forecast for ${nextMonthName}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 12;
        pdf.setFontSize(12);
        pdf.text("Key Insights:", margin, currentY);
        currentY += 6;
        pdf.setFontSize(10);
        pdf.text(`- Predicted Supply Shortfall: ${totalShortfall} Units (vs. Target for ${nextMonthName})`, margin + 5, currentY); currentY += 5;
        pdf.text(`- Top Priority Collection: Type ${mostNeeded.type} (${mostNeeded.shortfall > 0 ? `Need ${mostNeeded.shortfall} more units` : "Sufficient"})`, margin + 5, currentY); currentY += 5;
        const highestDemand = demandForecast.length > 0 ? demandForecast[0] : null;
        pdf.text(`- Highest Predicted Demand: ${highestDemand ? highestDemand.type : 'N/A'} (Est: ${highestDemand ? highestDemand.predicted_demand : 0} units)`, margin + 5, currentY); currentY += 10;
         const addTable = (title: string, head: any[], body: any[], addTotalRow: boolean = false, totalColumns: number[] = []) => {
            let finalY = currentY;
            const titleSpace = 6;
            const tableHeaderSpace = 10;
             if (currentY + titleSpace + tableHeaderSpace > pageHeight - margin) {
                 pdf.addPage();
                 currentY = margin;
             }
             pdf.setFontSize(12);
             pdf.text(title, margin, currentY);
             currentY += titleSpace;
             let totalRow: any[] | null = null;
             if (addTotalRow && body.length > 0) {
                 totalRow = ['Total', ...Array(head[0].length - 1).fill(0)]; 
                 body.forEach(row => {
                     totalColumns.forEach(colIndex => {
                         if (colIndex > 0 && colIndex < head[0].length) { 
                             totalRow![colIndex] += row[colIndex] || 0; 
                         }
                     });
                 });
             }

             autoTable(pdf, {
                 startY: currentY,
                 head: head,
                 body: body,
                 foot: totalRow ? [totalRow] : undefined, 
                 footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' }, 
                 theme: 'grid',
                 headStyles: { fillColor: [239, 68, 68] }, 
                 margin: { left: margin, right: margin },
                 didDrawPage: (data) => {
                     finalY = data.cursor?.y ?? currentY; 
                 }
             });
             currentY = finalY + 10;
         };
         addTable(
             `Supply Forecast Data for ${nextMonthName}`,
             [['Blood Type', 'Predicted Target', 'Currently Available', 'Shortfall']],
             supplyForecast.map(item => [item.type, item.needed, item.available, item.shortfall]),
             true, 
             [1, 2, 3] 
         );
         addTable(
             `Demand Forecast Data for ${nextMonthName}`,
             [['Component', 'Predicted Demand']],
             demandForecast.map(item => [item.type, item.predicted_demand]),
             true, 
             [1]
         );

         addTable(
             `Historical Trend Data (Last 12 Months)`,
             [['Month', 'Demand', 'Supply']],
             monthlyTrendData.map(item => [item.month, item.demand, item.supply])
         );

        const rec1 = `- ${mostNeeded.shortfall > 0 ? `Focus collection efforts on Type ${mostNeeded.type} donors. You are predicted to be ${mostNeeded.shortfall} units short of the target.` : "All blood types are predicted to be at or above the supply target. Maintain regular collection drives."}`;
        const rec2 = `- ${demandForecast.length > 0 ? `Prepare for high demand of ${demandForecast[0].type}. Ensure component preparation is prioritized, as it's predicted to be the most requested item.` : ''}`;
        const rec3 = `- Review the 12-month trend to identify seasonal peaks in demand and plan major campaigns around those months.`;
        const maxWidth = pageWidth - 2 * margin - 5; 
        const splitText = (text: string) => pdf.splitTextToSize(text, maxWidth);
        const estimateLines = (text: string) => text ? splitText(text).length : 0;
        const lineHeight = 4; 
        const headerHeight = 6;
        const spacing = 2; 
        const estimatedRecHeight = headerHeight +
                                   (estimateLines(rec1) * lineHeight) + spacing +
                                   (estimateLines(rec2) * lineHeight) + spacing +
                                   (estimateLines(rec3) * lineHeight);

        // Check if recommendations fit on the current page
        if (currentY + estimatedRecHeight > pageHeight - margin) {
            pdf.addPage();
            currentY = margin;
        }

        pdf.setFontSize(12);
        pdf.text(`Actionable Recommendations for ${nextMonthName}:`, margin, currentY);
        currentY += headerHeight;
        pdf.setFontSize(10);

        // Add recommendation text line by line
        splitText(rec1).forEach((line: string) => { pdf.text(line, margin + 5, currentY); currentY += lineHeight; });
        currentY += spacing;
        if (rec2.length > 2) { // Only add if rec2 has content
            splitText(rec2).forEach((line: string) => { pdf.text(line, margin + 5, currentY); currentY += lineHeight; });
            currentY += spacing;
        }
        splitText(rec3).forEach((line: string) => { pdf.text(line, margin + 5, currentY); currentY += lineHeight; });

        // --- Save PDF ---
        pdf.save(`DUGO_Predictive_Report_${nextMonthName.replace(/ /g, '_')}.pdf`);

    } catch (exportError) {
        console.error("Error exporting simplified PDF:", exportError);
        if (exportError instanceof Error) {
            setError({ message: `PDF Export Failed: ${exportError.message}. Check browser console for details.` });
        } else {
             setError({ message: "An unknown error occurred during PDF export." });
        }
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <BloodbankHeader toggleSidebar={toggleSidebar} />
        {/* Main element - No ref needed */}
        <main id="report-content-area" className="mt-20 p-4 md:p-8">

          {/* --- Export Button Section --- */}
          {!loading && !error && (
            <div className="mb-6 flex justify-end">
              <button
                onClick={handleExportPDF}
                disabled={isExporting || loading} // Disable if exporting or still loading initial data
                className={`bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm flex items-center gap-2 ${(isExporting || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm5 1a1 1 0 00-1 1v6a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Export as PDF (Data Only)
                  </>
                )}
              </button>
            </div>
          )}
          {/* --- End of Export Button Section --- */}


          {/* --- Loading and Error States --- */}
          {loading && (
            <div className="flex justify-center items-center h-64 p-6 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="text-lg font-semibold text-gray-600 ml-4">Loading Predictive Data...</p>
            </div>
          )}
          {error && (
            <Card className="bg-red-50 border border-red-200">
                <h2 className="text-xl font-bold text-red-700 mb-2">Failed to Load or Export Data</h2>
                <p className="text-red-600 font-mono bg-red-100 p-2 rounded">{error.message}</p>
                 <p className="text-gray-600 mt-2 text-sm">
                    Please check your Supabase setup (tables, functions, RLS) and browser console for more details if exporting failed.
                </p>
            </Card>
          )}

          {/* --- Main Content --- */}
          {!loading && !error && (
            <>
              {/* Key Insights Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <StatCard title="Predicted Supply Shortfall" value={`${totalShortfall} Units`} change={`vs. Target for ${nextMonthName}`} icon={<UsersIcon/>} />
                 <StatCard title="Top Priority Collection" value={mostNeeded.type} change={mostNeeded.shortfall > 0 ? `Need ${mostNeeded.shortfall} more units` : "Sufficient"} icon={<InventoryIcon/>} />
                 <StatCard title="Highest Predicted Demand" value={demandForecast.length > 0 ? demandForecast[0].type : "N/A"} change={`Est: ${demandForecast.length > 0 ? demandForecast[0].predicted_demand : 0} units for ${nextMonthName}`} icon={<ReportIcon/>} />
              </div>

              {/* Charts Row - Displayed on page, not exported */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                  <div className="bg-white p-2 dark:text-gray-700">
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
                  <div className="bg-white p-2 dark:text-gray-700">
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

              {/* Historical Trend Line Chart - Displayed on page, not exported */}
              <Card className="mb-8">
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

              {/* Recommendations Card */}
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
                   <li>Review the 12-month trend to identify seasonal peaks in demand (e.g., months where the red line is highest) and plan major campaigns around those months.</li>
                 </ul>
              </Card>
            </>
          )}

        </main>
      </div>
    </div>
  );
}