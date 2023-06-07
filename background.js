console.log("Đây là backgound!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    console.log(message);
    sendResponse({message: "I'm background!"});
})