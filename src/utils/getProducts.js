import Wait from "../../wait.js";
import PageController from "../PageController.js";
import getElementByText from "./getElementByText.js";
import replaceTemplate from "./replaceTemplate.js";

const getProducts = async (page, current = 0, total = 0) => {
    const Products = [];


    await page.waitForSelector(".ess-table-canvas");

  // Wait for table rows
  await page.waitForSelector(".particle-table-row");

  const productTableArea = await page.waitForSelector("scroll-host-with-footer");

  await PageController.scrollToButtom(page, productTableArea);



  const Elements = await page.$$(".particle-table-row");

  const len = await page.evaluate(el => el.length, Elements);


  let dataRows = ``;

  let i = 1;
  for (let [index, item] of Object.entries(Elements)) {


    /* if(i < 47 ) {
      i++;
      continue;
    }
    
    i++; */

    let infos = await page.evaluate((el) => {
      return {
        rank: el
          .querySelector("[essfield='google_popularity_rank']")
          .textContent.trim(),

        prevRank: el
          .querySelector(`[essfield="google_popularity_rank_wow_difference"]`)
          .textContent.trim()
          .replace("arrow_upward", "+")
          .replace("arrow_downward", "-"),
        relativeDemand: el
          .querySelector(`[essfield="relative_demand_bucket"]`)
          .textContent.trim(),

        photo: el
          .querySelector(`[essfield="product_image_url"]`)
          .querySelector(`[aria-label="Product image"]`).src,

        title: el
          .querySelector(`[essfield="product_title"]`)
          .textContent.trim(),

        GTINs: Array.from(
          el.querySelector(`[essfield="gtins"]`).querySelectorAll("div")
        ).map((div) => div.textContent),

        category: el
          .querySelector(`[essfield="leaf_category"]`)
          .textContent.trim(),

        brand: el
          .querySelector(`[essfield="localized_brand_title"]`)
          .textContent.trim(),

        brandInventoryStatus: el
          .querySelector(`[essfield="brand_inventory_status"]`)
          .textContent.trim(),

        productInventoryStatus: el
          .querySelector(`[essfield="entity_inventory_status"]`)
          .textContent.trim(),

        Prices: el
          .querySelector(`[essfield="price_range"]`)
          .textContent.trim()
          .split("–")
          .map((div) => div.trim().slice(1)),
      };
    }, item);

    // skip if Product doesn't have prices range
    if(!infos.Prices[0])
      continue

    const GTINS = await item.$(`[essfield="gtins"]`);

    // get first GTINS and lcik
    const link = await GTINS.$$("div");

    /* if(link){
      await page.evaluate((el) => el.click(), link[0]);
      await Wait(6);
      const NoProductWrapper =  await item.$(`[id*="overlay"]`); //await page.evaluate((el) => el.querySelectorAll("[role*='dialog'].wrapper"), item); 

    console.log(`Product Wrapper`, NoProductWrapper);
    }

    

    await Wait(5000); */


    try {
      // if only GTINS Present
      if (link) {
        await page.evaluate((el) => el.click(), link[0]);

        const imagesList = await page.waitForSelector(`[class^="sub-images-panel"]`);

        const images = await page.evaluate(el => {

          return Array.from(el.querySelectorAll('img')).map(el => el.src)

        }, imagesList)

        infos["images"] = images ?? [];

        await page.waitForSelector(`[class^="carousel-page-container"]`);

        const popUp = await page.$(`[class^="carousel-page-container"]`);

        const showMore = await popUp.$$(`[class*="expand-link"]`);

        for (let link of showMore) {
          await link.click();
        }

        const offerTitle = await popUp.$(`[class*="offer-title"]`);

        const title2 = await page.evaluate((el) => el.textContent, offerTitle);

        const Parent = await page.$(`[class*="attribute-panel"]`);

        const description = await getElementByText(page, Parent, "Description");
        const highlights = await getElementByText(page, Parent, "Highlights");
        const Category = await getElementByText(page, Parent, "Category");

        infos["description"] = description?.content ?? "";
        infos["hightlights"] = highlights?.content ?? "";
        infos["category"] = Category?.content ?? "";

        infos["title2"] = title2;

        const closeButton = await popUp.$(
          `[class*="close-button"] div.content`
        );

        // console.log("Close Button", closeButton);
        await page.evaluate((el) => el.click(), closeButton);
      } else {
        infos["title2"] = "";
        infos["hightlights"] = "";
        infos["description"] = "";
      }
    } catch (e) {
      continue;
      const popUp = await page.$(`[class^="info-dialog"]`);
      const closeButton = await popUp.$(`[icon="close"]`);

      // console.log("Close Button", closeButton);
      await page.evaluate((el) => el.click(), closeButton);

      console.log("\n\n\n\n\n\n");
      console.log("WE HAVE AN ERROR");


      console.log("\n\n\n\n\n\n");
      continue;
    }

    infos["slag"] = infos["title"].split(" ").join("-");

    // console.log("DATA INFOS ==> ", infos);

    // let t = template;

    // console.log("data ==> ", infos);

    //process.exit(0);

    // const newRow = await replaceTemplate(template, infos);



    // dataRows += `${newRow}\n`;

    // Add All product Images multiple Images
    /* infos["images"].map((el, index) => {
      if (index > 0) {
        let imgVar = multImgsTemp
          .replace("{title}", `"${infos?.slag.replaceAll(`"`, ``)}"`)
          .replace("{src}", el)
          .replace('{pos}', index + 1);

        dataRows += `${imgVar}\n`;
      }
    })
 */
    Products.push(infos);

    // console.log("Passed .... ", i++);


    // await Wait();
    //break;
  }

  return Products;
}


export default getProducts;