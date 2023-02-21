import express from "express";
import puppeteer from "puppeteer";

const app = express();
// #tbArticle > div.articleFile > a
// #powerbbsContent > div:nth-child(5) > div:nth-child(15) > a
// #powerbbsContent > div:nth-child(6) > span > a
// #gSeriesView > div.articleFile

// 

const MY_AGENT = 'Chrome/88.0.4298.0';
const MAIN_PAGE = 'https://www.inven.co.kr/search/';
const SEARCH_BAR = '#searchword';
const SEARCH_BUTTON = 'body > header > div > div.isearch_layout > div > div > button';
const CLICK_TO_SEE_MORE = '#searchBody > div.commu-wrap > section > article > section > div.commu-body.pcMain > div > div > div.section_body > ul > li.more > a';

const SEARCH_WARRIOR_PRESETS = '상시공유 슈샤';
const SEARCH_MAGE_PRESETS = '상시공유 실린';
const SEARCH_MARTIAL_ARTIST_PRESETS = '상시공유 애니츠';
const SEARCH_GUNNER_MALE = '상시공유 헌터';
const SEARCH_GUNNER_FEMALE = '상시공유 건슬링어';
const SEARCH_ASSASSIN = '상시공유 데런';

const MARTIAL_ARTIST_PAGE = 'https://www.inven.co.kr/search/webzine/article/%EC%83%81%EC%8B%9C%EA%B3%B5%EC%9C%A0%20%EC%95%A0%EB%8B%88%EC%B8%A0/1'
const TEST = '#searchBody > div.commu-wrap > section > article > section > div.commu-body.pcMain > div > div.section_box.noboard > div.section_body > ul';
const IMAGE_BODY = '#powerbbsContent';
// #powerbbsContent > div:nth-child(5) > div:nth-child(6) > img:nth-child(1)
// #powerbbsContent > div:nth-child(24) > img

// #powerbbsContent > div:nth-child(5) > div:nth-child(6)
// #powerbbsContent > div:nth-child(5) > div:nth-child(11)

// #powerbbsContent > div:nth-child(21) > img:nth-child(1)

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/post", (req, res) => {
    console.log("Connected to React");
    res.redirect('/');
});

// launch puppeteer's headless browser
const browser = await puppeteer.launch({
    headless: false
});

async function getLinksToPosts() {
    const page = await browser.newPage();
    await page.setUserAgent(MY_AGENT);
    await page.setViewport({
        width: 1200,
        height: 800
    })

    // martial artist search result page
    await page.goto(MARTIAL_ARTIST_PAGE, {waitUntil: "load"});
    // wait for the body containing all the links to be rendered
    await page.waitForSelector(TEST);

    let urls = await page.$$eval(TEST + ' > li', links => {
        // Extract the links from the data
        links = links.map(element => element.querySelector('h1 > a').href)
        return links;
    });

    return urls;
    
    // await page.screenshot({ path: 'screenshots/test.png' });
    // browser.close();
}

function recursion(domElement) {
    if (domElement.startsWith('img')) {
        return domElement.src;
    } else if (domElement.childElementCount() == 0) {
        return null;
    }

    return recursion(domElement.nextChild())
}

async function getImagesFromLinks(links) {
    for (let link in links) {
        let newPage = await browser.newPage();
        await newPage.setUserAgent(MY_AGENT);
        await newPage.setViewport({
            width: 1200,
            height: 800
        })
        console.log(links[link]);
        // wait until there is no more than zero incoming traffic
        await newPage.goto(links[link], {waitUntil: "networkidle0"});
        


        console.log("FIRST HERE");
        await newPage.waitForSelector(IMAGE_BODY, {timeout: 0});
        console.log("SECOND HERE");
        let imageContent = document.querySelectorAll(IMAGE_BODY);
        let images = [];
        for (let content in imageContent) {
            let data = recursion(content);
            if (data != null) {
                images.push(data);
            }
        }
        
        console.log("For " + urls[link] + " printing all images:")
        console.log(images);
    }
}

const links = await getLinksToPosts();
console.log(links);
await getImagesFromLinks(links);

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));