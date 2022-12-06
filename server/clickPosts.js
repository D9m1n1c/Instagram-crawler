const puppeteer = require("puppeteer");
const fs = require("fs");

const hashtag = "cathaypacific"; //all lowercase
const username = "dadalawdd"; //cecilee32 dadalawdd
const password = "dalaw01"; //cecil05  dalaw01
const postsAmount = 150;

const clickPost = async (page, postsAmount) => {
  let items = [];

  while (items.length < postsAmount) {
    const topPosts = await page.$$(
      "div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > article > div"
    );

    for (const topPost of topPosts) {
      let post_link = null;
      let author_id = null;
      let post_message = null;
      let reaction_like = null;
      let comment_count = null;
      let post_timestamp = null;

      try {
        post_link = await page.url();
      } catch (error) {
        console.log("post_link error");
      }

      try {
        author_id = await page.evaluate(
          (el) =>
            el.querySelector(
              "article > div > div > div > div > div > div > ul > div > li > div > div > div > h2 > div > span > a"
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
              "article > div > div > div > div > div > div > ul > div > li > div > div > div > div > span"
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
              "article > div > div._ae65 > div > div > div._ae2s._ae3v._ae3w > section > div > div > div > a > div > span"
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
              "article > div > div > div > div > div > div > ul > ul"
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
              "article > div > div > div > div > div > div > div > div > a > div > time"
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
          "div > div > div > div > div > div > div > div > div.x10l6tqk.x160vmok.x1eu8d0j.x1vjfegm > div",
          {
            waitFor: 2000,
          }
        );
      } catch (error) {
        console.log("close tab error");
      }
      // icon nav
      await page.click(
        "div.x9f619.x1n2onr6.x1ja2u2z > div > div > div > div.x78zum5.xdt5ytf.x10cihs4.x1t2pt76.x1n2onr6.x1ja2u2z > div.x9f619.xnz67gz.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.x1q0g3np.xqjyukv.x1qjc9v5.x1oa3qoh.x1qughib > div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1.xeq5yr9.x1dr59a3.xixxii4.x13vifvy.x1n327nk > div > div > div > div > div.xhuyl8g.xl5mz7h",
        { waitFor: 2000 }
      );
      // logout button
      await page.click(
        "div.xhuyl8g.xl5mz7h > div > div > div.x10l6tqk.xy75b87 > div > div._aa61 > div:nth-child(5)",
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
