# website-images-downloader
(Website Images Downloader)


[https://github.com/oshinpojta/website-images-downloader]


This project aims to create a program that can download all the images from a website and along with that, images from all the links on the website that are of the same domain. The Project has been designed to work in all conditions robustly, even if the links does’nt use full https links, but only uses ‘/’ local path type of links as well.
For this, we require some of the most popular libraries for NodeJS like Axios and Cheerio for getting HTML data and parsing it in an executable code. FS, Path and DNS modules are NodeJS’s inbuilt modules that are required to write files to directory, getting path of the directory and getting domain’s IP addresses to identify the links belongs to current domain or not.  Use of advanced javascript is extensively implemented in the code, Promises, Async-Await, creating Write-Stream and many other features.

 ![image](https://user-images.githubusercontent.com/38129950/192251691-8c71bd36-c2c0-4d1a-b18c-0d23251241fa.png)


The above code imports all the modules required for the project and declares URL and URL’s Host that is going to be used many times at later stage of the code. 
There are total of 3 Functions in the project : -
1.	GetURLsInPage( ) – Used to get all the links or URLs that are used in the website by using Cheerio to parse HTML ‘href’ link tags. And by using DNS module, the main URL’s IPv4 addresses can be matched to other links IPv4 addresses and check whether they belong to the same domain or not.
2.	GetImageLinks( ) – For every url passed into this function, it parses it using Cheerio and finds all img-tags. Then it gets its ‘src’ property to get its link and passing the array of img-links to the downloadImage Function.
3.	DownloadImage( ) – Takes in the image url and creates directory based on domain name if not exists and downloads all images to the the folder using axios to stream download and fs.createWriteStream to write response data to a file if not exists and If exists it will over-write it. That way it will always keep the files unique in a folder.


1. getURLsInPage( ) Function :-
  
![image](https://user-images.githubusercontent.com/38129950/192251763-3edb3a16-9759-45a0-b14a-46ecb40d184a.png)


![image](https://user-images.githubusercontent.com/38129950/192251803-22689911-a962-466c-a920-58c141f310a8.png)


2. getImageLink( ) Function :-

![image](https://user-images.githubusercontent.com/38129950/192251842-4a36dd2e-85e3-4c49-8e49-fc08f7757298.png)

 
3. downloadImage ( ) Function :-
 
 ![image](https://user-images.githubusercontent.com/38129950/192251869-99c423b8-9df8-4fb3-920c-9df1291b6cdd.png)


4. Final Output :-
The below images are the output to the program, in which the displayed images shows the downloaded files and the terminal output shows the links and the file-names of the currently downloading images.
  
  ![image](https://user-images.githubusercontent.com/38129950/192251895-e82a6ad7-b038-48b5-854f-24dbef9c0769.png)

![image](https://user-images.githubusercontent.com/38129950/192251909-d497caa6-ff11-4661-b515-c387ca7119e5.png)

Thank you!
EOF - END OF DOCUMENT!
