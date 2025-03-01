const { Client, Intents, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { token, channel, logid } = require('./config.json'); // Store sensitive data in a separate config.json

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});

client.once('ready', () => {
    console.log('Connected!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'uptimerobot') {
        const link = interaction.options.getString('link');
        const logChannel = await interaction.guild.channels.fetch(logid);

        if (interaction.channel.id === channel) {
            if (link.includes('repl.co')) {
                const decodeUrl = encodeURIComponent(link);
                const decodeGlobal = encodeURIComponent(interaction.guild.name);
                const url = 'https://api.uptimerobot.com/v2/newMonitor';
                const data = `api_key=u2393216-744109edddc71502ee72d23c&format=json&type=1&url=${decodeUrl}&friendly_name=${decodeGlobal}`;
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'no-cache',
                };

                try {
                    const response = await axios.post(url, data, { headers });
                    if (response.data.stat === 'ok') {
                        const emlog = new MessageEmbed()
                            .setTitle('Uptimerobot')
                            .setDescription(`\n > ผู้ใช้บริการ: ${interaction.user.tag}\n> สถานะ: **สำเร็จ**`)
                            .setColor(0x83db18);
                        await logChannel.send({ embeds: [emlog] });

                        const successEmbed = new MessageEmbed()
                            .setTitle('✅ เพิ่มลงในระบบสำเร็จ')
                            .setDescription(`เราได้เพิ่ม[ลิงก์ของคุณ](${link})ไว้ในระบบเรียบร้อยแล้ว!`)
                            .setColor(0x83db18);
                        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
                    } else {
                        if (response.data.error.type.includes('already_exists')) {
                            const alreadyExistsEmbed = new MessageEmbed()
                                .setTitle('❌ ทำรายการไม่สำเร็จ')
                                .setDescription('เนื่องจากลิงก์ของคุณนั้นได้อยู่ในระบบเรียบร้อยแล้ว!')
                                .setColor(0xfff200);
                            await interaction.reply({ embeds: [alreadyExistsEmbed], ephemeral: true });
                        } else {
                            const invalidLinkEmbed = new MessageEmbed()
                                .setTitle('❌ ทำรายการไม่สำเร็จ')
                                .setDescription('เนื่องจากลิงก์ที่คุณระบุมาไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง!')
                                .setColor(0xff002f);
                            await interaction.reply({ embeds: [invalidLinkEmbed], ephemeral: true });
                        }
                    }
                } catch (error) {
                    console.error('Error sending request:', error);
                    const errorEmbed = new MessageEmbed()
                        .setTitle('❌ ทำรายการไม่สำเร็จ')
                        .setDescription('เกิดข้อผิดพลาดขณะส่งคำขอ กรุณาลองใหม่อีกครั้ง!')
                        .setColor(0xff002f);
                    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            } else {
                const invalidLinkEmbed = new MessageEmbed()
                    .setTitle('❌ ทำรายการไม่สำเร็จ')
                    .setDescription('กรุณาใส่ลิงก์ของ replit เท่านั้นนะครับ!')
                    .setColor(0xff002f);
                await interaction.reply({ embeds: [invalidLinkEmbed], ephemeral: true });
            }
        } else {
            await interaction.reply({
                content: '# || กรุณาใช้คำสั่งในช่องให้ถูกต้อง ||',
                ephemeral: true,
            });
        }
    }
});

client.login(token);
