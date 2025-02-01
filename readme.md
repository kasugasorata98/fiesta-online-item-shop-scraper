# Fiesta Online Item Shop Scraper

This project scrapes the Fiesta Online item shop and publishes the data to a Discord channel using webhooks.

## Setup

1. Clone the repository:
   ```git clone <repository-url>```
   ```cd fiesta-online-item-shop```

2. Install the dependencies:
   ```npm install```

## Configuration

The project uses environment variables to determine which item shop to scrape and which Discord webhook to use. Set the `ENV` variable to either `NA` or `EU` to scrape the North American or European item shop, respectively.

## Scripts

- `publish:na`: Scrapes the North American item shop and publishes the data to the configured Discord webhook.
- `publish:eu`: Scrapes the European item shop and publishes the data to the configured Discord webhook.

Run the scripts using:
```npm run publish:na```
```npm run publish:eu```

## GitHub Actions

The project includes two GitHub Actions workflows:

- .github/workflows/publish-eu.yml: Runs daily at 8:05 AM UTC to scrape the European item shop and publish the data to Discord.
- .github/workflows/publish-na.yml: Runs daily at 5:05 PM UTC to scrape the North American item shop and publish the data to Discord.

## Code Overview

The main logic is in the index.ts file. It uses axios to fetch the item shop page, cheerio to parse the HTML, and moment to handle time calculations. The scraped data is then sent to a Discord webhook in chunks of 10 items.

### Example of an embed object sent to Discord:
```
{
   "title": "Item Name",
   "color": 0x0099ff,
   "thumbnail": {
      "url": "Item Image URL"
   },
   "url": "Item Link",
   "fields": [
      {
         "name": "Slime Coin",
         "value": "Item Price",
         "inline": true
      },
      {
         "name": "Discount",
         "value": "Item Discount",
         "inline": true
      },
      {
         "name": "Time Remaining",
         "value": "<t:UnixTimestamp:R>",
         "inline": true
      }
   ]
}
```
