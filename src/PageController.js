import Wait from "../wait.js";

class PageController {
    constructor(page){
        this.page = page;
    }
    
    static async scrollToButtom(page, target) {
        let previousHeight = await page.evaluate((el) => el.scrollHeight, target);

        while (true) {
            await page.evaluate((target, previousHeight) => target.scrollTo(0, previousHeight), target, previousHeight);
            await Wait(3);
            const newHeight = await page.evaluate((el) => el.scrollHeight, target);
            if (newHeight === previousHeight) {
                break; // Reached the end
            }
            previousHeight = newHeight;
        }
    }

    static async scrollToTop(page, target) {
        let previousHeight = await page.evaluate((el) => el.scrollHeight, target);
    
        while (true) {
            await page.evaluate((target) => target.scrollTo(0, 0), target);
            await page.waitForTimeout(3000); // Wait for 3 seconds
            const newHeight = await page.evaluate((el) => el.scrollHeight, target);
            if (newHeight === previousHeight) {
                break; // Reached the top
            }
            previousHeight = newHeight;
        }
    }
    

    static async getElementText(page, target){
        return page.evaluate(el => el.textContent, target);
    }

}


export default PageController;