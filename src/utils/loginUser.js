import Wait from "../../wait.js";

const loginUser = async (page, userData) => {
    let recentLogout = null;
    await page.screenshot({ path: "./logs/screenshots/loginstart.jpg" });
    
    try{
        recentLogout = await page.$eval(`[data-identifier="${userData.email}"]`, el => el.textContent.trim());
    } catch (e){
        recentLogout = false;
    }

    if(recentLogout){
        await page.waitForSelector(`[data-identifier="${userData.email}"]`);
        await page.click(`[data-identifier="${userData.email}"]`);

    }

    else {
        await page.screenshot({ path: "./logs/screenshots/emailinput.jpg" });
        // if no recent logout then check for email
        await page.waitForSelector("[type='email']");
        await page.type("[type='email']", userData.email);

        await page.waitForSelector(`[id="identifierNext"] button`);
        await page.click(`[id="identifierNext"] button`);
    }

    await Wait(3)
    await page.screenshot({ path: "./logs/screenshots/password.jpg" });

    // fill password and click next
    await page.waitForSelector("[type='password']");
    await page.type("[type='password']", userData.password);
    await page.waitForSelector(`[id="passwordNext"] button`);
    await page.click(`[id="passwordNext"] button`);

    // check passkeySuggest

    await page.waitForSelector(`[id="headingText"]`);
    const passkeysuggest = await page.$eval(`[id="headingText"]`, el => el.textContent.trim());

    await page.screenshot({ path: "./logs/screenshots/afterlogin.jpg" });

    if(passkeysuggest === "Simplify your sign-in"){
        await page.waitForSelector(`button`);
        const buttons = await page.$$('button')
        buttons[1].click();
    }
}

export default loginUser;