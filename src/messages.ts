import { Client, Message } from "whatsapp-web.js";
import { format } from "util";

import { 
    welcomeMessage, 
    stickerName, 
    stickerAuthor, 
    createdStickerLog, 
    errorStickerLog, 
    videoUnsupported 
} from "../lang.json";

export default async function handleMessageCreate(client: Client, message: Message) {
    if (message.fromMe) return;

    const chat = await message.getChat();
    const messages = await chat.fetchMessages({ fromMe: true });

    if (messages.length == 0) {
        await client.sendMessage(message.from, welcomeMessage.join("\n"));
    }

    switch (message.type) {
        case "image":
            await handleImageMessage(message);
            break;
        case "video":
            await handleVideoMessage(message);
            break;
        default:
            break;
    }
}

async function handleImageMessage(message: Message) {
    try {
        await message.react("🕙");

        const media = await message.downloadMedia();
        
        await message.reply(media, undefined, {
            sendMediaAsSticker: true,
            stickerName,
            stickerAuthor
        });
        await message.react("✅");

        console.log(format(createdStickerLog, message.from));
    } catch (error) {
        await message.react("⛔");

        console.error(format(errorStickerLog, message.from), );
    }
}

async function handleVideoMessage(message: Message) {
    await message.react("❌");
    await message.reply(videoUnsupported);
}