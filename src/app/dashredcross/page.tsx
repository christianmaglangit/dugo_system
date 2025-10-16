'use client';

import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Swal from "sweetalert2";

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
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>;

//========================================================//
// 2. CHILD COMPONENTS                                    //
//========================================================//
// --- Notification Type ---
type Notification = {
    id: number;
    message: string;
    created_at: string;
    is_read: boolean;
};

function BloodbankSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname();
    const links = [
        { name: "Dashboard", href: "/dashredcross", icon: <DashboardIcon/> },
        { name: "Manage Inventory", href: "/dashredcross/manage_inventory", icon: <InventoryIcon/> },
        { name: "Manage Accounts", href: "/dashredcross/manage_users_account", icon: <UsersIcon/> },
        { name: "Manage Appointments", href: "/dashredcross/manage_donor_appointment", icon: <AppointmentIcon/> },
        { name: "Predictive Reports", href: "/dashredcross/manage_predictive_reports", icon: <ReportIcon/> },
        { name: "Blood Requests", href: "/dashredcross/manage_blood_request", icon: <RequestIcon/> },
        { name: "Blood Campaigns", href: "/dashredcross/manage_blood_campaign", icon: <CampaignIcon/> },
        { name: "Scan Blood Bags", href: "/dashredcross/manage_scan_blood_bag", icon: <ScanIcon/> },
        { name: "Hospital Inventory", href: "/dashredcross/manage_hospital_inventory", icon: <HospitalIcon/> },
    ];

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose}></div>}
            <aside className={`w-72 min-h-screen fixed left-0 top-0 bg-white shadow-lg p-6 flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex`}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-red-600">DUGO</h2>
                        <p className="text-xs text-gray-600 font-medium">(Donor Utility for Giving and Organizing)</p>
                    </div>
                    <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-100"><XIcon /></button>
                </div>
                <nav className="flex flex-col space-y-2">
                    {links.map(link => (
                        <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-semibold ${pathname === link.href ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
                            {link.icon}<span>{link.name}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}

function BloodbankHeader({ name, onMenuClick, notifications, unreadCount, onNotificationOpen }: { name: string, onMenuClick: () => void, notifications: Notification[], unreadCount: number, onNotificationOpen: () => void }) {
    const router = useRouter();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };

    const handleBellClick = () => {
        setIsNotificationOpen(!isNotificationOpen);
        if (unreadCount > 0) {
            onNotificationOpen();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                {/* --- Notification Bell --- */}
                <div className="relative">
                    <button onClick={handleBellClick} className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 relative">
                        <BellIcon />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                        )}
                    </button>
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl z-50 border overflow-hidden">
                            <div className="p-3 border-b">
                                <p className="font-semibold text-sm">Notifications</p>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(notif => (
                                    <div key={notif.id} className={`p-3 text-sm border-b hover:bg-gray-50 ${!notif.is_read ? 'bg-red-50' : ''}`}>
                                        <p className="text-gray-700">{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                                    </div>
                                )) : (
                                    <p className="p-4 text-sm text-gray-500 text-center">No new notifications</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- User Dropdown --- */}
                <div className="relative">
                    <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                        <span className="font-semibold text-gray-700 text-sm hidden sm:inline">{name}</span>
                        <ChevronDownIcon />
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl z-50 border overflow-hidden">
                            <div className="p-3 border-b">
                                <p className="font-semibold text-sm">{name}</p>
                                <p className="text-xs text-gray-500">Red Cross Admin</p>
                            </div>
                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-2xl shadow-lg p-6 bg-white text-black ${className || ""}`}>{children}</div>;
}

const StatCard = ({ title, value, icon, color }: {title: string, value: string | number, icon: ReactNode, color: string}) => (
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

//========================================================//
// 3. MAIN DASHBOARD COMPONENT                            //
//========================================================//
export default function RedCrossDashboard() {
    const [bloodData, setBloodData] = useState<{ type: string; RBC: number; Plasma: number; Platelets: number; WBC: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const [bloodRequests, setBloodRequests] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [campaigns, setCampaigns] = useState<any[]>([]);
    
    // --- Notification State ---
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            
            if (!authUser) {
                console.error("User not found.");
                setLoading(false);
                return;
            }

            setCurrentUserId(authUser.id); // Store the UUID for notifications
            
            const { data: profile, error: profileError } = await supabase
                .from("users")
                .select("name, user_id")
                .eq("id", authUser.id)
                .single();

            if (profileError || !profile) {
                console.error("Failed to fetch profile:", profileError);
                setLoading(false);
                return;
            }
            setUserName(profile.name);
            const staffUserId = profile.user_id;

            // Fetch all initial data concurrently
            const [
                { data: inventoryData },
                { data: requestsData },
                { data: appointmentsData },
                { data: campaignsData },
                { data: initialNotifications }
            ] = await Promise.all([
                supabase.from("blood_inventory").select("*").eq("added_by", staffUserId),
                supabase.from("blood_requests").select("*"),
                supabase.from("donor_appointments").select("*"),
                supabase.from("blood_campaigns").select("*"),
                supabase.from("notifications").select("*").eq("user_id", authUser.id).order('created_at', { ascending: false })
            ]);

            // Process inventory data
            if (inventoryData) {
                type BloodComponent = "RBC" | "Plasma" | "Platelets" | "WBC";
                const allTypes: string[] = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
                const allComponents: BloodComponent[] = ["RBC", "Plasma", "Platelets", "WBC"];
                const aggregation = Object.fromEntries(allTypes.map(type => [type, Object.fromEntries(allComponents.map(comp => [comp, 0]))])) as Record<string, Record<BloodComponent, number>>;
                
                inventoryData.forEach((item: any) => {
                    const component = item.component as BloodComponent;
                    if (allTypes.includes(item.type) && allComponents.includes(component)) {
                        aggregation[item.type][component] += item.units;
                    }
                });
                setBloodData(allTypes.map(type => ({ type, ...aggregation[type] })));
            }

            // Set other data
            setBloodRequests(requestsData || []);
            setAppointments(appointmentsData || []);
            setCampaigns(campaignsData || []);

            // Set initial notifications
            if (initialNotifications) {
                setNotifications(initialNotifications);
                setUnreadCount(initialNotifications.filter(n => !n.is_read).length);
            }

            setLoading(false);
        };

        loadDashboardData();
    }, []); 

    // --- Real-time Notification Listener ---
    useEffect(() => {
        if (!currentUserId) return;

        const channel = supabase.channel('public:notifications')
            .on('postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${currentUserId}` }, 
                (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);

                    // Show a toast
                    Swal.fire({
                        title: 'New Notification!',
                        text: newNotification.message,
                        icon: 'info',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUserId]);

    const handleNotificationOpen = async () => {
        if (unreadCount > 0 && currentUserId) {
            const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
            if (unreadIds.length === 0) return;

            // Update in DB
            await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);

            // Update local state
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };

    const totalUnits = bloodData.reduce((acc, cur) => acc + cur.RBC + cur.Plasma + cur.Platelets + cur.WBC, 0);

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <BloodbankSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="w-full transition-all duration-300 md:ml-72">
                <BloodbankHeader 
                    name={userName} 
                    onMenuClick={() => setIsSidebarOpen(true)}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onNotificationOpen={handleNotificationOpen}
                />
                <main className="mt-20 p-4 md:p-8">
                    <div className=" grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard title="Total Units" value={totalUnits} icon={<InventoryIcon />} color="bg-red-500" />
                        <StatCard title="Pending Requests" value={bloodRequests.filter(r => r.status === 'Pending').length} icon={<RequestIcon />} color="bg-yellow-500" />
                        <StatCard title="Approved Appointments" value={appointments.filter(a => a.status === 'Approved').length} icon={<AppointmentIcon />} color="bg-blue-500" />
                        <StatCard title="Upcoming Campaigns" value={campaigns.filter(c => new Date(c.date) > new Date()).length} icon={<CampaignIcon />} color="bg-green-500" />
                    </div>

                    <div className="grid lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3">
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Blood Units by Type</h2>
                                <div className="w-full h-96">
                                {loading ? <p className="text-center text-gray-500">Loading chart...</p> : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={bloodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
                                        <YAxis stroke="#6b7280" fontSize={12} />
                                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }} />
                                        <Legend />
                                        <Bar dataKey="RBC" name="RBC" stackId="a" fill="#ef4444" />
                                        <Bar dataKey="Plasma" name="Plasma" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="Platelets" name="Platelets" stackId="a" fill="#facc15" />
                                        <Bar dataKey="WBC" name="WBC" stackId="a" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                                </div>
                            </Card>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                              <h2 className="text-lg font-semibold text-gray-800 mb-4">Predictive Report</h2>
                              <p className="text-sm text-gray-600 mb-4">Based on historical data, we predict a higher demand for O+ blood in the next 30 days.</p>
                              <button onClick={() => router.push("/dashredcross/manage_predictive_reports")} className="w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">
                                View Full Report
                              </button>
                            </Card>
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="flex flex-col space-y-3">
                                    <Link href="/dashredcross/manage_blood_request" className="text-center w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">Manage Requests</Link>
                                    <Link href="/dashredcross/manage_donor_appointment" className="text-center w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">Manage Appointments</Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}