"use server"
import {registerSpanish} from "@/app/actions/registerCourse"
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request){
    const authResult = await auth(); // Await the auth() call to resolve the Auth object
    const userId = authResult.userId; // Access the userId directly

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const action = await registerSpanish(userId);

    if (action === 0){
        return (new Response("User already resgistered!", {status: 400}))
    }
    else if (action == -1){
        return (new Response("Something went wrong, try again or later.", {status: 500}))
    }
    else{
        return (new Response("User succesfully resgistered!", {status: 200}))
    }
}