const videotag = document.querySelector('#video');
const preview = document.querySelector('.preview');

const handleChangeVideo = () => {
    let url = window.URL.createObjectURL(videotag.files[0]);
    preview.src = url;
}

videotag.addEventListener('change',handleChangeVideo);
