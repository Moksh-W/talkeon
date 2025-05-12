import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { error } from "console";
export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    console.error("NO SIGNING SECRET");
    return new Response('NO SIGNING SECRET', { status: 500 });
  }

  const headerPayload = await headers(); // ✅ await here
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_signature || !svix_timestamp) {
    console.error("Missing svix headers", { svix_id, svix_timestamp, svix_signature });
    return new Response('ERROR: MISSING SVIX HEADERS', { status: 401 });
  }

  const payload = await req.arrayBuffer();
  const body = Buffer.from(payload).toString("utf8");

  const wh = new Webhook(SIGNING_SECRET!);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }


  const eventType = evt.type;

  if (eventType === "user.created"){
    const data = evt.data;

    // Ensure values are of correct type (string)
    const clerkId = String(data.id); // Cast to string
    const name = `${String(data.first_name)} ${String(data.last_name)}`; // Concatenate and ensure both are strings
    const imageUrl = String(data.image_url); // Ensure image_url is a string

    // Insert data into the usersTable
    await db.insert(usersTable).values({
      clerkId,       // Ensure it's a string
      name,          // Ensure it's a string
      imageUrl,      // Ensure it's a string
    });
    
  }

  if (eventType === "user.deleted"){
    const data = evt.data

    if (!data.id){
        return new Response("e",{status:500})
    }
    await db.delete(usersTable).where(eq(usersTable.clerkId, data.id))
  }

  if (eventType === "user.updated"){
    const data = evt.data

    try{
    await db
        .update(usersTable)
        .set({
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url
        })
        .where(eq(usersTable.clerkId, data.id))

        return new Response("Webhook received", { status: 201 });
    }
    catch{
        throw error
    }
  }

  return new Response("Webhook received", { status: 200 });
}
