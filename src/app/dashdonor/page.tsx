"use client";

import { useState, FC, ReactNode, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { supabase } from "@/lib/supabaseClient";
import Swal from "sweetalert2";

//========================================================//
// 1. TYPE DEFINITIONS
//========================================================//
interface User {
  name: string;
  bloodType: string;
  profileImage: string;
  user_id: string; 
}

interface BloodBag {
  blood_bag_id: string;
  type: string;
  component: string;
  name: string; 
  date_received: string;
}

// Gemini Chat Message Type
interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}


//========================================================//
// 2. ICONS
//========================================================//
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-6.05a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const MegaphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.358 1.84 18.668 1.5 19 1.5v12c-.332 0-.642-.34-.832-.844C16.457 9.236 12.932 7 8.832 7H7a4.001 4.001 0 00-1.564 6.683z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0L2.47 11.47a.75.75 0 101.06 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CalendarIconSvg = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const CalendarIconNav = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HashtagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.434 6H17a1 1 0 110 2h-2.566l-.66 2.641h2.432a1 1 0 110 2H13.24l-.56 2.243a1 1 0 11-1.94-.486L11.174 14H8.234l-.56 2.243a1 1 0 11-1.94-.486L6.17 14H3a1 1 0 110-2h2.566l.66-2.641H3.799a1 1 0 110-2H6.24l.56-2.243a1 1 0 011.213-.727zM10.5 8h-2.94l-.66 2.641h2.94l.66-2.641z" clipRule="evenodd" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" /><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 0h6v2H6V5zm6 4H6v2h6V9zm-6 4h6v2H6v-2z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const InfoIcon: FC<{ className?: string }> = ({ className = "" }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-gray-400 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BellSlashedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l-2.25 2.25M12 21a8.25 8.25 0 006.26-14.829l-1.178-1.178a8.25 8.25 0 00-13.183 9.435L3 18.75h1.5a8.25 8.25 0 007.5 2.25z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

//========================================================//
// 3. REUSABLE UI COMPONENTS
//========================================================//
const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white border border-gray-200/80 rounded-2xl shadow-sm ${className}`}>
        {children}
    </div>
);

const InputField: FC<{ label: string, name: string, children: ReactNode }> = ({ label, name, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor={name}>{label}</label>
        {children}
    </div>
);

//========================================================//
// 4. PAGE-SPECIFIC COMPONENTS
//========================================================//

const Header = ({ user, onOpenRequest }: { user: User, onOpenRequest: () => void }) => {
    const router = useRouter();
    return (
        <Card className="p-4 mt-4 mb-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-red-600">DUGO</h1>
                    <p className="text-xs text-gray-500">Donor Utility for Giving and Organizing</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4"> {/* Adjusted gap */}
                    
                    {/* ADD THIS NOTIFICATION BELL */}
                    <NotificationBell user={user} />
                    
                    <button
                        onClick={onOpenRequest}
                        className="text-sm font-semibold bg-red-600 text-white px-4 py-2 rounded-full shadow-sm hover:bg-red-700 transition"
                    >
                        + Request Blood
                    </button>
                    <button onClick={() => router.push('/dashdonor/donor_profile')} className="rounded-full hidden md:block">
                        <Image
                            src={user.profileImage}
                            width={44}
                            height={44}
                            alt="Profile"
                            className="rounded-full border-2 border-white shadow"
                        />
                    </button>
                </div>
            </div>
        </Card>
    );
};

const DonationStatusCard = ({ user, daysLeft, onOpenAppointmentModal }: { user: User, daysLeft: number, onOpenAppointmentModal: () => void }) => {
    const progress = Math.max(0, ((84 - daysLeft) / 84) * 100);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.user_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
    };

    return (
        <div className="md:col-span-1 bg-red-600 text-white rounded-3xl p-6 shadow-lg shadow-red-500/30 flex flex-col justify-between">
            <div className="text-center">
                <p className="text-red-200">Welcome back,</p>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <div 
                    className="mt-1 inline-flex items-center gap-2 px-3 py-1 bg-white/20 text-white rounded-full font-mono text-sm cursor-pointer hover:bg-white/30 transition"
                    onClick={handleCopy}
                >
                    <span>{user.user_id}</span>
                    <span className="w-4">{copied ? <CheckIcon/> : <ClipboardIcon />}</span>
                </div>
            </div>
            
            <div className="border-t border-white/30 my-4"></div>

            <div className="text-center">
                <p className="text-red-200">Next Donation in</p>
                <div className="w-28 h-28 mx-auto my-2 relative">
                    <CircularProgressbar
                        value={progress}
                        styles={buildStyles({ pathColor: `white`, trailColor: 'rgba(255, 255, 255, 0.3)', strokeLinecap: 'round' })}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold">{daysLeft}</span>
                        <span className="text-sm -mt-1">days</span>
                    </div>
                </div>
            </div>
            <button
                onClick={onOpenAppointmentModal}
                className="w-full mt-2 text-center py-3 bg-white text-red-600 font-bold rounded-xl shadow-md hover:bg-red-50 transition"
            >
                {daysLeft > 0 ? `Eligible in ${daysLeft} days` : 'Book Appointment'}
            </button>
        </div>
    );
};

const UpcomingAppointmentCard = ({ appointment }: { appointment: any | null }) => {
    if (!appointment) {
        return (
             <Card className="p-5 flex items-center gap-4 bg-gray-50">
                <div className="p-3 bg-gray-200 rounded-lg text-gray-500"><CalendarIconSvg /></div>
                <div>
                    <p className="font-bold text-gray-700">No Upcoming Appointments</p>
                    <p className="text-sm text-gray-500">Book one to see it here.</p>
                </div>
            </Card>
        );
    }
    
    return (
        <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600"><CalendarIconSvg /></div>
            <div>
                <p className="text-gray-500 text-sm">Upcoming Appointment</p>
                <p className="font-bold text-gray-800">{new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-600">{appointment.time} at {appointment.location}</p>
            </div>
        </Card>
    );
};


const YourImpact = ({ livesSaved, bloodType, lastDonation, appointment }: { livesSaved: number, bloodType: string, lastDonation: string | null, appointment: any | null }) => (
    <div className="md:col-span-2 grid grid-cols-2 gap-6">
        <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600"><HeartIcon /></div>
            <div><p className="text-gray-500 text-sm">Lives Saved</p><p className="font-bold text-xl text-gray-800">{livesSaved}</p></div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg></div>
            <div><p className="text-gray-500 text-sm">Blood Type</p><p className="font-bold text-xl text-gray-800">{bloodType}</p></div>
        </Card>
        <Card className="p-5 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600"><CalendarIconSvg /></div>
            <div>
                <p className="text-gray-500 text-sm">Last Donated</p>
                <p className="font-bold text-lg text-gray-800">{lastDonation ? new Date(lastDonation).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</p>
            </div>
        </Card>
        <UpcomingAppointmentCard appointment={appointment} />
    </div>
);

const BloodJourneyTracker = ({ donation }: { donation: any | null }) => {
    const currentStage = donation?.blood_journey?.[0]?.stage || 0;
    const stages = ["Red Cross", "Testing", "Inventory", "Hospital", "Transfused"];
    
    return (
        <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Track My Recent Blood Journey</h3>
            {donation ? (
                <div className="relative pt-8">
                    <div className="absolute top-8 left-0 w-full h-2 bg-gray-200 rounded-full">
                        <div 
                            className="absolute top-0 left-0 h-2 bg-red-600 rounded-full transition-all duration-500" 
                            style={{ width: currentStage > 1 ? `${((currentStage - 1) / (stages.length - 1)) * 100}%` : '0%' }}
                        ></div>
                    </div>
                    <div className="relative flex justify-between">
                        {stages.map((stage, index) => {
                            const stageNumber = index + 1;
                            const isCompleted = stageNumber <= currentStage;
                            return (
                                <div key={stage} className="flex flex-col items-center w-1/5">
                                    <div className={`w-5 h-5 rounded-full border-4 border-white shadow-md transition-colors ${isCompleted ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                                    <p className={`mt-2 text-center text-xs sm:text-sm font-semibold ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                        {stage}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center py-4">No recent donation to track.</p>
            )}
        </Card>
    );
};


const DonationHistory = ({ donation }: { donation: any | null }) => {
    const router = useRouter();
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Recent Donation</h3>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><HistoryIcon /></div>
            </div>
            {donation ? (
                <div>
                    <p className="font-semibold text-lg text-red-700">{donation.name || "Iligan City Blood Bank"}</p>
                    <p className="text-sm text-gray-500 mt-1">Your most recent contribution.</p>
                    <div className="border-t my-4"></div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><CalendarIconSvg /> <span>{new Date(donation.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></p>
                        <p className="flex items-center gap-2"><HashtagIcon /> <span>Donation ID: #{donation.blood_bag_id}</span></p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">No donation history found.</p>
            )}
            <button onClick={() => router.push('/dashdonor/donor_history')} className="w-full mt-6 px-4 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition font-semibold">View All History</button>
        </Card>
    );
};

const CampaignCard = ({ campaign }: { campaign: any | null }) => {
    const router = useRouter();
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Upcoming Campaign</h3>
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><MegaphoneIcon /></div>
            </div>
            {campaign ? (
                <div>
                    {campaign.photo_url && (
                        <Image
                            src={campaign.photo_url}
                            alt={campaign.title}
                            width={400}
                            height={200}
                            className="rounded-lg object-cover w-full h-full mb-4"
                        />
                    )}
                    <p className="font-semibold text-lg text-red-700">{campaign.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
                    <div className="border-t my-4"></div>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><CalendarIconSvg /> <span>{new Date(campaign.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} | {campaign.time}</span></p>
                        <p className="flex items-center gap-2"><LocationMarkerIcon /> <span>{campaign.location}</span></p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">No upcoming campaigns scheduled.</p>
            )}
            <button onClick={() => router.push('/dashdonor/donor_campaign')} className="w-full mt-6 px-4 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition font-semibold">View All Campaigns</button>
        </Card>
    );
};

const BottomNav = ({ onOpenAppointmentModal }: { onOpenAppointmentModal: () => void }) => {
    const router = useRouter();
    const pathname = usePathname();
    const navItems = [
        { icon: <HomeIcon />, label: "Home", path: '/dashdonor' },
        { icon: <ListIcon />, label: "History", path: '/dashdonor/donor_history' },
        { icon: <CalendarIconNav />, label: "Appointment", primary: true },
        { icon: <MegaphoneIcon />, label: "Campaigns", path: '/dashdonor/donor_campaign' },
        { icon: <UserIcon />, label: "Profile", path: '/dashdonor/donor_profile' },
    ];
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center border-t border-gray-200 h-16">
            {navItems.map((item) => {
                const isActive = pathname === item.path;
                if (item.primary) {
                return ( <button key={item.label} onClick={onOpenAppointmentModal} className="text-white -mt-8" title="Book Appointment"><div className="w-16 h-16 bg-red-600 rounded-full flex flex-col items-center justify-center shadow-lg hover:bg-red-700 transition">{item.icon}<span className="text-xs font-medium mt-0.5">Book</span></div></button> );
                }
                return ( <button key={item.label} onClick={() => router.push(item.path as string)} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full ${isActive ? 'text-red-600' : 'text-gray-400'}`}>{item.icon}<span className="text-xs font-medium">{item.label}</span></button> );
            })}
        </nav>
    );
};

