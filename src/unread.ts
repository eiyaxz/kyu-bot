import { Client } from "whatsapp-web.js";
import handleMessage from "./sticker";

export default async function handleUnread(client: Client) {
    client.getChats().then(chats => {
        chats.forEach(chat => {
            if (chat.unreadCount > 0) {
                chat.fetchMessages({ limit: chat.unreadCount }).then(messages => {
                    messages.forEach(message => {
                        handleMessage(message);
                    });
                });
            }
        });
    });
}