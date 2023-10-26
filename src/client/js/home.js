const videoMixinData = document.querySelectorAll(".video-mixin__data");
videoMixinData.forEach(element => {
    const ownerData = element.dataset.owner;
    const jsonData = JSON.parse(ownerData);
    const usernameTag = element.querySelector(".username");
    usernameTag.innerText = jsonData.username;
    const userImgTag = element.querySelector(".userImg");
    if(jsonData.avatarUrl){
        if(jsonData.avatarUrl.charAt(0) == "/"){
            userImgTag.src = jsonData.avatarUrl;
        }else{
            userImgTag.src = "/" + jsonData.avatarUrl;
        }
    }else{
        userImgTag.src = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png";
    }
    
});