// ========================================================//
// ✅ CHATBOT COMPONENT (CORRECTED)
// ========================================================//
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    // The history now starts empty.
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(scrollToBottom, [history, isThinking]);

    // This useEffect that added the initial message has been REMOVED.

    const handleSend = async () => {
        if (!inputValue.trim() || isThinking) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: inputValue }] };
        // On the first send, newHistory will correctly start with the user's message.
        const newHistory = [...history, userMessage];
        
        setHistory(newHistory);
        setInputValue('');
        setIsThinking(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: newHistory }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                throw new Error("Failed to get a response from the server.");
            }

            const data = await response.json();
            if (data.error) {
                 throw new Error(data.error);
            }

            const botMessage: ChatMessage = { role: 'model', parts: [{ text: data.text }] };

            setHistory(prev => [...prev, botMessage]);

        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting right now. Please try again later." }] };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-35 sm:bottom-24 right-4 sm:right-6 w-80 h-[28rem] bg-white rounded-2xl shadow-xl flex flex-col z-50 transition-all duration-300 ${isOpen? 'opacity-100 translate-y-0': 'opacity-0 translate-y-4 pointer-events-none'}`}>                <div className="bg-red-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
                    <h3 className="font-bold text-lg">Chat with Haima</h3>
                    <button onClick={() => setIsOpen(false)} className="text-2xl leading-none">&times;</button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {/* START: Static Welcome Message */}
                    <div className="flex justify-start">
                        <p className="max-w-[85%] py-2 px-3 rounded-2xl text-sm bg-gray-200 text-gray-800 rounded-bl-none">
                            Hello! I am Haima, your assistant. How can I help you with your blood donation questions today?
                        </p>
                    </div>
                    {/* END: Static Welcome Message */}

                    {/* This now only maps the actual conversation */}
                    {history.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'model' ? 'justify-start' : 'justify-end'}`}>
                            <p className={`max-w-[85%] py-2 px-3 rounded-2xl text-sm ${msg.role === 'model' ? 'bg-gray-200 text-gray-800 rounded-bl-none' : 'bg-red-600 text-white rounded-br-none'}`}>
                                {msg.parts[0].text}
                            </p>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                             <p className="max-w-[85%] py-2 px-3 rounded-2xl text-sm bg-gray-200 text-gray-800 rounded-bl-none">
                                Haima is thinking...
                            </p>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-2 border-t flex gap-2">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." className="flex-1 border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm" onKeyDown={(e) => e.key === 'Enter' && handleSend()} disabled={isThinking} />
                    <button onClick={handleSend} className="bg-red-600 text-white px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400" disabled={isThinking}>Send</button>
                </div>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)} className="fixed bottom-20 md:bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2 font-semibold hover:bg-red-700 transition-transform hover:scale-105 z-50">
                <ChatIcon />
                <span className="hidden md:inline">Ask Haima</span>
            </button>
        </>
    );
};

//========================================================//
// 5. Notification COMPONENTS
//========================================================//

// ADD THIS NEW COMPONENT
// REPLACE the old NotificationBell with this final version

const NotificationBell = ({ user }: { user: User | null }) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [authUserId, setAuthUserId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const setupNotifications = async () => {
            // Find the user's real UUID to listen for notifications
            const { data: profile } = await supabase.from('users').select('id').eq('user_id', user.user_id).single();
            if (!profile) return;
            
            setAuthUserId(profile.id);

            // Fetch initial notifications
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching notifications:", error);
            } else {
                setNotifications(data || []);
                setUnreadCount(data.filter(n => !n.is_read).length);
            }
        };

        setupNotifications();
    }, [user]);

    // This effect sets up the real-time listener
    useEffect(() => {
        if (!authUserId) return;

        const channel = supabase.channel(`notifications:${authUserId}`)
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications', 
                filter: `user_id=eq.${authUserId}` 
            }, 
            (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setUnreadCount(prev => prev + 1);
                Swal.fire({
                    title: 'New Notification!',
                    text: payload.new.message,
                    icon: 'info',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [authUserId]);

    const markAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0 || !authUserId) return;

        const { error } = await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds);
        
        if (error) {
            console.error("Error marking notifications as read:", error);
        } else {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };

    return (
        <>
            {/* This is the bell icon button */}
            <div className="relative">
                <button onClick={() => setIsModalOpen(true)} className="relative text-gray-600 hover:text-red-600 transition p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                        </span>
                    )}
                </button>
            </div>
            
            {/* This renders the modal when isModalOpen is true */}
            <NotificationModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                notifications={notifications}
                markAsRead={markAsRead}
            />
        </>
    );
};

//========================================================//
// 6. MODAL COMPONENTS
//========================================================//

function AddRequestForm({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (payload: any) => void; }) {
    // 1. I-add ang state para sa Indigency selection
    const [isIndigency, setIsIndigency] = useState<boolean>(false);

    const [form, setForm] = useState({
        hospital_name: user.name,
        blood_type: "", 
        blood_component: "", 
        units: 1,
        request_form_file: null as File | null, 
        indigency_file: null as File | null,
        senior_id_file: null as File | null, 
        referral_note_file: null as File | null,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 2. I-check ang required fields base sa Indigency selection
        let requiredFieldsMissing = false;
        if (!user.user_id || !form.hospital_name || !form.blood_type || !form.blood_component || !form.request_form_file) {
             requiredFieldsMissing = true;
        }

        if (requiredFieldsMissing) {
            Swal.fire("Error", "Please fill all main required fields (Blood Type, Component, Units, and Request Form).", "error"); 
            return;
        }

        // I-handle ang required files for indigency request
        if (isIndigency && (!form.indigency_file || !form.referral_note_file)) {
            Swal.fire("Error", "For Indigency requests, the Indigency Certificate and Referral Note are required.", "error");
            return;
        }


        try {
            const uploadFile = async (file: File | null) => {
                if(!file) return null;
                // Note: Ang 'public' folder sa Supabase storage kay kasagaran mao na ang default path
                const filePath = `public/${Date.now()}_${file.name}`;
                const { error } = await supabase.storage.from("blood_requests").upload(filePath, file);
                if (error) throw error;
                return supabase.storage.from("blood_requests").getPublicUrl(filePath).data.publicUrl;
            }

            // Dili na kinahanglan mag-upload sa indigency files kung dili indigency ang request
            const [requestFormUrl, indigencyUrl, seniorIdUrl, referralNoteUrl] = await Promise.all([
                uploadFile(form.request_form_file),
                // Conditional upload: upload lang kung Indigency
                isIndigency ? uploadFile(form.indigency_file) : Promise.resolve(null),
                isIndigency ? uploadFile(form.senior_id_file) : Promise.resolve(null),
                isIndigency ? uploadFile(form.referral_note_file) : Promise.resolve(null),
            ]);

            const payload = { 
                ...form, 
                user_id: user.user_id, 
                request_form_file: requestFormUrl, 
                indigency_file: indigencyUrl, 
                senior_id_file: seniorIdUrl, 
                referral_note_file: referralNoteUrl 
            };
            onSave(payload);
        } catch (err: any) {
            Swal.fire("Upload Error", err.message, "error");
        }
    };
    
    // Function para i-reset ang optional files if mag-change ang selection
    const handleIndigencyChange = (value: string) => {
        const isIndigencyRequest = value === 'Yes';
        setIsIndigency(isIndigencyRequest);

        // I-reset ang optional file states kung dili na Indigency
        if (!isIndigencyRequest) {
            setForm(prev => ({ 
                ...prev, 
                indigency_file: null, 
                senior_id_file: null, 
                referral_note_file: null 
            }));
        }
    }

    return (
       <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
                <form onSubmit={handleSubmit} className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                    <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon /></button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">New Blood Request</h2>
                    <div className="space-y-4">
                        <InputField label="Requester Name" name="hospital_name">
                            <input type="text" value={form.hospital_name} readOnly disabled className="bg-gray-200 border border-gray-300 px-3 h-11 rounded-lg w-full cursor-not-allowed"/>
                        </InputField>
                        
                        {/* 3. Dropdown para sa Indigency Selection */}
                        <InputField label="Request Type" name="request_type">
                             <select 
                                onChange={(e) => handleIndigencyChange(e.target.value)} 
                                required 
                                className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                 <option value="">Select Request Type...</option>
                                 <option value="No">Standard Request</option>
                                 <option value="Yes">Indigency / Low-Income Request</option>
                             </select>
                         </InputField>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Blood Type" name="blood_type">
                                <select required value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <option value="">Select...</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                                </select>
                            </InputField>
                            <InputField label="Units" name="units">
                                <input type="number" min={1} value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                            </InputField>
                        </div>
                        
                        <InputField label="Component" name="blood_component">
                            <select required value={form.blood_component} onChange={(e) => setForm({ ...form, blood_component: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                <option value="">Select...</option><option value="Whole Blood">Whole Blood</option><option value="Plasma">Plasma</option><option value="Platelets">Platelets</option>
                            </select>
                        </InputField>
                        
                        <InputField label="Request Form (Required)" name="request_form_file">
                            <input 
                                type="file" 
                                required 
                                accept=".jpg,.jpeg,.png,.pdf" 
                                onChange={(e) => setForm({ ...form, request_form_file: e.target.files?.[0] || null })} 
                                className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </InputField>
                        
                        {/* 4. Conditional Rendering para sa Indigency Files */}
                        {isIndigency && (
                            <div className="border-t pt-4 space-y-4">
                                <label className="font-semibold text-gray-700">Indigency Document Uploads (All Required)</label>
                                <InputField label="Indigency Certificate (Required)" name="indigency_file">
                                    <input type="file" required={isIndigency} accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, indigency_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                </InputField>
                                <InputField label="Senior Citizen ID (Optional, if applicable)" name="senior_id_file">
                                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, senior_id_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                </InputField>
                                <InputField label="Referral Note (Required)" name="referral_note_file">
                                    <input type="file" required={isIndigency} accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, referral_note_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                                </InputField>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">Add Request</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
function AppointmentModal({ isOpen, user, onClose, onSave }: { isOpen: boolean; user: User; onClose: () => void; onSave: (payload: any) => void; }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!user || !date) {
            Swal.fire("Error", "Please select a date for your appointment.", "error");
            return;
        }
        setSaving(true);
        await onSave({
            user_id: user.user_id,
            donor_name: user.name,
            date,
            time: time || null,
            location: location || null,
            notes: notes || null,
        });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                <form onSubmit={handleSubmit} className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                    <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon /></button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Book an Appointment</h2>
                    <div className="space-y-4">
                        <InputField label="Your Name" name="donorName">
                           <input type="text" value={user.name} readOnly disabled className="bg-gray-200 border border-gray-300 px-3 h-11 rounded-lg w-full cursor-not-allowed"/>
                        </InputField>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputField label="Date" name="date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                            <InputField label="Time (Optional)" name="time"><input type="time" value={time ?? ""} onChange={(e) => setTime(e.target.value)} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                        </div>
                        <InputField label="Location (Optional)" name="location"><input value={location ?? ""} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Red Cross Iligan" className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" /></InputField>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Notes (Optional)</label>
                            <textarea name="notes" value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests or information..." className="bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">{saving ? "Booking..." : "Book Appointment"}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

const BloodSearch = () => {
    const [selectedBloodType, setSelectedBloodType] = useState("");
    const [searchResults, setSearchResults] = useState<BloodBag[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleSearch = async () => {
        if (!selectedBloodType) {
            Swal.fire("Info", "Please select a blood type to search.", "info");
            return;
        }
        setIsSearching(true);
        setSearchPerformed(true);
        setSearchResults([]);

        try {
            const { data, error } = await supabase
                .from('blood_inventory')
                .select('blood_bag_id, type, component, name, date_received')
                .eq('type', selectedBloodType)
                .in('status', ['In Inventory', 'Active']); 

            if (error) throw error;
            
            setSearchResults(data || []);

        } catch (error: any) {
            Swal.fire("Error", `Failed to fetch blood inventory: ${error.message}`, "error");
        } finally {
            setIsSearching(false);
        }
    };
    
    return (
        <Card className="p-6 min-h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Find Available Blood</h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <select 
                    value={selectedBloodType} 
                    onChange={(e) => setSelectedBloodType(e.target.value)}
                    className="w-full flex-grow px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="">-- Select Blood Type --</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
                <button 
                    onClick={handleSearch}
                    disabled={isSearching || !selectedBloodType}
                    className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SearchIcon />
                    <span>{isSearching ? "Searching..." : "Search"}</span>
                </button>
            </div>

            {/* --- RESULTS AREA --- */}
            <div className="space-y-4">
                {isSearching ? (
                    <p className="text-center text-gray-500 py-8">Searching for available blood...</p>
                ) : !searchPerformed ? (
                    <div className="text-center py-12 text-gray-500">
                        <InfoIcon className="mx-auto"/>
                        <p className="mt-4 font-semibold">Select a blood type to begin your search.</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    searchResults.map((bag) => (
                        <Card key={bag.blood_bag_id} className="p-5 border border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div>
                                    <p className="font-bold text-lg text-red-700">Blood Bag ID: #{bag.blood_bag_id}</p>
                                    <p className="text-sm text-gray-600 font-semibold">{bag.name || 'Unknown Location'}</p>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-md font-bold text-gray-800">{bag.type} - {bag.component}</p>
                                    <p className="text-xs text-gray-500">
                                        Received on {new Date(bag.date_received).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <InfoIcon className="mx-auto"/>
                        <p className="mt-4 font-semibold">No available '{selectedBloodType}' blood found.</p>
                        <p className="text-sm">Please try another blood type or check back later.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

function NotificationModal({ isOpen, onClose, notifications, markAsRead }: { isOpen: boolean; onClose: () => void; notifications: any[]; markAsRead: () => void; }) {
    
    useEffect(() => {
        // Mark messages as read when the modal is opened
        if (isOpen) {
            markAsRead();
        }
    }, [isOpen, markAsRead]);

    if (!isOpen) return null;

    const notificationStyles: Record<string, { icon: ReactNode, color: string }> = {
        success: { icon: <CheckCircleIcon />, color: 'green' },
        error: { icon: <XCircleIcon />, color: 'red' },
        info: { icon: <XCircleIcon />, color: 'blue' },
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-5 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"><XIcon /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(n => {
                            const style = notificationStyles[n.type] || notificationStyles.info;
                            return (
                                <div key={n.id} className={`relative flex gap-4 p-5 border-b border-gray-100 ${!n.is_read ? 'bg-red-50/50' : 'bg-white'}`}>
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${style.color}-500`}></div>
                                    <div className={`mt-1 text-${style.color}-500 flex-shrink-0`}>
                                        {style.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(n.created_at).toLocaleString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 px-6 text-gray-500">
                            <BellSlashedIcon />
                            <p className="mt-4 font-semibold">No Notifications Yet</p>
                            <p className="text-sm">Messages from the Red Cross will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

//========================================================//
// 7. MAIN PAGE COMPONENT
//========================================================//
export default function ResponsiveDonorDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [donationStats, setDonationStats] = useState({ livesSaved: 0, lastDonation: null as string | null, daysLeft: 84 });
    const [latestAppointment, setLatestAppointment] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [recentDonation, setRecentDonation] = useState<any | null>(null);
    const [upcomingCampaign, setUpcomingCampaign] = useState<any | null>(null);
    const router = useRouter();

    const fetchData = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
            router.replace("/");
            return;
        }

        const { data: profile, error } = await supabase
            .from('users')
            .select('name, blood_type, profile_image_url, user_id')
            .eq('id', authUser.id)
            .single();

        if (error || !profile) {
            console.error("Error fetching profile or profile not found", error);
            router.replace("/");
            return;
        }

        if(!user) {
             setUser({
                name: profile.name,
                bloodType: profile.blood_type,
                profileImage: profile.profile_image_url || '/images/user.png',
                user_id: profile.user_id,
            });
        }
        
        const [
            { data: donations, count },
            { data: appointment },
            { data: campaign }
        ] = await Promise.all([
            supabase.from('blood_inventory').select('*, blood_journey(stage)', { count: 'exact' }).eq('user_id', profile.user_id).order('date_received', { ascending: false }),
            supabase.from('appointments').select('*').eq('user_id', profile.user_id).eq('status', 'Pending').order('date', { ascending: true }).limit(1).single(),
            supabase.from('blood_campaigns').select('*').gte('date', new Date().toISOString()).order('created_at', { ascending: false }).limit(1).single()
        ]);

        if (donations && donations.length > 0) {
            const lastDonationDate = new Date(donations[0].date_received);
            const today = new Date();
            const timeDiff = today.getTime() - lastDonationDate.getTime();
            const daysSinceLast = Math.floor(timeDiff / (1000 * 3600 * 24));
            const daysLeft = Math.max(0, 84 - daysSinceLast);
            
            setDonationStats({
                livesSaved: (count || 0) * 3,
                lastDonation: donations[0].date_received,
                daysLeft: daysLeft,
            });
            setRecentDonation(donations[0]);
        } else {
            setDonationStats({ livesSaved: 0, lastDonation: null, daysLeft: 0 });
            setRecentDonation(null);
        }
        
        setLatestAppointment(appointment);
        setUpcomingCampaign(campaign);
        
        setLoading(false);
    };

    useEffect(() => {
        fetchData();

        const channel = supabase.channel('realtime-dashboard')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_journey' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchData())
          .subscribe()

        return () => {
            supabase.removeChannel(channel);
        }
    }, [router]);

    const addRequest = async (payload: any) => { 
        if (!user) { 
            Swal.fire("Error", "You must be logged in to make a request.", "error"); 
            return; 
        }

        try {
            const { error } = await supabase.from("blood_requests").insert([{ 
                ...payload, 
                user_id: user.user_id, 
                status: "Pending", 
                requested_at: new Date().toISOString() 
            }]);
            if (error) throw error;
            Swal.fire("Success", "Your blood request has been submitted successfully!", "success");
            setIsRequestModalOpen(false);
        } catch (err: any) {
            Swal.fire("Submission Error", err.message, "error");
        }
    };

    const saveAppointment = async (payload: any) => {
        if (!user) {
            Swal.fire("Error", "You must be logged in to book an appointment.", "error");
            return;
        }
        try {
            const { error } = await supabase.from("appointments").insert([
                { ...payload, status: "Pending" }
            ]);
            if (error) throw error;
            Swal.fire({ icon: "success", title: "Booked!", text: "Your appointment has been successfully booked.", timer: 2000, showConfirmButton: false });
            setIsAppointmentModalOpen(false);
        } catch (err: any) {
             Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to book appointment." });
        }
    };
    
    const handleOpenAppointmentModal = () => {
      if (donationStats.daysLeft > 0) {
        Swal.fire({
          icon: 'info',
          title: 'Not Yet Eligible',
          text: `You can book your next appointment in ${donationStats.daysLeft} days.`,
          confirmButtonColor: '#DC2626',
        });
      } else {
        setIsAppointmentModalOpen(true);
      }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-extrabold text-red-600">DUGO</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <Header user={user} onOpenRequest={() => setIsRequestModalOpen(true)} />
                
                <main className="pb-24 md:pb-8">
                
                    {/* --- MOBILE LAYOUT --- */}
                    <div className="md:hidden flex flex-col gap-8">
                        <DonationStatusCard user={user} daysLeft={donationStats.daysLeft} onOpenAppointmentModal={handleOpenAppointmentModal} />
                        <BloodJourneyTracker donation={recentDonation} />
                        <BloodSearch />
                        <YourImpact livesSaved={donationStats.livesSaved} bloodType={user.bloodType} lastDonation={donationStats.lastDonation} appointment={latestAppointment} />
                        <DonationHistory donation={recentDonation} />
                        <CampaignCard campaign={upcomingCampaign} />
                    </div>

                    {/* --- DESKTOP LAYOUT --- */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <DonationStatusCard user={user} daysLeft={donationStats.daysLeft} onOpenAppointmentModal={handleOpenAppointmentModal} />
                            <YourImpact livesSaved={donationStats.livesSaved} bloodType={user.bloodType} lastDonation={donationStats.lastDonation} appointment={latestAppointment} />
                        </div>
                        <div className="mt-8">
                           <BloodJourneyTracker donation={recentDonation} />
                        </div>
                        <div className="mt-8">
                           <BloodSearch />
                        </div>
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            <DonationHistory donation={recentDonation} />
                            <CampaignCard campaign={upcomingCampaign} />
                        </div>
                    </div>

                </main>
            </div>
            
            <BottomNav onOpenAppointmentModal={handleOpenAppointmentModal} />
            {isRequestModalOpen && <AddRequestForm user={user} onClose={() => setIsRequestModalOpen(false)} onSave={addRequest} />}
            {isAppointmentModalOpen && user && <AppointmentModal isOpen={isAppointmentModalOpen} user={user} onClose={() => setIsAppointmentModalOpen(false)} onSave={saveAppointment} />}
            <Chatbot />
        </div>
    );
}