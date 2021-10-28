const dotenv = require('dotenv')
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config()
var Title = "Revised Notice regarding classes of B.Tech. 1st Semester"
var link = "https://www.soa.ac.in/iter-student-notice/2021/9/10/notice-for-7th-semester-classes-pjk5r-4xla8-wdpld"
let token = process.env.TOKEN
let url = process.env.URL

client.login(token);
client.on('ready', () => {
    console.log('Ready!')
    sendtext();
});
function sendtext(){
const exampleEmbed = new MessageEmbed()
.setColor('#F94E7F')
    .setThumbnail('https://imgur.com/sqD3lgX.png')
    .setTitle(Title)
    .setDescription(`[Click to open PDF!](`+link+`)`)
    .setFooter('Oct 26, 2021');
    client.channels.cache.get('903198340160835615').send({embeds: [exampleEmbed]});
}