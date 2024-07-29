// import puppeteer from "puppeteer";
import puppeteer from "puppeteer-extra";
import path from "path";
// import fs from "fs";
import UserAgent from "user-agents";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import readline from "readline";

import proxyChain from "proxy-chain";
import dotenv from "dotenv"


import fs from "node:fs/promises";

import uniqueRandomArray from "unique-random-array";
import userAgents from "top-user-agents";
import Wait from "./wait.js";
import PageController from "./src/PageController.js";
import replaceTemplate from "./src/utils/replaceTemplate.js";
import getElementByText from "./src/utils/getElementByText.js";
import getProducts from "./src/utils/getProducts.js";
import GmcController from "./src/GmcController.js";
import uploadFile from "./src/utils/uploadFile.js";
import checkConnect from "./src/utils/checkConnect.js";
import loginUser from "./src/utils/loginUser.js";


dotenv.config()


// if (process.argv.length <= 2) {
//   console.log("usage: node app.js <profile>");
//   process.exit(0);
// }

puppeteer.use(StealthPlugin());

let proxiesList;





/* const getDescriptionElement = async (page, parent) => {
  let description = null;
  const descEl = await page.evaluate((el) => {
    const test = Array.from(el.children).forEach((item) => {
      let a = item.querySelector(`[class*="attribute-label"]`);

      if (a.textContent.includes("Description")) {
        description = [
          item.querySelector(`[class*="attribute-value"]`),
          item.querySelector(`[class*="attribute-value"]`).textContent,
        ];
      }

      return description;
    });

    console.log("a", description);
    console.log("a", test);
  }, parent);

  console.log("CHECK", description);

  return descEl;
}; */


  ``

