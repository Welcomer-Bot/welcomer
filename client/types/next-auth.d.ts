
import "next-auth";
import { DiscordProfile } from "next-auth/providers/discord";

declare module "next-auth" {
    export interface Session {
        user: User,
        profile: DiscordProfile,
        guilds: string[]
    }
    
    export interface Secrets {
		accessToken: string;
		refreshToken: string;
		tokenType: string;
		expires_at?: number;
	}

    interface User {
		id?: string;
		username?: string | null;
		image_url?: string | null;
    }
}