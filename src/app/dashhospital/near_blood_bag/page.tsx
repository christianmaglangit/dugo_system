"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

//========================================================//
// 1. ICONS                                               //
//========================================================//
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const RequestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.5 10a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /><path d="M10 2a.75.75 0 00-7.465 5.222.75.75 0 001.478.204A6.5 6.5 0 0110 3.5a.75.75 0 000-1.5zM3.28 8.243a6.5 6.5 0 0111.41-3.662.75.75 0 101.246-.828A8 8 0 002.09 7.648a.75.75 0 101.19.595z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /><path d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 000 2h8a1 1 0 100-2H5zm1 3a1 1 0 100 2h5a1 1 0 100-2H6z" /></svg>;
const NearbyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.69 18.23a2.25 2.25 0 003.62 0l4.5-6.75a.75.75 0 00-1.12-1.12L13 13.88V4.75a.75.75 0 00-1.5 0v9.13L8.33 10.36a.75.75 0 00-1.12 1.12l2.48 3.75z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v12a1 1 0 11-2 0V3a1 1 0 011-1zm3 1a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 11-2 0V4H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;

//========================================================//
// 2. CHILD COMPONENTS                                    //
//========================================================//

function HospitalSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/dashhospital", icon: <DashboardIcon /> },
    { name: "Scan Blood Bag", href: "/dashhospital/scan_blood_bag", icon: <ScanIcon /> },
    { name: "Blood Inventory", href: "/dashhospital/blood_inventory", icon: <InventoryIcon /> },
    { name: "Blood Request", href: "/dashhospital/blood_request", icon: <RequestIcon /> },
    { name: "Nearby Blood Record", href: "/dashhospital/near_blood_bag", icon: <NearbyIcon /> },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose}></div>}
      <aside className={`w-72 min-h-screen fixed left-0 top-0 bg-white shadow-lg p-6 flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-red-600">DUGO</h2>
            <p className="text-xs text-gray-600 font-medium">
              (Donor Utility for Giving and Organizing)
            </p>
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

function HospitalHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>
                <h1 className="text-xl font-bold text-gray-800">Nearby Blood Bank Records</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>{children}</div>
);

const StatCard = ({ title, value, icon, color }: {title: string, value: string | number, icon: ReactNode, color:string}) => (
    <Card className={`relative overflow-hidden`}>
        <div className={`absolute -top-4 -right-4 h-16 w-16 ${color} opacity-20 rounded-full`}></div>
        <div className="relative flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color} text-white`}>{icon}</div>
            <div>
                <p className="text-3xl font-extrabold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 font-semibold">{title}</p>
            </div>
        </div>
    </Card>
);

const StatusBadge = ({ expiration_date }: { expiration_date: string }) => {
    const isExpired = new Date(expiration_date) < new Date();
    const statusText = isExpired ? "Expired" : "Available";
    const color = isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{statusText}</span>;
};


//========================================================//
// 3. MAIN PAGE COMPONENT                                 //
//========================================================//
interface BloodInventory {
  id: string;
  blood_bag_id: string;
  type: string;
  component: string;
  units: number;
  volume_ml: number;
  expiration_date: string;
  status: string;
  date_received: string;
  added_by: string | null;
  name: string | null; // This will be populated
}

export default function NearBloodBagPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bloodData, setBloodData] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchBloodData = async () => {
      setLoading(true);
      
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("blood_inventory")
        .select("*")
        .order("date_received", { ascending: false });

      if (inventoryError) {
        console.error("Error fetching blood inventory:", inventoryError);
        setLoading(false);
        return;
      }
      
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("user_id, name");

      if (usersError) {
        console.error("Error fetching users:", usersError);
        setBloodData(inventoryData || []); // Use data even if user fetch fails
        setLoading(false);
        return;
      }

      const userMap = new Map(usersData.map(u => [u.user_id, u.name]));
      
      const enrichedData = inventoryData.map(item => ({
        ...item,
        name: userMap.get(item.added_by || "") || "Unknown Location"
      }));

      setBloodData(enrichedData);
      setLoading(false);
    };

    fetchBloodData();
  }, []);
  
  const filteredData = bloodData.filter((blood) => {
    const term = searchTerm.toLowerCase();
    return (
      (blood.type?.toLowerCase() || "").includes(term) ||
      (blood.blood_bag_id?.toLowerCase() || "").includes(term) ||
      (blood.added_by?.toLowerCase() || "").includes(term) ||
      (blood.name?.toLowerCase() || "").includes(term)
    );
  });
  
  const totalUnits = filteredData.reduce((sum, item) => sum + item.units, 0);
  const uniqueLocations = [...new Set(filteredData.map(item => item.name).filter(Boolean))].length;
  const expiringSoon = filteredData.filter(item => {
      const expDate = new Date(item.expiration_date);
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);
      return expDate > today && expDate <= sevenDaysFromNow;
  }).length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <HospitalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <HospitalHeader toggleSidebar={toggleSidebar} />
        <main className="mt-20 p-4 md:p-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Units Available" value={totalUnits} icon={<InventoryIcon />} color="bg-red-500"/>
                <StatCard title="Reporting Locations" value={uniqueLocations} icon={<BuildingIcon />} color="bg-blue-500"/>
                <StatCard title="Units Expiring in 7 Days" value={expiringSoon} icon={<ClockIcon />} color="bg-yellow-500"/>
            </div>

            <Card>
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h2 className="text-xl font-bold text-gray-800 self-start md:self-center">Nearby Blood Bank Records</h2>
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg></span>
                    <input type="text" placeholder="Search by type, location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400"/>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                      <th className="p-4">Blood Bag ID</th>
                      <th className="p-4">Name</th>
                      <th className="p-4 text-center">Blood Type</th>
                      <th className="p-4">Component</th>
                      <th className="p-4 text-center">Units</th>
                      <th className="p-4">Expiration Date</th>
                      <th className="p-4 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (<tr><td colSpan={7} className="text-center p-8 text-gray-500">Loading...</td></tr>) : 
                    filteredData.length === 0 ? (<tr><td colSpan={7} className="text-center p-8 text-gray-500">No records found.</td></tr>) : 
                    (
                        filteredData.map((blood) => (
                          <tr key={blood.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-gray-700">{blood.blood_bag_id}</td>
                            <td className="p-4 font-semibold text-gray-800">{blood.name}</td>
                            <td className="p-4 text-center font-bold text-red-600">{blood.type}</td>
                            <td className="p-4">{blood.component}</td>
                            <td className="p-4 text-center font-semibold">{blood.units}</td>
                            <td className="p-4 text-gray-600">{blood.expiration_date}</td>
                            <td className="p-4 text-left">{blood.status}</td>
                            
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
        </main>
      </div>
    </div>
  );
}