const dotenv = require('dotenv')
const puppeteer = require("puppeteer");
const CronJob = require('cron').CronJob
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
//require('dotenv').config()

client.login("OTAzMjc1MTY4MDkxMjM4NDIx.YXqmjg.AmNLCEShtb40iVoXFZmoDqVlowI");
client.on('ready', () => {
    console.log('Ready!');
    client.user.setPresence({ activities: [{ name: `ITER's Website`, type: `WATCHING`  }], status: 'idle'});
});

url = "https://www.soa.ac.in/iter";

var titleprev = "";
var linkprev = "";
var dateprev = "";
var examtitleprev = "";
var examlinkprev = "";
var examdateprev = "";

async function configureBrowser() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox']
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
  let examtitle = await page.evaluate(() => {
    let examtitler = document.getElementsByTagName("A")[15].innerText;
    return examtitler;
  });
  let examlink = await page.evaluate(() => {
    let examlinker = document.getElementsByTagName("A")[15].href;
    return examlinker;
  });
  let examdate = await page.evaluate(() => {
    let examdater = document.getElementsByTagName("TIME")[23].innerText;
    return examdater;
  })

  if (titleprev == "" && linkprev == "" && dateprev == "") {
    titleprev = title;
    linkprev = link;
    dateprev = date;

  }
  else{
      if(titleprev == title && linkprev == link && dateprev == date){
          console.log("No update on student notice.");
      }
     // else if(titleprev != title && linkprev != link)
     else{
        const exampleEmbed = new MessageEmbed()
        .setColor('#F94E7F')
        .setThumbnail('https://imgur.com/sqD3lgX.png')
        .setTitle(title)
        .setDescription(`[Click to open PDF!](`+link+`)`)
        .setFooter(date);
        client.channels.cache.get('928657709493022730').send({embeds: [exampleEmbed]});
          console.log("** UPDATE **");
          console.log(title);
          console.log(link);
          titleprev = title;
          linkprev = link;
          dateprev = date;

      }
  }
  if(examtitleprev == "" && examlinkprev == "" && examdateprev == ""){
    examtitleprev = examtitle;
    examlinkprev = examlink;
    examdateprev = examdate;
  }
  else{
    if(examtitleprev == examtitle && examlinkprev == examlink && examdateprev == examdate){
      console.log("No update on exam notice.")
    }
    else{
      const exampleEmbed = new MessageEmbed()
      .setColor('#F94E7F')
      .setThumbnail('https://imgur.com/sqD3lgX.png')
      .setTitle(examtitle)
      .setDescription(`[Click to open PDF!](`+examlink+`)`)
      .setFooter(examdate);
      client.channels.cache.get('928657709493022730').send({embeds: [exampleEmbed]});
        console.log("** UPDATE **");
        console.log(examtitle);
        console.log(examlink);
        examtitleprev = examtitle;
        examlinkprev = examlink;
        examdateprev = examdate;
    }
  }
}
async function startTracking() {
    const page = await configureBrowser();
  
    let job = new CronJob("*/50 * * * * *", function() {
        console.log("Reloading..."); //runs every 30 seconds in this config
      CompareData(page);
    }, null, true, null, null, true);
    job.start();
}
startTracking();
