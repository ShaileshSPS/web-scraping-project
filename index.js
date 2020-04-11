const request = require("request-promise")
const cheerio = require("cheerio")
const fs = require("fs")
const json2csv = require("json2csv").Parser;

// Movie URL
const movies = [
    "https://www.imdb.com/title/tt0242519/",
    "https://www.imdb.com/title/tt11912196/",
    "https://www.imdb.com/title/tt12004706/"
];

// Asyncronous function exectution
(async() => {
    let immdbData = []
    
    for(let movie of movies) {
        const response = await request({
            uri : movie,
            headers : {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip : true //content-encoding
        });
    
        let $ = cheerio.load(response) // As will be using jquery scripts we need cheerio for that.
    
        let title = $('div[class="title_wrapper"] > h1').text().trim();
        let rating = $('div[class="ratingValue"] > strong > span').text();
        let releaseDate = $('a[title="See more release dates"]').text().trim();
        let description = $('div[class="summary_text"]').text().trim();
    
        immdbData.push({
            title, rating, description, releaseDate
        });
    
    }

    const j2cp = new json2csv()
    const csv = j2cp.parse(immdbData)
    
    fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();