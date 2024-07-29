const checkConnect = async (page, userEmail) => {
    try{
        await page.waitForSelector(".user.entry");
        const emailElement = await page.$eval(".user.entry", el => el.textContent.trim());
    
        if(emailElement === userEmail) return true;
        else return false
    } catch(e){
        return false;
    }
}

export default checkConnect;