const launchProcess = async ({
  profile,
  proxy,
  url,
  slug
}) => {
  const maxProducts = 70;
  const Products = [];

  const base = await fs.readFile("./csv/base.csv", { encoding: "utf8" });
  const multImgsTemp = await fs.readFile("./csv/multipleimg.csv", { encoding: "utf8" });
  const template = await fs.readFile("./csv/template.csv", {
    encoding: "utf8",
  });


  /* const content = `${base}${template}\n`;
  await fs.writeFile("./csv/out.csv", content); */

  // Launch the browser and open a new blank page
  
  let agent;
  for (let i = 0; i < 1000; i++) {
    agent = uniqueRandomArray(userAgents)();
    if (agent.includes("Mobile")) continue;
    if (agent.includes("Safari") || agent.includes("Chrome")) {
      agent = agent.replace(
        /Chrome\/(\d+\.\d+\.\d+\.\d+)/,
        "Chrome/120.0.6099.227"
      );
      break;
    }
  }
  const userDataDir = path.join(
    `./profiles/${profile}`
  );

  const uagent =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.227 Safari/537.36";


    

    const proxyUrl = await proxyChain.anonymizeProxy(
      proxy
    );
    const proxyServer = `${proxyUrl}`
    //const proxyServer = `socks5://${PROXY_SERVER_IP}:${PROXY_SERVER_PORT}`;

  
    console.log(uagent)

  const browser = await puppeteer.launch({
    timeout: 100000,
    defaultViewport: null,
    userDataDir,
    headless: false,
    args: [
      "--disable-infobars",
      `--proxy-server=${proxyServer}`,
      `--user-agent=${uagent}`,
      // "--no-startup-window",
      '--no-sandbox',
      '--disable-setuid-sandbox',
      "--start-maximized",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome",
  });
  const page = await browser.newPage();
/*   await page.authenticate({
    username: PROXY_USERNAME,
    password: PROXY_PASSWORD,
  }); */

  //await page.goto('http://whoer.net');

  //await Wait(4000);

  //RESOUCELINK
  const URI1 = process.env.LINK;
  //
  // const URI2 = "https://merchants.google.com/mc/bestsellers?a=5358499518&tab=product&tableState=ChYKDGNvdW50cnlfY29kZRABGgQyAlVTCoUBCg9yYW5rZWRfY2F0ZWdvcnkQAxpwOm57IjEiOiI2MjEiLCIyIjoiV2F0ZXIgSGVhdGVycyIsIjMiOnsiMSI6IjYwNCIsIjIiOiJIb3VzZWhvbGQgQXBwbGlhbmNlcyIsIjMiOnsiMSI6IjUzNiIsIjIiOiJIb21lICYgR2FyZGVuIn19fRIaChZnb29nbGVfcG9wdWxhcml0eV9yYW5rEAEYMg%3D%3D&+a=+5358499518&hl=en";
  await page.goto(
    url,
    {
      timeout: 100000,
    }
  );

  //console.log("wait for too long....")
  //await Wait(5000);

  // to be removed
  await page.waitForSelector(".ess-table-canvas");

  // Wait for table rows
  await page.waitForSelector(".particle-table-row");

  const productTableArea = await page.waitForSelector("scroll-host-with-footer");

  const productsPerpage = await page.$("[class^='wrap-content']");

  const txt = await page.evaluate(el =>el.textContent, productsPerpage)
  // end of Pages When currentProductsCount === totalProductsCount
  const [_,currentProductsCount, totalProductsCount] = txt.match(/\d+/g).map(Number);
  const nextPageButton = await page.$("[class^='next _nghost']");



  /**
   * RETURN ALL PRODUCTS
   */

  // await page.click(nextPageButton);
  
  const prs = await getProducts(page);
  Products.push(...prs);

  //console.log(Products);
  //await Wait(5000);

  //console.log(Products?.length);
  //console.log("CHEKCALL PRODUCRS MEOW")
  //console.log(Products);
  //await Wait(5000);

  await GmcController.dumpProducts(Products, slug);
  await browser.close();
  return {message: "finish Process"}
  // console.log("HERE THE PRODUCT LIST FOR THE FIRST PAGE");
  await Wait(5000);

  await nextPageButton.click();
  await Wait(2);
  await PageController.scrollToTop(page, productTableArea)
  await PageController.scrollToButtom(page, productTableArea)

  console.log("CLICKED");

  console.log("MOVETO THE SECOND PAGE ====>>> \n\n\n\\n");

  const prs2 = await getProducts(page);
  Products.push(...prs2);

  console.log(`Page 2 Products:`);
  console.log(prs2);
  //console.log("CHEKCALL PRODUCRS DONE")
  await GmcController.dumpProducts(Products, process.env.SUFFIX);
  console.log("DONE")
  //console.log(Products.length);

  //await Wait(5000);
  return {message: "finish Process"}
  process.exit(0);



  

  console.log("chekc infos");

  //await Wait(5000);

  console.log("Products  \n", Products);

  console.log("done");
  //await Wait(5000);

  const content = `${base}${dataRows}`;
  await fs.writeFile("./csv/out.csv", content.trim());

  await fs.writeFile("./csv/productsData.json", JSON.stringify({products: Products}));

  //await Wait(5000);

  /* 
  const gtins = await el[0].$("[essfield]:nth-child(6)");

  const allGtins = await gtins.$$("div");

  await allGtins[0].click(); */

  /* const firstTexts = await page.evaluate((el) => {
    return el.textContent;
  }, el[0]); */

  //   console.log("TEXT INSIDE first", firstTexts);

  //   console.log("LENT", el.length);

  //await Wait(5000);

  //   console.log("here => ", el?.textContent);

  /* if (el) {
    // Use page.evaluate to get the text content of the target element
    const textContent = await page.evaluate((element) => {
      return element.textContent;
    }, el);

    console.log("Text content:", textContent);
  } else {
    console.log("Target element not found");
  }
 */
  /* if (parent) {
    // Use page.evaluate to get the text content of the target element
    const childrens = await page.evaluate((element) => {
      const els = element.querySelectorAll(".particle-table-row");

      return els.length;
    }, parent);

    console.log("length:", childrens);
  } else {
    console.log("Parent element not found");
  } */

  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });

  console.log("DONE");
  //await Wait(5000);

  /* console.log("evaluate");
  const t = await page.evaluate(() => {
    console.log("I'm IN");
    const firstRown =
      document.querySelectorAll(".ess-table-canvas")[0].children[0];
    // Convert NodeList to an array and return it
    console.log(firstRown.textContent);

    return firstRown;
  }); */

  //await Wait(500);
  console.log("Close Browser");
  await browser.close();

  const elements = await page.evaluate(() => {
    const rows = document.querySelectorAll(".particle-table-row");
    // Convert NodeList to an array and return it
    return Array.from(rows);
  });

  console.log("wait");
  //await Wait(5000);

  console.log("WHAT");

  // Set screen size
  // await page.setViewport({ width: 1920, height: 1080 });

  // Type into search box
  /* try {
    await page.type(".search-box__input", "automate beyond recorder");

    // Wait and click on first result
    const searchResultSelector = ".search-box__link";
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Locate the full title with a unique string
    const textSelector = await page.waitForSelector(
      "text/Customize and automate"
    );
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);
  } catch (e) {
    console.log("BAD THING HAPPEDN BY HANDLELED");
  } */

  // Print the full title
  //   console.log('The title of this blog post is "%s".', fullTitle);

  //   await browser.close();
}

export default launchProcess;

