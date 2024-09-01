export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Welcomer, the best discord bot to welcome new members",
  description:
    "Welcome new members to your server with Welcomer, the most customizable welcome bot.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/clementvt/welcomer",
    docs: "https://imperiator.gitbook.io/welcomer-bot/",
    discord: "https://discord.gg/7TGc5ZZ7aM",
  },
};
