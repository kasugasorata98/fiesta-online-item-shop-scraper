import axios, { isAxiosError } from "axios";
import * as cheerio from "cheerio";
import moment from "moment";

const scrapeWebsite = async (url: string) => {
  try {
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    const items = $(".fullwidth-headline li")
      .map((_, el) => {
        const image = $(el).find(".imgwrap a img").attr("src") || null;
        const link = $(el).find(".imgwrap a").attr("href") || null;
        const discount = $(el).find(".stoerer.perc span").text().trim() || "0%";
        const name = $(el).find(".itemtitle a").text().trim() || null;
        const price = $(el).find(".moneybox a").text().trim() || null;
        const availableUntil =
          $(el)
            .find(".itemtitle.article-events .item_downticking p")
            .eq(1)
            .attr("data-time") || null;

        return {
          image,
          discount,
          name,
          price,
          link,
          availableUntil: availableUntil ? Number(availableUntil) : null,
        };
      })
      .get();

    const chunkSize = 10;
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const embeds = chunk.map((item) => {
        const timeRemaining = moment.duration(item.availableUntil, "seconds");
        const targetTime = moment().add(timeRemaining);
        const unixTimestamp = Math.floor(targetTime.unix());
        return {
          title: item.name,
          color: 0x0099ff, // Blue color
          thumbnail: {
            url: item.image,
          },
          url: item.link,
          fields: [
            {
              name: "Slime Coin",
              value: item.price,
              inline: true,
            },
            {
              name: "Discount",
              value: item.discount,
              inline: true,
            },
            {
              name: "Time Remaining",
              value: `<t:${unixTimestamp}:R>`,
              inline: true,
            },
          ],
        };
      });

      await axios.post(
        "https://discord.com/api/webhooks/1335362289653780500/RY_j9hUhM1u2fouVomhAu2bnkqzjyie22FgKB83AFTdDCv7SYzgjGvw0cj5PUrZ78lB3",
        {
          embeds,
        }
      );
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error fetching the page:", error.response?.data);
      return;
    }
    console.error("Unhandled error", error);
  }
};

if (process.env.ENV === "NA") {
  scrapeWebsite("https://en.gamigo.com/fiesta/en/itemshop");
} else if (process.env.ENV === "EU") {
  scrapeWebsite("https://de.gamigo.com/fiestaonline/de/itemshop");
}
