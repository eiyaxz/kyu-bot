import { Client, Message } from "whatsapp-web.js";

const WELCOME_MESSAGE = `
    Olá! Eu sou o Kyu, um bot pra te fazer figurinhas! 😊

    - Para fazer uma figurinha, basta me enviar uma imagem! 🖼️

    Feito com carinho por @zuukynn! ❤️
`.trim().replace(/ {2,}/g, "");

export default async function handleMessageCreate(client: Client, message: Message) {
    if (message.fromMe) return;

    const chat = await message.getChat();
    const messages = await chat.fetchMessages({ fromMe: true });

    if (messages.length == 0) {
        await client.sendMessage(message.from, WELCOME_MESSAGE);
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
            stickerName: "Figurinha feita por",
            stickerAuthor: "@zuukynn/kyu-bot"
        });
        await message.react("✅");

        console.log(`[INFO] ${message.from} criou uma figurinha!`);
    } catch (error) {
        await message.react("⛔");

        console.error(`[INFO] ${message.from} obteve um erro!`, error);
    }
}

async function handleVideoMessage(message: Message) {
    await message.react("❌");
    await message.reply("Desculpe, mas eu não consigo fazer figurinhas de vídeos! 😔");
}