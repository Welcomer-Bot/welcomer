import { create } from 'zustand';

import { GuildFormated } from '@/lib/guilds';



interface GuildState {
  currentGuild: GuildFormated | null;
  guilds: GuildFormated[];
  setCurrentGuild: (guild: GuildFormated) => void;
  setGuilds: (guilds: GuildFormated[]) => void;
}

export const useGuildStore = create<GuildState>((set) => ({
  currentGuild: null,
  guilds: [],
  setCurrentGuild: (currentGuild) => set({ currentGuild }),
  setGuilds: (guilds) => set({ guilds }),
}));