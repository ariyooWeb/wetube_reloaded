const inputTag = document.querySelector('#avatar');
const preview = document.querySelector('#avatarPreview');

const handleChangeImg = () => {
    let url = window.URL.createObjectURL(inputTag.files[0]);
    preview.setAttribute("src",url)
}

inputTag.addEventListener('change',handleChangeImg);