const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const delBtns = document.querySelectorAll(".deleteBtn");
const videoId = videoContainer.dataset.id;
const modal = document.querySelector('.modal');

const addComment = (text, id, owner, loggedInUser,userAvatar,username) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";
    newComment.dataset.id = id;
    const icon = document.createElement("img");
    if(userAvatar) {
        icon.src = "/" + userAvatar;
    }else {
        icon.src = "https://w7.pngwing.com/pngs/205/731/png-transparent-default-avatar-thumbnail.png";
    }
    
    const div = document.createElement("div");
    const div2 = document.createElement('div');
    div2.innerText = username;
    div2.className = "username";
    const span = document.createElement("span");
    span.innerText = text;
    span.className = "text";
    const div3 = document.createElement("div");
    newComment.appendChild(icon);
    newComment.appendChild(div);
    div.appendChild(div2);
    div.appendChild(span);
    if(String(owner) == String(loggedInUser)){
        div3.innerText = "❌";
        div3.className = "deleteBtn";
        newComment.appendChild(div3);
    }
    videoComments.prepend(newComment);
    const delBtn = document.querySelector('.deleteBtn');
    delBtn.addEventListener("click", handleDelBtnClick);
}

const handleSubmit = async(event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    if(text === ""){
        return;
    }
    const videoAddComment = document.querySelector(".video__add-comment");
    let login = videoAddComment.dataset.login;
    if(!login){
        modal.style.display = "block";
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({text})
    });
    
    if(response.status === 201) {
        textarea.value = "";
        const {newCommentId, commentOwner, loggedInUser,userAvatar,username} = await response.json();
        addComment(text, newCommentId, commentOwner, loggedInUser,userAvatar,username);
    }

}

const handleDelBtnClick = async(event) => {
    let comment = event.target.closest("li");
    let commentId = comment.dataset.id;
    const del = await fetch(`/api/comment/${commentId}`, {
        method: "DELETE"
    });
    if(del.status === 200){
        comment.remove();
    }
}

if(form){
    form.addEventListener("submit",handleSubmit);
}

delBtns.forEach(delBtn => {
    delBtn.addEventListener("click", handleDelBtnClick);
})
