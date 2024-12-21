> [!WARNING]
> kyu is highly deprecated now.
> consider using [my new bot](https://github.com/eiyaxz/stickeiya) which increases performance and decreases required memory by 10x :)

# kyu ✨
a WhatsApp bot that converts images into stickers built with [wwebjs](https://github.com/pedroslopez/whatsapp-web.js).

## just... why? 🤔
the bot that i used just stopped working, so i decided to create another one. it turned out to be pretty okay, so i uploaded it to GitHub!

## features 🧐
- image, video and gif conversion to sticker
    - when authenticated, bot will read all unread messages and convert them (toggeable)
- custom commands ([how to create](#command-creating-))

## okay... how do i use it? 😯
1. first, clone the repository on your machine using `git clone https://github.com/eiyaxz/kyu-bot.git`.
2. install the project's dependencies using `npm install`.
3. customize the `./config.json` file in order to fit your needs, the keys are pretty self-explanatory.
4. run `npm run start` and link your device using the QR code that's going to appear on your terminal. [click here](https://faq.whatsapp.com/1317564962315842/?cms_platform=web) if you don't know how to link a device.
5. that's it! now you have a bot in your WhatsApp account.

## command creating 🤖
to create a command, just create a new object in the `commands` key following this pattern:

| key | type |
| --- | ---- |
| usage | string |
| message | string[] |

by following this, you should have absolutely no problems creating a new command. if you need advanced features, you'll have to code them yourself. sorry!

## may i contribute? 🤓
sure! just fork the project and open a PR and i will analyze it myself. i appreciate the help!

## anything else? 😥
no. thanks for reading!
