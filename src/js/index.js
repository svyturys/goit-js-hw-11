import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import GalleryApi from './gallery-api.js';


const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const galleryApi = new GalleryApi();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

// Подія на кнопку пошуку фото
async function onSearch(e) {
  e.preventDefault();

  galleryApi.query = e.target.elements.searchQuery.value;
  galleryApi.resetPage();
  clearGalleryContainer();

  if(galleryApi.query.trim() === '') {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return 
  }

 const {hits, totalHits} = await getPhotos();
 const totalPages = Math.ceil(totalHits / 40);

 if(hits.length === 0) {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  return;
} else if(totalPages <= galleryApi.page) {
  Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
  createGalleryMarkup(hits);
  return;
} else {
  createGalleryMarkup(hits);
  showLoadMoreBtn();
}
Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

// Подія на кнопку показати більше фото
async function onLoadMore() {
  galleryApi.incrementPage();
  const { hits, totalHits } = await getPhotos();
  const totalPages = Math.ceil(totalHits / 40);
  createGalleryMarkup(hits);

  if(totalPages <= galleryApi.page) {
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`);
    hideLoadMoreBtn();
  }
}

// Отримуємо фото з бекенду
function getPhotos() {
  return galleryApi
    .fetchPhotos()
    .then(({ hits, totalHits }) => ({ hits, totalHits}));
}

// Розмітка для фото на сторінці
function createGalleryMarkup(photos) {
  const markup = photos
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
      <a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b><span> ${views}
      </p>
      <p class="info-item">
        <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b> ${downloads}
      </p>
    </div>
  </div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  // Додаємо бібліотеку SimpleLightbox
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function showLoadMoreBtn() {
    refs.loadMoreBtn.classList.remove('unvisible');
}

function hideLoadMoreBtn() {
    if(refs.loadMoreBtn.classList.contains('unvisible')) {
        return;
    }
    refs.loadMoreBtn.classList.add('unvisible');
}
