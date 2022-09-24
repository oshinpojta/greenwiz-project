const cheerio = require('cheerio');
const axios = require('axios');
const pretty = require('pretty');
const fs = require('fs');
const path = require('path');
const https = require('https');

let url = "https://en.wikipedia.org/wiki/Main_Page";
//let url = "https://www.growpital.com";

(async function getImageLink(){

    
    try {
        
        let response = await axios.get(url);
        let html = response.data;
        const $ = cheerio.load(html);
        const imgTagList = $('img');
        let imgLinkArr = [];
        let set = new Set();
        for(let i=0;i<imgTagList.length;i++){
            let imgLink = imgTagList[i].attribs.src;
            set.add(imgLink);
        }
        imgLinkArr = [...set];
        //console.log(imgLinkArr);
        for(let i=0;i<imgLinkArr.length;i++){
            let r = await downloadImage(imgLinkArr[i]);
            console.log("Image Downloaded @ ", r);
        }
        
    } catch (error) {
        console.log('Get Image Link Function Error')
        console.log(error);
    }
})();

async function downloadImage(url){
    try{
        let startIndex = url.search('/');
        if(startIndex==0){
            url = `https:${url}`;
        }
        //console.log(url);
        let urlArray = url.split('/');
        let imagesDir = path.join(__dirname,'images');
        if(!fs.existsSync(imagesDir)){
            fs.mkdirSync(imagesDir);
        }
        let websiteName = urlArray.find( str => (str!='' && str!='https:'));
        //console.log(websiteName);
        let websiteDir = path.join(imagesDir,`${websiteName}`);
        if(!fs.existsSync(websiteDir)){
            fs.mkdirSync(websiteDir);
        }
        let fileName = urlArray[urlArray.length-1];
        let filepath = path.join(websiteDir,`${fileName}`);
        let downloadResponse = await axios({
            url : url,
            method : 'GET',
            responseType : 'stream'
        });
        return new Promise((resolve, reject) => {
            downloadResponse.data.pipe(fs.createWriteStream(filepath, { flags : 'w+'})).on('error', reject).once('close',() => resolve(filepath))
        }) ;
    }catch(error){
        console.log("Download Image Function Error")
        console.log(error);
    }
    
}

