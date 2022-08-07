const puppeteer = require("puppeteer");
const fs = require("fs");

const hashtag = "hongkong";
const username = "dadalawdd"; //cecilee32 dadalawdd
const password = "dalaw01"; //cecil05  dalaw01
const postsAmount = 5;

const clickPost = async (page, postsAmount) => {
  let items = [];

  while (items.length < postsAmount) {
    const topPosts = await page.$$(
      "div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > article > div"
    );

    for (const topPost of topPosts) {
      let post_link = "Null";
      let author_id = "Null";
      let post_message = "Null";
      let reaction_like = "Null";
      let comment_count = "Null";
      let post_timestamp = "Null";

      try {
        post_link = await page.url();
      } catch (error) {
        console.log("post_link error");
      }

      try {
        author_id = await page.evaluate(
          (el) =>
            el.querySelector(
              "article > div > div._aa-d > div > div > div._aepp > div > header > div._aaqy._aaqz > div._aar0._ad95._aar1 > div._aaqt"
            ).textContent,
          topPost
        );
      } catch (error) {
        console.log("author Name error");
      }

      try {
        post_message = await page.evaluate(
          (el) =>
            el.querySelector(
              "div._aa-9 > ul > div > li > div > div > div._a9zr > div._a9zs > span"
            ).textContent,
          topPost
        );
      } catch (error) {
        console.log("post_message error");
      }

      try {
        reaction_like = await page.evaluate(
          (el) =>
            el.querySelector(
              "div._aaz4 > section._aa-7 > div > div > div > a > div > span"
            ).textContent,
          topPost
        );
      } catch (error) {
        console.log("reaction_like error");
      }

      try {
        comment_count = await page.evaluate(
          (el) =>
            el.querySelectorAll(
              "div._aa-d > div > div > div._aaz4 > div._aa-9 > ul > ul"
            ).length,
          topPost
        );
        // if wanna get comment need to add loop here
      } catch (error) {
        console.log("comment error");
      }

      try {
        post_timestamp = await page.evaluate(
          (el) =>
            el.querySelector(
              "div._aaz4 > div._aa-b > div > div > a > div > time"
            ).dateTime,
          topPost
        );
      } catch (error) {
        console.log("post_timestamp error");
      }

      if (items.length < postsAmount) {
        items.push({
          post_link,
          author_id,
          post_message,
          reaction_like,
          comment_count,
          post_timestamp,
        });
      }
    }

    try {
      await page.click("div._aaqg._aaqh > button", { delay: 50 });
      await page.waitFor(5000);
      console.log(`item ${items.length}`);
    } catch (error) {}
  }
  console.log(items);
  return items;
};

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.instagram.com/accounts/login", {
      waitUntil: "networkidle2",
    });
    await page.waitFor(10000);

    let cookieBtn = true;
    while (cookieBtn) {
      const button =
        "body > div.RnEpo.Yx5HN._4Yzd2 > div > div > button.aOOlW.HoLwm";
      if (
        (await page.$(
          "body > div.RnEpo.Yx5HN._4Yzd2 > div > div > button.aOOlW.HoLwm"
        )) !== null
      ) {
        await page.click(button);
        await page.waitFor(7000);
        console.log("clicked cookie button");
      } else {
        cookieBtn = false;
        await page.type("input[name=username]", username, { delay: 200 });
        await page.waitFor(2000);
        await page.type("input[name=password]", password, { delay: 200 });
        await page.click("button[type=submit]", { delay: 50 });
        await page.waitFor(15000);
      }
    }

    let saveInfo = true;
    while (saveInfo) {
      const button = "main > div > div > div > div > button";
      if ((await page.$("main > div > div > div > div > button")) !== null) {
        await page.click(button);
        console.log("clicked info not now");
        await page.waitFor(5000);
      } else {
        saveInfo = false;
        console.log("no save info not now");
      }
    }

    let notNow = true;
    while (notNow) {
      const button = "button._a9--._a9_1";
      if ((await page.$("button._a9--._a9_1")) !== null) {
        await page.click(button);
        console.log("clicked noti not now");
        await page.waitFor(5000);
      } else {
        notNow = false;
        console.log("no noti not now");
      }
    }

    await page.goto(`https://www.instagram.com/explore/tags/${hashtag}/`, {
      waitUntil: "networkidle2",
    });
    await page.waitFor(7000);
    const firstPost = await page.waitForSelector(
      "main > article > div._aaq8 > div > div > div:nth-child(1) > div:nth-child(1)"
    );
    await firstPost.click();
    const items = await clickPost(page, postsAmount);
    fs.writeFileSync(`data/${hashtag}.json`, JSON.stringify(items));
    if (items.length === postsAmount) {
      try {
        await page.click(
          "div:nth-child(4) > div > div > div.rq0escxv.l9j0dhe7.du4w35lb > div > div.o9tjht9c.jar9mtx6.mbzxb4f5.njoytozt > div > div ",
          {
            waitFor: 2000,
          }
        );
      } catch (error) {
        console.log("close tab error");
      }

      await page.click(
        "section > nav > div._acc1._acc3 > div > div > div._acuq._acur > div > div:nth-child(6) > div._aaav",
        { waitFor: 2000 }
      );
      await page.click(
        "div._aa1s > div._ad8j._aa5x._aa5y._aa5z > div._aa61 > div:nth-child(6)",
        { waitFor: 2000 }
      );
      await page.waitFor(3000);
      console.log("Finished scrapping and logged out");
      // browser.close();
    }
  } catch (error) {
    console.log(error);
  }
}

start();
