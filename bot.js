const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

// --- Início do Servidor Web (para o Render) ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>🤖 Bot rodando!</h1>');
});

app.listen(port, () => {
  console.log(`Servidor web escutando na porta ${port}`);
});
// --- Fim do Servidor Web ---

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    },
    // Correção para o erro de cache no Render
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🤖 Bot pronto!');
});

// Evento de mensagem corrigido para 'message_create'
client.on('message_create', async (msg) => {
    const texto = msg.body.toLowerCase();

    // 🎲 Comando genérico de dado: /1dX
    if (texto.startsWith('/1d')) {
        const lados = parseInt(texto.slice(3));
        if (!isNaN(lados) && lados > 0) {
            const resultado = Math.floor(Math.random() * lados) + 1;
            return msg.reply(`🎲 1d${lados}: ${resultado}`);
        } else {
            return msg.reply("❌ Comando inválido. Use /1dX, ex: /1d6, /1d20 ou /1d100.");
        }
    }

    // 💎 Comando de raridade (habilidades)
    if (texto === '/r') {
        const roll = Math.floor(Math.random() * 100) + 1;
        let resposta = '';

        if (roll <= 50) {
            resposta = `Processando dados... 🤖
Categoria confirmada ✅

🎊 *!Comum!* 🎊

"Não foi dessa vez. Você é um fracote, haha!"`;
        } else if (roll <= 75) {
            resposta = `Processando dados... 🤖
Categoria confirmada ✅

🎊 *!Rara!* 🎊

"Com certeza não é qualquer um... Mas sou bem melhor. Dá pra melhorar."`;
        } else if (roll <= 90) {
            resposta = `Processando dados... 🤖
Categoria confirmada ✅

🎊 *!Épica!* 🎊

"Uau. Isso é exatamente o que eu esperava de você. Você tem talento, como eu!"`;
        } else if (roll <= 95) {
            resposta = `Processando dados... 🤖
Categoria confirmada ✅

🎊 *!Única!* 🎊

"Não acredito... Você? Logo você? O universo é tão injusto!"`;
        } else {
            resposta = `Process