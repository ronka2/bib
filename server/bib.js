
const fs = require('fs');
var strSim = require('string-similarity');


module.exports.get = async () =>{

    var bibList = [];
    const michelinJSON = await fs.readFileSync('./michelin.json');
    const mich = JSON.parse(michelinJSON);

    const maitreJSON = await fs.readFileSync('./maitre.json');
    const maitre = JSON.parse(maitreJSON);

    //console.log(mich);
    //console.log(maitre);
    var i = 0;
    var j = 0;


    for (restoMa of Object.values(mich)[0])
    {
        for(restoMi of Object.values(maitre)[0])
        {
            if((Object.values(mich)[0][i].numTel === null || Object.values(maitre)[0][j].numTel) && (Object.values(maitre)[0][j].name === null || Object.values(mich)[0][i].name === null))
            {
                j++;
            }
            else if(Object.values(mich)[0][i].numTel === null || Object.values(maitre)[0][j].numTel === null)
            {
                const nomSim = strSim.compareTwoStrings(Object.values(mich)[0][i].name.toLowerCase().trim(),Object.values(maitre)[0][j].name.toLowerCase().trim());
                if(nomSim > 0.95)
                {
                    bibList.push(Object.values(mich)[0][i]);
                }
                j++;
            }
            else if(Object.values(maitre)[0][j].name === null || Object.values(mich)[0][i].name === null)
            {
                const numTelSim = strSim.compareTwoStrings(Object.values(mich)[0][i].numTel.toLowerCase().trim(),Object.values(maitre)[0][j].numTel.toLowerCase().trim());
                if(nomTelSim > 0.90)
                {
                    bibList.push(Object.values(mich)[0][i]);
                }
                j++;
            }
            else {
                const nomSim = strSim.compareTwoStrings(Object.values(mich)[0][i].name.toLowerCase().trim(),Object.values(maitre)[0][j].name.toLowerCase().trim());
                const numTelSim = strSim.compareTwoStrings(Object.values(mich)[0][i].numTel.toLowerCase().trim(),Object.values(maitre)[0][j].numTel.toLowerCase().trim());
                if(nomSim > 0.82 && numTelSim > 0.75)
                {
                    bibList.push(Object.values(mich)[0][i]);
                }
                j++;
            }
        }
        i++;
        j = 0;
    }

    return bibList;
};