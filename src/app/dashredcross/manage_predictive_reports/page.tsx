"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
                {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                {icon}
            </div>
        </div>
    </Card>
);

//========================================================//
// 3. MAIN PAGE COMPONENT                                 //
//========================================================//
export default function PredictiveReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [demandData] = useState([
    { month: "Jan", demand: 120, supply: 100 },
    { month: "Feb", demand: 140, supply: 130 },
    { month: "Mar", demand: 160, supply: 150 },
    { month: "Apr", demand: 180, supply: 170 },
    { month: "May", demand: 200, supply: 190 },
    { month: "Jun", demand: 220, supply: 210 },
  ]);

  const [bloodTypeData] = useState([
    { type: "A+", needed: 80, available: 70 },
    { type: "O+", needed: 100, available: 90 },
    { type: "B+", needed: 60, available: 55 },
    { type: "AB+", needed: 30, available: 25 },
    { type: "A-", needed: 20, available: 15 },
    { type: "O-", needed: 25, available: 18 },
    { type: "B-", needed: 15, available: 10 },
    { type: "AB-", needed: 10, available: 8 },
  ]);

  // --- Calculate Insights ---
  const totalShortfall = bloodTypeData.reduce((acc, item) => acc + (item.needed - item.available), 0);
  const mostNeeded = bloodTypeData.reduce((max, item) => (item.needed - item.available > max.shortfall ? { type: item.type, shortfall: item.needed - item.available } : max), { type: 'N/A', shortfall: 0 });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <BloodbankHeader toggleSidebar={toggleSidebar} />
        <main className="mt-20 p-4 md:p-8">
            {/* --- Key Insights Row --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Predicted 6-Month Shortfall" value={`${totalShortfall} Units`} icon={<UsersIcon/>} />
                <StatCard title="Most Needed Blood Type" value={mostNeeded.type} change={`Short by ${mostNeeded.shortfall} units`} icon={<InventoryIcon/>} />
                <StatCard title="Supply Trend" value="Increasing" change="+5% MoM" icon={<ReportIcon/>} />
            </div>

            {/* --- Charts Row --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Monthly Forecast</h2>
                    <p className="text-sm text-gray-500 mb-4">Predicted demand vs. supply for the next 6 months.</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={demandData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="demand" name="Predicted Demand" stroke="#ef4444" strokeWidth={2} />
                        <Line type="monotone" dataKey="supply" name="Predicted Supply" stroke="#22c55e" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Urgency by Blood Type</h2>
                    <p className="text-sm text-gray-500 mb-4">Comparison of needed vs. available units.</p>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={bloodTypeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="needed" fill="#ef4444" name="Predicted Need" />
                        <Bar dataKey="available" fill="#a3a3a3" name="Currently Available" />
                      </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* --- Recommendations Card --- */}
            <Card>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Actionable Recommendations</h2>
                <ul className="space-y-3 list-disc list-inside text-gray-700">
                    <li>Launch a targeted campaign for **{mostNeeded.type} donors** to address the immediate predicted shortfall of **{mostNeeded.shortfall} units**.</li>
                    <li>Increase general collection efforts in **April-June** where the demand-supply gap is projected to be largest.</li>
                    <li>Notify affiliated hospitals about the potential upcoming shortage of **B-** and **AB-** blood types.</li>
                </ul>
            </Card>
        </main>
      </div>
    </div>
  );
}