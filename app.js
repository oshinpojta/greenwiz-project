const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dns = require('dns');

//let URL = "https://en.wikipedia.org/wiki/Main_Page";
let URL = "https://www.growpital.com";
let URL_HOST = URL;

if(URL_HOST.startsWith('https://')){
    URL_HOST = URL_HOST.split('/')[2];
}else{
    URL_HOST = URL_HOST.split('/')[0];
}


(async function getURLSinPage(){
    try {
        let hostname = URL;
        //console.log(hostname.split('/'));
        if(hostname.startsWith('https://')){
            hostname = hostname.split('/')[2];
        }else{
            hostname = hostname.split('/')[0];
        }
        
        let addresses = await new Promise((resolve, reject) => {
                                    dns.resolve4(hostname, async (err, addresses)=>{
                                        if(err){
                                            console.log(err);
                                            resolve([]);
                                        }else{
                                            resolve(addresses);
                                        }
                                    })
                                });

        //console.log(addresses);
        let response = await axios.get(URL);
        //console.log(response);
        let html = response.data;
        let $ = cheerio.load(html);

        let linksList = $('a');
        let linksArr = [];
        let linkSet = new Set();
        for(let i=0;i<linksList.length;i++){
            let link = linksList[i].attribs.href;
            if(link){
                linkSet.add(link);
            }
        }
        linksArr = [URL, ...linkSet];
        console.log(linksArr);
        let downloadUrls = [];
        for(let i=0;i<linksArr.length;i++){

            let linkURL = linksArr[i];
            if(linkURL.startsWith('/')){
                linkURL = `https://${URL_HOST}${linkURL}`;
            }
            let linkHostname = linkURL;
            //console.log(linkHostname.split('/'));
            if(linkHostname.startsWith('https://')){
                linkHostname = linkHostname.split('/')[2];
            }else{
                linkHostname = linkHostname.split('/')[0];
            }
            
            let addresses2 = await new Promise((resolve, reject) => {
                                dns.resolve4(linkHostname, (err, addresses2) => {
                                    if (err) {
                                        console.log(err);
                                        resolve([]);
                                    }else{
                                        resolve(addresses2);
                                    }
                                });
                            });

            //console.log(addresses2);
            let check = false;
            for(let i=0;i<addresses2.length;i++){
                if(addresses.includes(addresses2[i])){ // if TRUE, means one of the IP Address of Domain matches the domains of this link ( to download images only from URL's domain )
                    check = true; 
                    break;
                }
            }
            if(check){
                //console.log(linkURL);
                downloadUrls.push(linkURL);
            }
        }

        for(let i=0;i<downloadUrls.length;i++){
            console.log(downloadUrls[i]);
            let response = await axios.get(downloadUrls[i]);
            let html = response.data;
            let $ = cheerio.load(html);
            let isDownloaded = await getImageLink($);
            console.log(`Downloaded Images From Link - ${downloadUrls[i]}, isDownloaded :- `, isDownloaded);
        }
        

    } catch (error) {
        console.log("Get URL Page Function ERROR");
        console.log(error);
    }

})()

async function getImageLink($){
    try {
        let imgTagList = $('img');
        let imgLinkArr = [];
        let imgSet = new Set();
        for(let i=0;i<imgTagList.length;i++){
            let imgLink = imgTagList[i].attribs.src;
            if(imgLink){
                imgSet.add(imgLink);
            }
        }
        imgLinkArr = [...imgSet];
        //console.log(imgLinkArr);
        for(let i=0;i<imgLinkArr.length;i++){
            let imglink = imgLinkArr[i];
            if(!imglink.endsWith('.jpg') || !imglink.endsWith('.png') || !imglink.endsWith('.jpeg') || !imglink.endsWith('.svg') || !imglink.endsWith('.ico') || !imglink.endsWith('.bmp') ){
                imglink = imglink.split('?')[0];
            }
            let r = await downloadImage(imglink);
            console.log("Image Downloaded @ ", r);
        }

        return new Promise((resolve, reject) => {
            resolve(true);
        })
        
    } catch (error) {
        console.log('Get Image Link Function Error')
        console.log(error);
        return new Promise((resolve, reject) => {
            resolve(false);
        })
    }
};

async function downloadImage(url){
    try{
        let startIndex = url.search('/');
        if(startIndex==0){
            url = `https:${url}`;
        }
        console.log(url);
        let urlArray = url.split('/');
        let imagesDir = path.join(__dirname,'images');
        if(!fs.existsSync(imagesDir)){
            fs.mkdirSync(imagesDir);
        }
        let hostname = URL_HOST;
        //console.log(hostname.split('/'));
        let websiteDir = path.join(imagesDir,`${hostname}`);
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
        return new Promise((resolve, reject) => {
            resolve(null);
        }) ;
    }
    
}

