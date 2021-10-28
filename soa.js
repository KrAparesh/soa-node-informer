const dotenv = require('dotenv')
const puppeteer = require("puppeteer");
const CronJob = require('cron').CronJob
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config()

let token = process.env.TOKEN
let url = process.env.URL
client.login(token);
client.on('ready', () => {
    console.log('Ready!')
});

var titleprev = "";
var linkprev = "";
var dateprev = "";

async function configureBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle0",
  });
  return page;
}

async function CompareData(page) {
  await page.reload();
  
  let title = await page.evaluate(() => {
    let titler = document.querySelector('div[class="summary-title"]').innerText;
    return titler;
  });
  let link = await page.evaluate(() => {
    let linkr = document.querySelector('div[class="summary-title"] a').href;
    return linkr;
  });
  let date = await page.evaluate(() => {
      let dater = document.querySelector('time[class="summary-metadata-item summary-metadata-item--date"').innerText;
      return dater;
  });
  if (titleprev == "" && linkprev == "" && dateprev == "" ) {
    titleprev = title;
    linkprev = link;
    dateprev = date;
  }
  else{
      if(titleprev == title && linkprev == link && dateprev == date){
         // console.log("No update");
      }
     // else if(titleprev != title && linkprev != link)
     else{
        const exampleEmbed = new MessageEmbed()
        .setColor('#F94E7F')
        .setThumbnail('https://imgur.com/sqD3lgX.png')
        .setTitle(title)
        .setDescription(`[Click to open PDF!](`+link+`)`)
        .setFooter(date);
        client.channels.cache.get('903198340160835615').send({embeds: [exampleEmbed]});
          console.log("** UPDATE **");
          console.log(title);
          console.log(link);
          titleprev = title;
          linkprev = link;
          dateprev = date;

      }
  }
}
async function startTracking() {
    const page = await configureBrowser();
  
    let job = new CronJob("*/50 * * * * *", function() {
       // console.log("Reloading..."); //runs every 30 seconds in this config
      CompareData(page);
    }, null, true, null, null, true);
    job.start();
}
startTracking();
