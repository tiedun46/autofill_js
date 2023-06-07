console.log("Đây là content!");

chrome.runtime.sendMessage({message:"Hi i'm content!"},(res)=>{
    console.log(res.message);
})