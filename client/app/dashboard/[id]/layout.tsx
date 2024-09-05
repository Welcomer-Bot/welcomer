import { useGuildStore } from "@/store/useGuildStore";

export default function Layout({ children }: { children: React.ReactNode }) {
    const currentGuild = useGuildStore((state) => state.currentGuild);
    
    return (
        <section>
            {children}
        </section>
    );
}