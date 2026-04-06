import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to have permissions to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, instance, data } = body;

    // Log the event for debugging
    await supabaseAdmin.from("webhook_logs").insert([{ payload: body, event_type: event }]);

    /**
     * Event: onMessage
     * Triggered when a new message is received
     */
    if (event === "onMessage") {
      const { key, message, pushName } = data;
      const jid = key.remoteJid;
      const uazapi_id = key.id;
      const fromMe = key.fromMe;
      const messageBody = message?.conversation || message?.extendedTextMessage?.text || "[Mídia/Outro]";
      const timestamp = data.messageTimestamp;

      // 1. Find or Create Contact
      // We assume each instance (channel) has its own contacts
      let { data: contact, error: contactError } = await supabaseAdmin
        .from("contacts")
        .select("id")
        .eq("jid", jid)
        .single();

      if (!contact && !contactError) {
        // Find channel_id by instance token/name (from UazAPI)
        const { data: channel } = await supabaseAdmin
          .from("channels")
          .select("id")
          .eq("name", instance) // Adjust this mapping as needed
          .single();

        if (channel) {
          const { data: newContact } = await supabaseAdmin
            .from("contacts")
            .insert([{ 
                jid, 
                name: pushName || "Novo Contato", 
                channel_id: channel.id 
            }])
            .select()
            .single();
          contact = newContact;
        }
      }

      // 2. Insert Message
      if (contact) {
        await supabaseAdmin.from("messages").insert([
          {
            uazapi_id,
            contact_id: contact.id,
            channel_id: contact.channel_id,
            body: messageBody,
            from_me: fromMe,
            status: "received",
            timestamp: timestamp,
          }
        ]);
      }
    }

    /**
     * Event: onAck
     * Triggered when a message status changes (sent, delivered, read)
     */
    if (event === "onAck") {
       const uazapi_id = data.key.id;
       const statusMap: Record<number, string> = {
          1: "sent",
          2: "delivered",
          3: "read"
       };
       const status = statusMap[data.status] || "sent";

       await supabaseAdmin
         .from("messages")
         .update({ status })
         .eq("uazapi_id", uazapi_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
