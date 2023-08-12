

let sectioncontent = document.querySelector('.section-content');
let icon_popup = document.getElementById('icon_popup');
let popup = document.querySelector('.popup');
let popupContent = document.querySelector('.popup span');
let main_elzecr=document.querySelector('.elzecr')
let elzecr_icon=document.querySelector('.elzecr i')


elzecr_icon.addEventListener('click',function(){
  main_elzecr.classList.add('active')
})


let api = 'https://api.alquran.cloud/v1/meta';
fetch(api)
  .then(response => response.json())
  .then(data => getdata(data));

function getdata(data) {
  let data_api = data.data.surahs.references;

  let data_loop = data_api.map(ele => {
    return `
      <div class="card card-7">
        <h2>${ele.name}</h2>
        <p>Elbakara</p>
      </div>
    `;
  }).join("");
  sectioncontent.innerHTML = data_loop;

  let cards = document.querySelectorAll('.card');

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      let apiSurah = `https://api.alquran.cloud/v1/surah/${index + 1}`;
      fetch(apiSurah)
        .then(res => res.json())
        .then(data => {
          let ayahs = data.data.ayahs;
          popupContent.innerHTML = '';
          ayahs.forEach(ayah => {
            let ayahText = document.createElement('span');
            ayahText.textContent = ayah.text;
            popupContent.appendChild(ayahText);
          });
          popup.classList.add('active');
        });
    });
  });

  icon_popup.addEventListener('click', function () {
    popup.classList.remove('active');
  });
}