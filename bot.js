const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express'); // -----> 1. Dependência para o servidor web

// -----> 2. Criação do servidor web para manter o bot online no Render
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('<h1>🤖 Bot está rodando!</h1>');
});

app.listen(port, () => {
  console.log(`Servidor web escutando na porta ${port}`);
});
// Fim do trecho do servidor web

const client = new Client({
    authStrategy: new LocalAuth(),
    // -----> 3. Configuração extra para o servidor (Render) funcionar corretamente
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🤖 Bot pronto!');
});

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

O entorno da região apresenta altos índices de contaminação. Toneladas de lixo e resíduos industriais se acumulam nas margens, poluindo o solo e as fontes de água. A economia local depende em grande parte da reciclagem e reaproveitamento desses materiais, o que transforma o lixo em principal meio de subsistência para a população.

Apesar da precariedade, a Zona Oeste mantém relevância geopolítica. Sua localização costeira favorece o transporte marítimo e a movimentação clandestina de mercadorias, tornando-a uma área de interesse constante tanto para o Governo Mundial quanto para organizações independentes e facções insurgentes.`;

            return await client.sendMessage(msg.from, media, { caption: legenda });

        } catch (err) {
            console.error('Erro ao enviar imagem:', err);
            return msg.reply("❌ Erro ao carregar o mapa. Verifique se o arquivo *torreruptura.jpeg* está na mesma pasta do bot.js.");
        }
    }

    // 📜 Comando /ficha
    if (texto === "/ficha") {
        const ficha = `ㅤㅤㅤㅤ                          ︩︪ ׂ   ݂  🧧 𓂃
                                     𝐅 𝐈 𝐂 𝐇 𝐀́ 𝐑 𝐈 𝐎   
      ㅤ                             𝐑𝐮𝐩𝐭𝐮𝐫𝐚 𝐙𝐞𝐫𝐨. 
                                           ⏝꒦︶

        悪魔❀ Nᴏᴍᴇ: 
        悪魔❀ 𝗜𝖽𝖺𝖉𝖊: 
        悪魔❀ Wʜᴀᴛsᴀᴘᴘ: 
        悪魔❀ Bʟᴏᴄᴏ: 

‘( 穆 )   𝐏ersonagem.
 ׄ🧧˳໋  Nᴏᴍᴇ: 
 ׄ🧧˳໋  Lɪɴʜᴀɢᴇᴍ: 
 ׄ🧧˳໋  Iᴅᴀᴅᴇ: 
 ׄ🧧˳໋  Aᴘᴀʀᴇ̂ɴᴄɪᴀ:
 ׄ🧧˳໋  Rᴀᴄ̧ᴀ:
𝑰   — 
𝑰𝑰  —🔒
 ׄ🧧˳໋  Cʟᴀssᴇ: 
𝑰   — 
𝑰𝑰  —🔒
 ׄ🧧˳໋  Aֆɪʟɪᴀᴄ̧ᴀ̃ᴏ: 
 ׄ🧧˳໋  Aʟɪɴʜᴀᴍᴇɴᴛᴏ: 
 ׄ🧧˳໋  Tɪᴘᴏ Eɴᴇ́ʀɢɪᴄᴏ: 
 ׄ🧧˳໋  Tɪᴘᴏ Sᴀɴɢᴜɪ́ɴᴇᴏ: 
 ׄ🧧˳໋  Cᴏᴍᴘʟᴇᴍᴇɴᴛᴏs: 

‘( 穆 )   𝐌onetάrio e 𝐏rogressα̃o.
 ׄ🧧˳໋  Nɪ́ᴠᴇʟ: 00
 ׄ🧧˳໋  𝐗𝐏: 00
 ׄ🧧˳໋  Cʀᴇ́ᴅɪᴛᴏs (Monetário): 00
 ׄ🧧˳໋  Cᴀʀᴛᴇɪʀᴀ: 
 ׄ🧧˳໋  Iɴᴠᴇɴᴛᴀ́ʀɪᴏ:
 ׄ🧧˳໋  Tᴀʟᴇɴᴛᴏs: 
 ׄ🧧˳໋  Hᴀʙɪʟɪᴅᴀᴅᴇs Nᴜ́ᴄʟᴇᴏs:
𝑰   — 
𝑰𝑰  —
 ׄ🧧˳໋  Tᴇ́ᴄɴɪᴄᴀs Dɪᴠᴇʀɢᴇɴᴛᴇs:
⤿ (nome da hab. núcleo.)
          ──── (todas as suas skills. Adicione mais travessão se necessário) 
⤿ (nome da hab. núcleo)
          ──── (todas as suas skills. Adicione mais travessão se necessário) 
 ׄ🧧˳໋  Pᴀssɪᴠᴀs: 
⤿ (nome da origem: classe, raça, etc)
          ──── (todas as suas passivas. Adicione mais travessão se necessário) 
⤿ (nome da origem: classe, raça, etc)
          ──── (todas as suas passivas. Adicione mais travessão se necessário) 

‘( 穆 )   𝐀tributos.
ㅤ  ׄ🧧˳໋ Fᴏʀᴄ̧ᴀ ꢁ O1
ㅤ  ׄ🧧˳໋ Rᴇssɪsᴛᴇ̂ɴᴄɪᴀ ꢁ O1
ㅤ  ׄ🧧˳໋ Aɢɪʟɪᴅᴀᴅᴇ ꢁ O1
ㅤ  ׄ🧧˳໋ Pᴇʀᴄᴇᴘᴄ̧ᴀ̃ᴏ ꢁ O1
      ׄ🧧˳໋ Dᴇsᴛʀᴇᴢᴀ ꢁ O1
      ׄ🧧˳໋ Vɪɢᴏʀ (VR) ꢁ O1
    ㅤ─ · ·─
ㅤ  ׄ🧧˳໋ Cᴏɴᴛʀᴏʟᴇ ꢁ O1      
ㅤ  ׄ🧧˳໋ Pᴏᴅᴇʀ ꢁ O1
ㅤ  ׄ🧧˳໋ Lɪʙᴇʀᴀᴄ̧ᴀ̃ᴏ ꢁ O1
ㅤ  ׄ🧧˳໋ Cᴀʀɢᴀ Dɪ̄ǫᴜɪ (CD) ꢁ O1
    ㅤ─ · ·─
ㅤ  ׄ🧧˳໋ Vᴏɴᴛᴀᴅᴇ ꢁ O1
ㅤ  ׄ🧧˳໋ Esᴘɪ́ʀɪᴛᴏ ꢁ O1
ㅤ  ׄ🧧˳໋ Eɢᴏ ꢁ O1
ㅤ  ׄ🧧˳໋ Sᴀɴɪᴅᴀᴅᴇ (SAN) ꢁ O1`;

        await msg.reply(ficha);
    }
});

client.initialize();