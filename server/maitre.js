const axios = require('axios');
const cheerio = require('cheerio');


/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
    const $ = cheerio.load(data);
    const name = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5 > span:nth-child(1) > strong').text();
    let adresse = $('#adresse_pro_1_map_tooltip > p > a').text().trim();
    adresse = adresse.replace(/\n/g,'');
    adresse = adresse.replace(/\s\s+/g, ' ');
    let numTel = $('#module_ep > div.ep-container.container > div > div > div.ep-content-left.col-md-8 > div > div.ep-section.ep-section-parcours.row > div > div > div.section-item-right.text.flex-5').text().trim().replace(/\n/g,'');
    if(numTel !== null)
    {
        numTel = numTel.match("\\s?(\\+\\d+(\\s|-))?0\\d(\\s|-)?(\\d{2}(\\s|-)?){4}");
        if(numTel !== null)
        {
            numTel = numTel[0];
        }
    }
    else{
        numTel = "Non renseigné par l'établissement";
    }
    return {name,adresse,numTel};
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurant = async url => {
    const response = await axios(url);
    const {data, status} = response;

    if (status >= 200 && status < 300) {
        return parse(data);
    }

    console.error(status);

    return null;
};

module.exports.getAllUrls = async (links, nbPages) => {
    let postRequests = [];
    for (let i = 1; i <= nbPages; i++) {
        postRequests.push({
            method: 'post',
            url: 'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult#',
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: `page=${i}&sort=undefined&request_id=ec830a0fb20e71279f65cd4fad4cb137&annuaire_mode=standard`
        })
    }
    let size = 50;
    let arrayOfArrays = [];
    for (let i = 0; i < postRequests.length; i += size) {
        arrayOfArrays.push(postRequests.slice(i, i + size));
    }
    for (array of arrayOfArrays) {
        await Promise.all(array.map(async request => {
            const response = await axios(request);
            const { data, status } = response;

            if (status >= 200 && status < 300) {
                const $ = cheerio.load(data);
                $('.single_libel a').each((index, value) => {
                    let link = $(value).attr('href');
                    links.push(`https://www.maitresrestaurateurs.fr${link}`);
                });
            }
            else console.error(status);
        }));

    }
}