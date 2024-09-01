import { APIGuild } from "discord-api-types/v10";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Guild extends Pick<APIGuild, "id" | "name" | "icon" | "owner" | "permissions"> {
  mutual?: boolean;
}