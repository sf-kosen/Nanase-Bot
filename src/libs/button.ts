import { ButtonBuilder, ButtonStyle } from "discord.js";
import type { ButtonCommand } from "../types/command";

type Props = {
	label: string;
	customId: ButtonCommand;
	style?: ButtonStyle;
};

const createButton = (props: Props) => {
	return new ButtonBuilder()
		.setLabel(props.label)
		.setCustomId(JSON.stringify(props.customId))
		.setStyle(props.style ?? ButtonStyle.Primary);
};

export { createButton };
