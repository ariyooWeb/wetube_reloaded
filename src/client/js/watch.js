let time = document.querySelector("#description").dataset.time;
const createdAt = document.querySelector("#createdAt");
time = time.substr(0,10);
createdAt.innerText = "업로드 : " + time;