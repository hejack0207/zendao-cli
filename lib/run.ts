#!/usr/bin/env node
'use strict';

import * as puppeteer from "puppeteer";
//const puppeteer = require('puppeteer');
const config = require('./config');
  
const run = async () => {

  var p = require('commander');
  p.version('1.0.0')
    .usage('cmd\n E.g. zendao-cli -u username -p password url')
    .option("-u,--user <username>","username to login")
    .option("-p,--password <password>","password to login")
    .option("-b,--buglist","show list of bugs");
  p.parse(process.argv);
  //console.log(p.user+"\n");
  //console.log(p.password+"\n");

  var prefix="http://172.16.7.167/zentao";
  const browser = await puppeteer.launch(config.puppeteer);
  const page = await browser.newPage();
  await page.setViewport(config.puppeteer.viewport);

  await page.goto(prefix+"/user-login.html");

  await page.waitForSelector("#account");
  await page.type("#account", p.user);
  await page.type("#login-form > form > table > tbody > tr:nth-child(2) > td > input", p.password);
  await page.click("#submit");

  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  var output = await page.$eval('#userMenu > a',e => e.textContent);

  if(p.buglist){
    await page.goto(prefix+"/bug-browse-1-0-assigntome-0.html");
    output = await page.$eval('#bugList > tbody', e => e.textContent);
    console.log(output);
  }
  //console.log('ouput:%j',output);

  //await page.screenshot({ path: './dev-images/xhzd.png' });
  //console.log('png saved!');

  await browser.close();
};

export async function main(argv: string[]) {
  run().catch((error) => {
      console.error('CATCH ERROR: ', error);
      process.exit(1);
  });
}

if (require.main === module) {
  main(process.argv);
}