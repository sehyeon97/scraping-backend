import express from "express";
import puppeteer from "puppeteer";

const app = express();
const SEARCH_BAR = '#__left-search > form > input[type=text]';
const SEARCH_BUTTON = '#__left-search > form > button';

const SEARCH_WARRIOR_PRESETS = '상시공유 슈샤';
const SEARCH_MAGE_PRESETS = '상시공유 실린';
const SEARCH_MARTIAL_ARTIST_PRESETS = '상시공유 애니츠';
const SEARCH_GUNNER_MALE = '상시공유 헌터';
const SEARCH_GUNNER_FEMALE = '상시공유 건슬링어';
const SEARCH_ASSASSIN = '상시공유 데런';

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect('/');
});

// launch puppeteer's headless browser
async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://lostark.inven.co.kr');

    await page.click(SEARCH_BAR);
    await page.keyboard.type(SEARCH_MARTIAL_ARTIST_PRESETS);
    await page.click(SEARCH_BUTTON);
    await page.waitForNavigation();

    await page.screenshot({ path: 'screenshots/test.png' });
    browser.close();
}

run();

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));