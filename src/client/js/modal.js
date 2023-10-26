const modalEle = document.querySelector('.modal');
const modalYes = modalEle.querySelector('.modal__yes');
const modalNo = modalEle.querySelector('.modal__no');

const handleClickYes = () => {
    location.href = "/login";
    modalEle.style.display = "none";
}
const handleClickNo = () => {
    modalEle.style.display = "none";
}

modalYes.addEventListener('click', handleClickYes);
modalNo.addEventListener('click', handleClickNo);