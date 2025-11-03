const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');

console.log('[LOG] Script iniciado...');

// --- Início do Servidor Web (para o Render) ---
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>🤖 Bot rodando!</h1>');
});

app.listen(port, () => {
  console.log(`[LOG] Servidor web escutando na porta ${port}`);
});
// --- Fim do Servidor Web ---

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
    },
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
});

console.log("[LOG] Objeto 'client' do WhatsApp criado.");

// ######################################################################
// AQUI ESTÁ A MUDANÇA: Usamos .once() para rodar UMA ÚNICA VEZ
// ######################################################################
client.once('qr', (qr) => {
  console.log('[LOG] Evento QR recebido. Gerando link de imagem UMA ÚNICA VEZ...');
  qrcode.toDataURL(qr, (err, url) => {
    if(err) throw err;
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('!!!     O LINK PARA A IMAGEM DO QR CODE ESTÁ ABAIXO     !!!');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(url);
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('!!! COPIE O LINK ACIMA E COLE NO SEU NAVEGADOR !!!');
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  });
});
// --- Fim da Geração do QR Code ---

client.on('ready', () => {
    console.log('🤖 Bot pronto! Conectado e ouvindo mensagens.');
});


// ######################################################################
// Teste dos listeners SEPARADOS
// ######################################################################

// Listener NOVO ('message_create') - Com toda a sua lógica
client.on('message_create', async (msg) => {
    console.log(`[LOG ESPIÃO 'message_create'] Mensagem recebida: ${msg.body}`);
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
            resposta = `Processando dados... 🤖
Erro registrado ❗

"Uma anomalia. Um despertado sem habilidade... Que inconveniente. Sinto pena."`;
        }

        return msg.reply(resposta);
    }

    // 🩸 Comando de tipo sanguíneo
    if (texto === '/sangue') {
        const tiposComuns = [
            "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
        ];

        const roll = Math.random() * 100;
        if (roll <= 99.5) {
            const tipo = tiposComuns[Math.floor(Math.random() * tiposComuns.length)];
            return msg.reply(`🧬 Analisando amostra de sangue...  
Resultado confirmado ✅  

🩸 *Tipo sanguíneo:* ${tipo}`);
        } else {
            return msg.reply(`🧬 Analisando amostra de sangue...  
❗ Anomalia detectada ❗  

💉 *Fenótipo Rh nulo:* ausência total de antígenos Rh.  
Um sangue tão raro que quase não deveria existir...`);
        }
    }

    // 🗺️ Comando de mapa (Zona Oeste)
    if (texto === '/mapa') {
        try {
            const media = MessageMedia.fromFilePath('./torreruptura.jpeg');
            const legenda = `📍 *Zona Oeste — Nível de Exposição: BAIXO* ⚠️

A Zona Oeste é uma região litorânea predominantemente ocupada por Humanos descendentes de Despertados e por indivíduos que foram transferidos para o Mundo Alternativo após os conhecidos *"Eventos de Anomalia"*. 

Sua fundação ocorreu sob condições extremamente adversas, exigindo sacrifício e resistência por parte de seus habitantes originais. Em múltiplas ocasiões, o *Governo Mundial* tentou eliminar a colônia, considerando-a uma ameaça à estabilidade política e territorial. Entretanto, após anos de conflito, o governo reconheceu que a manutenção da região poderia gerar benefícios estratégicos, econômicos e sociais — optando, assim, por permitir sua existência sob forte vigilância militar.

Atualmente, a Zona Oeste é um território marcado pela desigualdade e pela degradação ambiental. Os Humanos que vivem na área são frequentemente vítimas de opressão militar, submetidos a políticas de controle e exploração. Essa condição tem gerado revoltas e manifestações periódicas, geralmente reprimidas com violência.

O entorno da região apresenta altos índices de contaminaço. Toneladas de lixo e resíduos industriais se acumulam nas margens, poluindo o solo e as fontes de água. A economia local depende em grande parte da reciclagem e reaproveitamento desses materiais, o que transforma o lixo em principal meio de subsistência para a população.

Apesar da precariedade, a Zona Oeste mantém relevância geopolítica. Sua localização costeira favorece o transporte marítimo e a movimentação clandestina de mercadorias, tornando-a uma área de interesse constante tanto para o Governo Mundial quanto para organizações independentes e facções insurgentes.`;
            
            return await client.sendMessage(msg.from, media, { caption: legenda });

        } catch (err) {
            console.error('[ERRO NO /MAPA]', err); // Log de erro melhorado
            return msg.reply("❌ Erro ao carregar o mapa. Verifique se o arquivo *torreruptura.jpeg* está na mesma pasta do bot.js.");
        }
    }

    // 📜 Comando /ficha
    if (texto === "/ficha") {
        const ficha = `ㅤㅤㅤㅤ   
... (o resto do seu texto da ficha) ...
ㅤ  ׄ🧧˳໋ Sᴀɴɪᴅᴀᴅᴇ (SAN) ꢁ O1`;

        await msg.reply(ficha);
    }
});

// Listener ANTIGO ('message') - Apenas com um log
client.on('message', async (msg) => {
    console.log(`[LOG ESPIÃO 'message'] Mensagem recebida: ${msg.body}`);
});


console.log("[LOG] Iniciando cliente... (client.initialize())");
client.initialize();