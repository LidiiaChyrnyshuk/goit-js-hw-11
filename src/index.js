import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { PixabayAPI } from './pixabay-api';
import { createGalleryCards } from './createGalleryCards';

const searchFormEl = document.querySelector('#search-form');
const photosListEl = document.querySelector('.gallery-item');
const loadMoreBtnEl = document.querySelector('.load-more');

const DEBOUNCE_DELAY = 300;

const newPixabayAPI = new PixabayAPI;
const lightbox = new SimpleLightbox('.gallery a');

const handleSearchPhoto = async event => {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.searchQuery.value.trim().toLowerCase();
  newPixabayAPI.query = searchQuery;

  if (!searchQuery) {
    newPixabayAPI.resetPage();
    cleanRenderGalleryCards;
     Notiflix.Notify.failure('Enter a search query!');
    return
  }

  try {
    const data = await fetchPhotos(searchQuery);
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
      return
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images!`);
    
    renderGalleryCards(hits);

    if (totalHits > 40) {
      loadMoreBtnEl.classList.remove('is-hidden');
      newPixabayAPI.incrementPage();
    }
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong! Please retry');
    console.log(error);
  }
};

const handleLoadMoreBtnClick = async () => {
  newPixabayAPI.incrementPage();

  try {
    const data = await newPixabayAPI.fetchPhotos();
    const { hits, totalHits } = data;
    renderGalleryCards(hits);
    lightbox.refresh();
    

    if (totalHits < newPixabayAPI.page * newPixabayAPI.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
     } catch (error) {
    Notiflix.Notify.failure('Something went wrong! Please retry');
    console.log(error);
  }
};

function renderGalleryCards(data) {
  const markup = data.map(createGalleryCards).join('');
  photosListEl.insertAdjacentHTML('beforeend', markup);
}

function cleanRenderGalleryCards() {
  photosListEl.innerHTML = '';
}


searchFormEl.addEventListener(
  'submit',
  debounce(handleSearchPhoto, DEBOUNCE_DELAY)
);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);