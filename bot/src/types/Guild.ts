const discordWebhookUrlRegex = /^https:\/\/discord.com\/api\/webhooks\/\d+\/[\w-]+$/;

export interface Module {
    enabled: boolean;
    sendMethod: "channel" | "webhook";
    channel?: string | null;
    webhook?: {
        
    }


}