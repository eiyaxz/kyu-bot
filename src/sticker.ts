import { Message, MessageMedia } from "whatsapp-web.js";
import { format } from "util";
import sharp from "sharp";

import { stretchKeyword, commands, stickerName, 
         stickerAuthor, welcomeMessage, createdStickerLog } from "../config.json";

export default async function handleMessage(message: Message) {
    message.getChat().then(async chat => {
        const messages = await chat.fetchMessages({ limit: Infinity });

        if (messages.filter(chatMessage => chatMessage.fromMe).length === 0) {
            chat.sendMessage(welcomeMessage.join("\n"));
        }
    });

    switch (message.type) {
        case "image":
        case "video":
            await createSticker(message);
            break;
        case "chat":
            await handleCommand(message, commands);
            break;
        default:
            return;
    }
}

async function createSticker(message: Message) {
    let media = await message.downloadMedia();
    
    // Check if message is view once
    if (!media) {
        await message.react("⛔");
        return;
    }

    if (message.type === "image") {
        if (stretchKeyword.some(keyword => message.body.toLowerCase().includes(keyword.toLowerCase()))) {
            const imageBuffer = Buffer.from(media.data, "base64");
            const resizedImageBuffer = await sharp(imageBuffer)
                .resize(512, 512, { fit: "fill" })
                .toBuffer();
    
            media = new MessageMedia(media.mimetype, resizedImageBuffer.toString("base64"));
        }
    }

    await message.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerName,
        stickerAuthor
    })
    .then(() => {
        message.react("✅")
        console.log(format(createdStickerLog, message.from));
    })
    .catch((error) => {
        message.react("⛔")
        console.log(error);
    });
}

interface Commands {
    [key: string]: Command;
}

interface Command {
    usage: string;
    message: string[];
}

async function handleCommand(message: Message, commands: Commands) {
    for (const command in commands) {
        const data = commands[command];

        if (message.body.toLowerCase() === data.usage.toLowerCase()) {
            await message.reply(data.message.join("\n"));
            await message.react("✅");
            return;
        }
    }

    await message.react("⛔");
}