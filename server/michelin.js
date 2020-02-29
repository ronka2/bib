const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  let experience = $('#experience-section > ul > li:nth-child(2)').text();
  experience = experience.trim();
  experience = experience.slice(38,experience.length);
  const adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section.section.section-main.restaurant-details__main > div.restaurant-details__heading.d-none.d-lg-block > ul > li:nth-child(1)').text();
  const numTel = $('body > main > div.restaurant-details > div.container > div > div.col-xl-8.col-lg-7 > section:nth-child(4) > div.row > div:nth-child(1) > div > div:nth-child(1) > div > div > span.flex-fill').text();
  return {name, experience,adresse,numTel};
};

const parseUrl = data => {
  const $ = cheerio.load(data);
  const urlBoi = [];
  $('.link').each((index,element) => {
    const oneUrl =  $(element).attr('href');
    urlBoi[index] = oneUrl;
  });
  return {urlBoi};
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



module.exports.scrapeUrl = async urlPage => {
  const response = await axios(urlPage);
  const {data, status} = response;
  if (status >= 200 && status < 300) {
    return parseUrl(data);
  }

  console.error(status);

  return null;
};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
