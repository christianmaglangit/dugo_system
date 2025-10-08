"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import jsPDF from "jspdf";
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
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-red-600">DUGO</h2>
            <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-100"><XIcon /></button>
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
                <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>
                <h1 className="text-xl font-bold text-gray-800">Scan Blood Bag</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const StageBadge = ({ stage }: { stage: number }) => {
    const stageMap: Record<number, { text: string; color: string }> = {
        1: { text: "Collected", color: "bg-blue-100 text-blue-800" },
        2: { text: "Testing", color: "bg-yellow-100 text-yellow-800" },
        3: { text: "In Inventory", color: "bg-green-100 text-green-800" },
        4: { text: "At Hospital", color: "bg-indigo-100 text-indigo-800" },
        5: { text: "Transfused", color: "bg-purple-100 text-purple-800" },
    };
    const { text, color } = stageMap[stage] || { text: "Unknown", color: "bg-gray-100 text-gray-800" };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>;
};

//========================================================//
// 3. MAIN PAGE COMPONENT                                 //
//========================================================//
//========================================================//
// 3. MAIN PAGE COMPONENT (UPDATED)                       //
//========================================================//
export default function HospitalQRScanner() {
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [bloodJourney, setBloodJourney] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const hasScanned = useRef(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const fetchBloodJourney = async (bagId?: string) => {
        let query = supabase.from("blood_journey").select(`donation_id, stage, location, updated_at, blood_inventory ( blood_bag_id ), user_id`).order("updated_at", { ascending: false });
        if (bagId) {
            const { data: invData } = await supabase.from('blood_inventory').select('id').eq('blood_bag_id', bagId).single();
            if (!invData) { setBloodJourney([]); return; }
            query = query.eq("donation_id", invData.id);
            setIsFiltered(true);
        } else {
            setIsFiltered(false);
        }
        const { data, error } = await query;
        if (error) { console.error(error); setBloodJourney([]); }
        else { setBloodJourney(data || []); }
    };

    useEffect(() => { fetchBloodJourney(); }, []);

    const startScanner = async () => {
        if (scannerRef.current?.isScanning) return;
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        try {
            await scanner.start(
                { facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    if (!hasScanned.current) {
                        hasScanned.current = true;
                        if (scanner.isScanning) {
                            scanner.stop().then(() => setScannedData(decodedText));
                        }
                    }
                }, () => { }
            );
        } catch (err: any) { console.error("Camera start error:", err.message); }
    };

    useEffect(() => {
        startScanner();
        return () => {
            if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().catch(err => console.warn("Error stopping scanner on unmount:", err));
            }
        };
    }, []);

    const updateBloodStage = async (bagId: string, stage: number, location: string) => {
        setLoading(true);
        const { data: inventory } = await supabase.from("blood_inventory").select("id").eq("blood_bag_id", bagId).single();
        if (!inventory) {
            setLoading(false);
            Swal.fire("Error", "Bag not found in inventory.", "error"); return;
        }
        const { error } = await supabase.from("blood_journey").update({ stage, location, updated_at: new Date().toISOString() }).eq("donation_id", inventory.id);
        setLoading(false);
        if (error) {
            Swal.fire("Error", error.message, "error");
        } else {
            await Swal.fire({ icon: "success", title: "Blood stage updated!", showConfirmButton: false, timer: 1500 });
            fetchBloodJourney();
        }
        hasScanned.current = false;
        setScannedData(null);
        startScanner();
    };

    useEffect(() => {
        if (!scannedData) return;
        const bagId = scannedData.match(/Blood Bag ID:\s*(\d+)/)?.[1];
        if (!bagId) {
            Swal.fire("Error", "Invalid QR Code format", "error").then(() => {
                hasScanned.current = false; setScannedData(null); startScanner();
            });
            return;
        }

        fetchBloodJourney(bagId);

        const stageOptions: Record<string, string> = {
            '1': 'Collected by Red Cross',
            '2': 'Undergoing Testing',
            '3': 'Added to Inventory',
            '5': 'Transfusion Complete'
        };

        const buttonsHtml = Object.entries(stageOptions).map(([num, text]) =>
            `<button id="swal-stage-${num}" class="swal2-confirm swal2-styled" style="background-color: #3B82F6; margin: 5px; width: 80%;">${text}</button>`
        ).join('');

        Swal.fire({
            title: `Update Stage for Bag ID: ${bagId}`,
            html: `<div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-top: 1rem;">${buttonsHtml}</div>`,
            showConfirmButton: false, showCancelButton: true, cancelButtonText: 'Cancel',
        }).then(result => {
            if (result.isDismissed) {
                hasScanned.current = false; setScannedData(null); startScanner();
            }
        });

        Object.keys(stageOptions).forEach(stageNum => {
            document.getElementById(`swal-stage-${stageNum}`)?.addEventListener('click', () => {
                Swal.close();
                updateBloodStage(bagId, parseInt(stageNum), stageOptions[stageNum]);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scannedData]);

    // --- NEW EXPORT PDF FUNCTION ---
    const handleExportPDF = async () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const { value: formValues, isConfirmed } = await Swal.fire({
            title: 'Select Month and Year for Report',
            html: `
                <select id="swal-month" class="swal2-select">
                    ${months.map((m, i) => `<option value="${i}" ${i === currentMonth ? 'selected' : ''}>${m}</option>`).join('')}
                </select>
                <input id="swal-year" type="number" value="${currentYear}" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => ({
                month: (document.getElementById('swal-month') as HTMLSelectElement).value,
                year: (document.getElementById('swal-year') as HTMLInputElement).value
            })
        });
        
        if (!isConfirmed || !formValues) return;

        const selectedMonth = parseInt(formValues.month, 10);
        const selectedYear = parseInt(formValues.year, 10);

        const filtered = bloodJourney.filter(j => {
            const journeyDate = new Date(j.updated_at.replace(' ', 'T') + 'Z');
            return journeyDate.getMonth() === selectedMonth && journeyDate.getFullYear() === selectedYear;
        });

        if (filtered.length === 0) {
            Swal.fire('No Data', `No journey updates found for ${months[selectedMonth]} ${selectedYear}.`, 'info');
            return;
        }

        const stats = {
            total: filtered.length,
            collected: filtered.filter(j => j.stage === 1).length,
            testing: filtered.filter(j => j.stage === 2).length,
            inInventory: filtered.filter(j => j.stage === 3).length,
            atHospital: filtered.filter(j => j.stage === 4).length,
            transfused: filtered.filter(j => j.stage === 5).length,
        };

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Blood Journey Report', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${months[selectedMonth]} ${selectedYear}`, pageWidth / 2, 28, { align: 'center' });

        autoTable(doc, {
            startY: 40,
            head: [['Stage Summary', 'Total Updates This Month']],
            body: [
                ['Total Updates Scanned', stats.total],
                ['Collected', stats.collected],
                ['Testing', stats.testing],
                ['In Inventory', stats.inInventory],
                ['At Hospital', stats.atHospital],
                ['Transfused', stats.transfused],
            ],
            theme: 'grid',
            headStyles: { fillColor: [209, 36, 42] }
        });

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['Blood Bag ID', 'Current Stage', 'Last Updated']],
            body: filtered.map(j => [
                j.blood_inventory?.blood_bag_id || 'N/A',
                (StageBadge({ stage: j.stage }) as any).props.children, // Extract text from component
                philippineTimeFormatter.format(new Date(j.updated_at.replace(' ', 'T') + 'Z')),
            ]),
            theme: 'striped',
            headStyles: { fillColor: [209, 36, 42] }
        });

        doc.save(`Blood_Journey_Report_${months[selectedMonth]}_${selectedYear}.pdf`);
    };

    const filteredJourney = bloodJourney.filter((row) => row.blood_inventory?.blood_bag_id?.toLowerCase().includes(searchQuery.toLowerCase()));

    const philippineTimeFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: '2-digit', second: '2-digit',
        hour12: true, timeZone: 'Asia/Manila',
    });

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 w-full transition-all duration-300 md:ml-72">
                <BloodbankHeader toggleSidebar={toggleSidebar} />
                <main className="mt-20 p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* --- Left Column: Scanner --- */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-semibold text-gray-800">Scan Blood Bag QR Code</h2>
                                <p className="text-sm text-gray-500 mt-1 mb-4">Position the QR code inside the frame to scan.</p>
                                <div id="reader" className="w-full rounded-lg overflow-hidden border-2 border-gray-200"></div>
                            </div>
                        </div>

                        {/* --- Right Column: Blood Journey Log --- */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                    <h2 className="font-semibold text-lg text-gray-800">Blood Journey Log</h2>
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <button onClick={handleExportPDF} className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-800 transition">Export Report</button>
                                        <input type="text" placeholder="Search by Bag ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full md:w-64 pl-4 pr-2 py-2 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm min-w-[600px]">
                                        <thead className="bg-gray-50">
                                            <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                                                <th className="p-4">Blood Bag ID</th>
                                                <th className="p-4">Current Stage</th>
                                                <th className="p-4">Last Updated</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredJourney.map((row) => (
                                                <tr key={row.donation_id} className="hover:bg-gray-50">
                                                    <td className="p-4 font-mono text-gray-700">{row.blood_inventory?.blood_bag_id || "N/A"}</td>
                                                    <td className="p-4"><StageBadge stage={row.stage} /></td>
                                                    <td className="p-4 text-gray-600">
                                                        {philippineTimeFormatter.format(new Date(row.updated_at.replace(' ', 'T') + 'Z'))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}