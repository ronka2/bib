/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre');
const fs = require('fs');
const  bib = require('./bib');

var links = [];
var obj = {
  table : []
};
var json;

async function url_scrap(searchLink,callback)
{
  try{
    for(let i = 1; i < 16;i++)
    {
      console.log(`browsing ${searchLink + i} source`);
      const restaurantLink = await callback(searchLink + i.toString());
      links = links.concat(restaurantLink.urlBoi);

    }
  }
  catch(e){
    console.error(e);
    process.exit(1);
  }
}



async function sandbox (searchLink,callback) {
  try {

    const restaurant = await callback(searchLink);
    obj.table.push(restaurant);

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const writeJson = async (obj, title) =>{
  json = JSON.stringify(obj);
  fs.writeFile(title,json,(err => {
    if(err) throw err;
    console.log("file saved");
  }));
};

var maitreUrls = [];

const main = async() =>{
  await url_scrap('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/',michelin.scrapeUrl);
  const start = async () => {
    await asyncForEach(links, async (item) =>{
      await sandbox('https://guide.michelin.com/' + item,michelin.scrapeRestaurant);
    });
    await writeJson(obj,'michelin.json');
  };
  await start();

  //maitre.GetAllUrls prend beaucoup de temps a s'executer ~20min
  await maitre.getAllUrls(maitreUrls,154);
  await asyncForEach(maitreUrls, async (item) =>{
    await sandbox(item,maitre.scrapeRestaurant);
  });

  await writeJson(obj,'maitre.json');

  const boi = await bib.get();
  await writeJson(boi,'../bib-app/src/bib.json');
  console.log(boi);
};

main();
