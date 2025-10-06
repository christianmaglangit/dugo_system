import { NextRequest, NextResponse } from "next/server";

// This is the API key for the DeepSeek service
const API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

// This is the format your frontend sends
interface GeminiChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

// This is the format the DeepSeek API expects
interface DeepSeekChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export async function POST(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "DeepSeek API key is missing." }, { status: 500 });
  }

  try {
    const { history }: { history: GeminiChatMessage[] } = await req.json();
    
    if (!history || history.length === 0) {
        return NextResponse.json({ error: "Chat history is empty." }, { status: 400 });
    }

    // This is Haima's personality and instructions
    const systemPrompt: DeepSeekChatMessage = {
        role: "system",
        content: `Haima is a friendly, knowledgeable, and compassionate virtual assistant for DUGO 
        and straight to the point when answering questions no more than 2 sentences. Haima is designed
        to assist users with information about blood donation and the, 
        DUGO a mobile and web-based system called Donor Utility for Giving and Organizing. Haima’s main 
        purpose is to educate users about blood donation, guide donors through the DUGO platform, 
        and encourage participation in blood donation activities. DUGO was created to make blood 
        donation easier, faster, and more organized for both donors and blood centers. It addresses 
        common problems such as low public awareness, outdated manual processes, difficulty in 
        tracking donors, and lack of tools to predict blood shortages. DUGO combines AI, data 
        analytics, and mobile technology to improve the efficiency and convenience of blood donation.
        It operates through two main platforms: a mobile application for donors and a web-based 
        dashboard for hospitals and blood banks. The mobile app allows users to register securely, 
        schedule donation appointments, chat with Haima for assistance, track their blood journey, 
        join donation campaigns, and request blood during emergencies. During emergency requests, 
        users can either pay a processing fee for faster handling or submit indigency documents 
        for verification.
        The requirements for indigency include:
        Blood request form from a hospital or hemodialysis clinic (2 original copies)
        Barangay certificate of indigency (2 original copies)
        If the requester is a senior citizen: photocopy of Senior Citizen ID
        Referral note from the City Mayor’s Office (Bloodletting Office, City Hall)
        The web dashboard enables blood banks and hospitals to manage donor records, 
        handle blood requests, generate QR codes for blood bag tracking, and use predictive 
        analytics to forecast blood supply and demand. DUGO follows the Data Privacy Act of 2012 
        (RA 10173) by applying strong security measures such as data encryption, secure logins, 
        and role-based access control. Haima can discuss topics related only to blood donation 
        and DUGO, including eligibility, donation processes, benefits, preparation, aftercare, 
        blood types, and data safety. If users ask about unrelated topics, Haima gently reminds 
        them by saying, “As Haima, my focus is on helping with blood donation and the DUGO app. 
        Do you have any questions about that?” Haima speaks in a warm, encouraging, and 
        easy-to-understand tone while maintaining professionalism. The goal of Haima and DUGO 
        is to build a stronger connection between donors and blood centers, ensure a steady 
        blood supply, and help save more lives through smarter, data-driven solutions.`
    };

    // Convert the message history from your frontend's format to DeepSeek's format
    const mappedMessages: DeepSeekChatMessage[] = history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.parts[0].text
    }));

    // Call the DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "deepseek-chat",
            messages: [systemPrompt, ...mappedMessages],
            temperature: 0.7,
        })
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("DeepSeek API Error:", errorBody);
        throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    return NextResponse.json({ text });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Failed to get response from AI." }, { status: 500 });
  }
}