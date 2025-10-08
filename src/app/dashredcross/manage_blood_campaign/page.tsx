"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Dialog } from "@headlessui/react";
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
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;

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

function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                {toggleSidebar && <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>}
                <h1 className="text-xl font-bold text-gray-800">Manage Campaigns</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const InputField = ({ label, children, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        {children ? (
            <select className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" {...props}>{children}</select>
        ) : (
            <input className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" {...props} />
        )}
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: Record<string, string> = {
        Upcoming: "bg-blue-100 text-blue-800",
        Ongoing: "bg-green-100 text-green-800",
        Completed: "bg-gray-100 text-gray-800",
        Cancelled: "bg-red-100 text-red-800",
    };
    const color = statusMap[status] || "bg-gray-100 text-gray-800";
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{status}</span>;
};

function CampaignFormModal({ isOpen, onClose, onSave, editingCampaign }: { isOpen: boolean; onClose: () => void; onSave: () => void; editingCampaign: any | null }) {
    const [form, setForm] = useState({ title: "", description: "", location: "", date: "", time: "", photo: null as File | null });

    useEffect(() => {
        if (editingCampaign) {
            setForm({
                title: editingCampaign.title || "",
                description: editingCampaign.description || "",
                location: editingCampaign.location || "",
                date: editingCampaign.date || "",
                time: editingCampaign.time || "",
                photo: null
            });
        } else {
            setForm({ title: "", description: "", location: "", date: "", time: "", photo: null });
        }
    }, [editingCampaign]);

    const handleSave = async () => {
        if (!form.title || !form.description || !form.location || !form.date || !form.time) {
            Swal.fire("Error", "All fields are required!", "error"); return;
        }

        let photoUrl = editingCampaign?.photo_url || null;
        if (form.photo) {
            const filePath = `public/${Date.now()}_${form.photo.name}`;
            const { error: uploadError } = await supabase.storage.from("campaigns").upload(filePath, form.photo);
            if (uploadError) { Swal.fire("Error", `Photo upload failed: ${uploadError.message}`, "error"); return; }
            const { data } = supabase.storage.from("campaigns").getPublicUrl(filePath);
            photoUrl = data.publicUrl;
        }

        const payload = { title: form.title, description: form.description, location: form.location, date: form.date, time: form.time, photo_url: photoUrl };
        const { error } = editingCampaign
            ? await supabase.from("blood_campaigns").update(payload).eq("id", editingCampaign.id)
            : await supabase.from("blood_campaigns").insert([payload]);

        if (error) {
            Swal.fire("Error", `Failed to save campaign: ${error.message}`, "error");
        } else {
            Swal.fire("Success", `Campaign ${editingCampaign ? 'updated' : 'added'} successfully!`, "success");
            onSave();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                    <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
                        <h2 className="text-3xl font-bold">{editingCampaign ? "Edit Campaign" : "Create a Campaign"}</h2>
                        <p className="mt-4 text-red-100">{editingCampaign ? "Update the details for this event." : "Fill out the form to schedule a new bloodletting campaign."}</p>
                    </div>
                    <div className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon /></button>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingCampaign ? "Edit Campaign Details" : "New Campaign Details"}</h3>
                        <div className="space-y-4">
                            <InputField label="Campaign Title" name="title" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Annual Blood Drive" />
                            <InputField label="Location" name="location" value={form.location} onChange={(e: any) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Iligan City Hall" />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Date" type="date" name="date" value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} />
                                <InputField label="Time" type="time" name="time" value={form.time} onChange={(e: any) => setForm({ ...form, time: e.target.value })} />
                            </div>
                            <InputField label="Campaign Photo" type="file" accept="image/*" onChange={(e: any) => setForm({ ...form, photo: e.target.files?.[0] || null })} />
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-500" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                                <button type="button" onClick={handleSave} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">{editingCampaign ? "Update Campaign" : "Add Campaign"}</button>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}


function CampaignReportModal({ campaign, onClose }: { campaign: any | null, onClose: () => void }) {
    const [stats, setStats] = useState<{ total: number, byType: Record<string, number> } | null>(null);
    const [donors, setDonors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!campaign) return;

        const fetchData = async () => {
            setLoading(true);

            // Fetch aggregate stats
            const { data: statsData, error: statsError, count } = await supabase
                .from('blood_inventory')
                .select('type', { count: 'exact' })
                .eq('campaign_id', campaign.id);

            if (statsError) {
                console.error("Stats Error:", statsError);
                Swal.fire('Error', 'Could not fetch campaign donation data.', 'error');
            } else {
                const byType = statsData.reduce((acc, { type }) => {
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                setStats({ total: count || 0, byType });
            }

            // Fetch detailed donor info
            const { data: donorData, error: donorError } = await supabase
                .from('blood_inventory')
                .select(`
                    user_id,
                    type,
                    users (
                        name,
                        age,
                        gender,
                        contact,
                        blood_type
                    )
                `)
                .eq('campaign_id', campaign.id);

            if (donorError) {
                console.error("Donor Fetch Error:", donorError);
                Swal.fire('Database Error', `Could not fetch donor details: ${donorError.message}`, 'error');
            } else {
                setDonors(donorData);
            }

            setLoading(false);
        };

        fetchData();
    }, [campaign]);

    const handleExportPDF = () => {
        if (!stats || donors.length === 0) {
            Swal.fire('Info', 'No data available to export.', 'info');
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // 1. Add Header
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text("Campaign Donation Report", pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Campaign Title: ${campaign.title}`, 15, 35);
        doc.text(`Location: ${campaign.location}`, 15, 42);
        doc.text(`Date: ${campaign.date}`, 15, 49);
        doc.text(`Report Generated: ${today}`, 15, 56);

        // 2. Add Donation Summary Table
        autoTable(doc, {
            startY: 65,
            head: [['Donation Summary', 'Value']],
            body: [
                ['Total Donations Collected', stats.total],
                ...Object.entries(stats.byType).map(([type, count]) => [`Blood Type: ${type}`, `${count} bag(s)`])
            ],
            theme: 'grid',
            headStyles: { fillColor: [209, 36, 42] } // Red Cross color
        });

        // 3. Add Donor Details Table
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Donor Name', 'Age', 'Gender', 'Contact', 'Blood Type (Donated)']],
            body: donors.map(donor => [
                donor.users?.name || 'N/A',
                donor.users?.age || 'N/A',
                donor.users?.gender || 'N/A',
                donor.users?.contact || 'N/A',
                donor.type || 'N/A'
            ]),
            theme: 'striped',
            headStyles: { fillColor: [209, 36, 42] } // Red Cross color
        });

        // 4. Save the PDF
        doc.save(`Campaign_Report_${campaign.title.replace(/ /g, "_")}.pdf`);
    };

    if (!campaign) return null;

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon /></button>
                    <h2 className="text-2xl font-bold text-gray-800">{campaign.title}</h2>
                    <p className="text-sm text-gray-500 mb-6">Donation Report</p>
                    {loading ? (
                        <p className="py-8 text-center text-gray-500">Loading report...</p>
                    ) : stats && stats.total > 0 ? (
                        <div>
                            <p className="text-5xl font-bold text-red-600">{stats.total}</p>
                            <p className="font-semibold text-gray-600 mb-4">Total Donations Collected</p>
                            <div className="border-t pt-4 mt-4">
                                <h4 className="font-semibold mb-2">Breakdown by Blood Type:</h4>
                                <ul className="space-y-1 max-h-48 overflow-y-auto pr-2">
                                    {Object.entries(stats.byType).map(([type, count]) => (
                                        <li key={type} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                            <span className="font-semibold text-red-700">{type}</span>
                                            <span className="font-bold">{count} bag(s)</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-6 pt-4 border-t">
                                <button
                                    onClick={handleExportPDF}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Export Report as PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="py-8 text-center text-gray-500">No donations have been recorded for this campaign yet.</p>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}


//========================================================//
// 4. MAIN PAGE COMPONENT                                 //
//========================================================//
export default function ManageCampaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const openReportModal = (c: any) => { setSelectedCampaign(c); };
    const closeReportModal = () => { setSelectedCampaign(null); };
    const fetchCampaigns = async () => {
        setLoading(true);
        const { data, error } = await supabase.from("blood_campaigns").select("*").order("date", { ascending: false });
        if (!error && data) setCampaigns(data);
        setLoading(false);
    };

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
                if (profile) setUserRole(profile.role.toLowerCase());
            }
        };
        fetchUserRole();
        fetchCampaigns();
    }, []);

    const saveCampaign = () => {
        fetchCampaigns();
        setIsModalOpen(false);
        setEditingId(null);
    };

    const openAddModal = () => { setEditingId(null); setIsModalOpen(true); };
    const openEditModal = (c: any) => { setEditingId(c.id); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setEditingId(null); };


    const deleteCampaign = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the campaign and cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (isConfirmed) {
            const { error } = await supabase.from("blood_campaigns").delete().eq("id", id);
            if (error) {
                Swal.fire("Error", error.message, "error");
            } else {
                Swal.fire("Deleted!", "The campaign has been deleted.", "success");
                fetchCampaigns();
            }
        }
    };

    const cancelCampaign = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Are you sure?',
            text: "This will mark the campaign as 'Cancelled'.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b', // A yellow/amber color
            confirmButtonText: 'Yes, cancel it',
        });

        if (isConfirmed) {
            const { error } = await supabase
                .from('blood_campaigns')
                .update({ status: 'Cancelled' })
                .eq('id', id);

            if (error) {
                Swal.fire('Error', `Could not cancel the campaign: ${error.message}`, 'error');
            } else {
                Swal.fire('Cancelled!', 'The campaign has been marked as cancelled.', 'success');
                fetchCampaigns(); // Refresh the list to show the new status
            }
        }
    };

    const handleExportMonthlyReport = async () => {
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

    const filteredCampaigns = campaigns.filter(c => {
        const campaignDate = new Date(c.date);
        return campaignDate.getMonth() === selectedMonth && campaignDate.getFullYear() === selectedYear;
    });

    if (filteredCampaigns.length === 0) {
        Swal.fire('No Data', `No campaigns found for ${months[selectedMonth]} ${selectedYear}.`, 'info');
        return;
    }

    // --- NEW: CALCULATE STATUS COUNTS ---
    const statusCounts = {
        Completed: 0,
        Cancelled: 0,
        Upcoming: 0,
        Ongoing: 0,
    };
    filteredCampaigns.forEach(campaign => {
        const status = getCampaignStatus(campaign);
        if (statusCounts.hasOwnProperty(status)) {
            (statusCounts as any)[status]++;
        }
    });

    const campaignIds = filteredCampaigns.map(c => c.id);
    const { data: donations, error: donationError } = await supabase
        .from('blood_inventory')
        .select('campaign_id, type')
        .in('campaign_id', campaignIds);

    if (donationError) {
        Swal.fire('Error', `Failed to fetch donation data: ${donationError.message}`, 'error');
        return;
    }

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    let topCampaign = { title: 'N/A', total: 0 };
    const campaignResults = new Map();

    // --- UPDATED: Initialize with ALL campaigns for the month ---
    filteredCampaigns.forEach(c => {
        campaignResults.set(c.id, {
            title: c.title,
            total: 0,
            byType: Object.fromEntries(bloodTypes.map(bt => [bt, 0]))
        });
    });

    donations?.forEach(donation => {
        if (campaignResults.has(donation.campaign_id)) {
            const campaignData = campaignResults.get(donation.campaign_id);
            campaignData.total += 1;
            if (campaignData.byType.hasOwnProperty(donation.type)) {
                campaignData.byType[donation.type] += 1;
            }
        }
    });

    campaignResults.forEach(data => {
        if (data.total > topCampaign.total) {
            topCampaign = { title: data.title, total: data.total };
        }
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Monthly Campaign Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${months[selectedMonth]} ${selectedYear}`, pageWidth / 2, 28, { align: 'center' });
    doc.text(`Top Campaign: ${topCampaign.title} (${topCampaign.total} units collected)`, 14, 40);

    // --- UPDATED: Summary table with new status counts ---
    autoTable(doc, {
        startY: 50,
        head: [['Summary', 'Total']],
        body: [
            ['Total Campaigns', filteredCampaigns.length],
            ['Completed', statusCounts.Completed],
            ['Cancelled', statusCounts.Cancelled],
            ['Upcoming', statusCounts.Upcoming],
            ['Ongoing', statusCounts.Ongoing],
        ],
        theme: 'grid',
        headStyles: { fillColor: [209, 36, 42] }
    });

    const tableHeaders = ['Campaign', 'Total Units', ...bloodTypes];
    const tableBody = Array.from(campaignResults.values()).map(data => [
        data.title,
        data.total,
        ...bloodTypes.map(bt => data.byType[bt] || 0)
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [tableHeaders],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: [209, 36, 42] }
    });

    doc.save(`Campaign_Report_${months[selectedMonth]}_${selectedYear}.pdf`);
};

    const filteredCampaigns = campaigns.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase()) ||
        c.date.includes(search)
    );

    const editingCampaign = editingId ? campaigns.find(c => c.id === editingId) : null;
    const getCampaignStatus = (campaign: any): string => {
        if (campaign.status === "Cancelled") {
            return "Cancelled";
        }
        const today = new Date();
        const campaignDate = new Date(campaign.date);
        today.setHours(0, 0, 0, 0);
        campaignDate.setHours(0, 0, 0, 0);

        if (campaignDate < today) {
            return "Completed";
        }
        if (campaignDate.getTime() === today.getTime()) {
            return "Ongoing";
        }
        return "Upcoming";
    };

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 w-full transition-all duration-300 md:ml-72">
                <Header toggleSidebar={toggleSidebar} />
                <main className="mt-20 p-4 md:p-8">
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="w-full md:max-w-md">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg></span>
                                    <input type="text" placeholder="Search by Title, Location, or Date..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <button onClick={handleExportMonthlyReport} className="w-full md:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm transition">Export Report</button>
                                {userRole === "redcross" && <button onClick={openAddModal} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition">+ New Campaign</button>}
                            </div>
                        </div>
                    </div>
                    {loading ? <p className="text-center text-gray-500">Loading campaigns...</p> :
                        filteredCampaigns.length === 0 ? <p className="text-center text-gray-500">No campaigns found.</p> : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCampaigns.map((c) => (
                                    <div key={c.id} className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                                        <img src={c.photo_url || 'https://placehold.co/600x400/ef4444/ffffff?text=DUGO'} alt={c.title} className="w-full h-48 object-cover" />
                                        <div className="p-4 flex flex-col flex-grow">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg text-gray-800">{c.title}</h3>
                                                <StatusBadge status={getCampaignStatus(c)} />
                                            </div>
                                            <p className="text-sm text-gray-500">{c.location} • {c.date} • {c.time}</p>
                                            <p className="text-gray-600 text-sm mt-2 flex-grow">{c.description}</p>
                                            {userRole === "redcross" && (
                                                <div className="border-t mt-4 pt-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex space-x-2">
                                                            <button onClick={() => openReportModal(c)} title="View Report" className="p-1.5 text-green-600 hover:bg-green-100 rounded-md"><ReportIcon /></button>
                                                            <button onClick={() => openEditModal(c)} title="Edit Campaign" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><EditIcon /></button>
                                                            <button onClick={() => cancelCampaign(c.id)} title="Cancel Campaign" className="p-1.5 text-yellow-600 hover:bg-yellow-100 rounded-md"><XIcon /></button>
                                                            <button onClick={() => deleteCampaign(c.id)} title="Delete Campaign" className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                </main>
                {isModalOpen && <CampaignFormModal isOpen={isModalOpen} onClose={closeModal} onSave={saveCampaign} editingCampaign={editingCampaign} />}
                {selectedCampaign && <CampaignReportModal campaign={selectedCampaign} onClose={closeReportModal} />}
            </div>
        </div>
    );
}
