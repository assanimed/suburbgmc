import fs from "node:fs/promises"
import replaceTemplate from "./utils/replaceTemplate.js";

class GmcController {
    constructor(page){
        this.page = page;
    }
    static getAllProducts (){
        return "meow"
    }
    static async dumpProducts(Products, suffix = new Date().getTime()){
        let content = ``;


        const base = await fs.readFile("./csv/base.csv", { encoding: "utf8" });
        const multImgsTemp = await fs.readFile("./csv/multipleimg.csv", { encoding: "utf8" });
        const template = await fs.readFile("./csv/template.csv", {
            encoding: "utf8",
        });

        content += `${base.trim()}\n`;
        
        for(let product of Products){
            const productString = replaceTemplate(template, product);
            content += `${productString}\n`
            let pos = 2;
            for (let img of product?.images){
                const imgString = multImgsTemp
                                    .replace("{title}", product.slag)
                                    .replace("{src}", img)
                                    .replace("{pos}",pos);
                content += `${imgString}\n`;
                pos++;

            }
            //break;
        }
        //console.log(content);
        //console.log("HELLO \n", base)

        await fs.writeFile(`./csv/out-${suffix}.csv`, content.trim());
    }
    static async dumpProductsJSON(Products){
        await fs.writeFile("./csv/productsData.json", JSON.stringify({products: Products}));
    }
}


export default GmcController;