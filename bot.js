// import library
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

// instance client
const client = new Client();

// Menampilkan pesan "Mohon tunggu QR code sedang di generate..." pada saat menjalankan program
console.log('Mohon tunggu QR code sedang di generate...');


client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    // Menampilkan pesan "Bot GPT Terhubung ke Whatsappmu...!" saat bot berhasil terhubung
    console.log('Bot GPT Terhubung ke Whatsappmu...!');
});

client.initialize();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('message', message => {
    console.log(message.body);

    // Menampilkan pesan yang diterima dari pengguna di console
    if(message.body.startsWith("#")) {
        runCompletion(message.body.substring(1)).then(result => message.reply(result));
    }
});

async function runCompletion (message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 200,
    });
    // Mengembalikan teks hasil generasi balasan dari OpenAI GPT-3 model
    return completion.data.choices[0].text; 
}

