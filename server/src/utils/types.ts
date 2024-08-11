    
export type Guild = {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
    channels: Channel[];
    roles: Role[];
    members: Member[];
};

export type Channel = {
    id: string;
    name: string;
    type: number;
    permissions: string;
};

export type Role = {
    id: string;
    name: string;
    permissions: string;
};

export type Member = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    roles: string[];
    permissions: string;
};