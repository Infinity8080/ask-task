"use server"
import { db } from "@/db/db";
import { messages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";

type Props = {
    
    content:string
    role: string
}

export async function saveMessage({content,role}:Props) {
     const session = await auth.api.getSession({ headers: await headers() });  
     if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
        await db.insert(messages).values({
            userId: session.user.id,
            role,
            content,
           
          });
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
 
}

export async function getMessagesByUserId(userId: string) {
  try {
    const response =  await db.query.messages.findMany({
        where:eq(messages.userId, userId),
        orderBy:desc(messages.createdAt),
        
    });
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

