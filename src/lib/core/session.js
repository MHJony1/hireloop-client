// import { auth } from "../auth";
// import { headers } from "next/headers";

// export const getUserSession = async () => {
//     const session = await auth.api.getSession({
//         headers: await headers() // some endpoints might require headers
//     })

//     return session?.user || null;
// }





// lib/core/session.js
import { auth } from "../auth";
import { headers } from "next/headers";

export const getUserSession = async () => {
    try {
        const headersList = await headers();
        const session = await auth.api.getSession({
            headers: headersList
        });
        
        // নিশ্চিত করুন session.user খালি না
        if (!session || !session.user) {
            console.log('No active session found');
            return null;
        }
        
        return session.user;
    } catch (error) {
        console.error('Error getting user session:', error);
        return null;
    }
};