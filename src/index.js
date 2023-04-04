import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

import { PixabayAPI } from './pixabay-api';
import { createGalleryCards } from './createGalleryCards';

const searchFormEl = document.querySelector('#search-form');
const photosListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const newPixabayAPI = new PixabayAPI();
let lightbox = new SimpleLightbox('.gallery a');

const handleSearchPhoto = async event => {
  event.preventDefault();

  newPixabayAPI.resetPage();

  cleanRenderGalleryCards();

  const searchQuery = event.currentTarget.elements['searchQuery'].value
    .trim()
    .toLowerCase();
  newPixabayAPI.query = searchQuery;

  if (!searchQuery) {
    searchFormEl.reset();
    cleanRenderGalleryCards();
    loadMoreBtnEl.classList.add('is-hidden');
    Notiflix.Notify.failure('Enter a search query!');
    return;
  }

  try {
    const {
      hits: images,
      totalHits: totalQuantity,
      total: quantity,
    } = await newPixabayAPI.fetchPhotos();

    if (quantity === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalQuantity} images!`);

    renderGalleryCards(images);

    if (totalQuantity > newPixabayAPI.page * newPixabayAPI.perPage) {
      loadMoreBtnEl.classList.remove('is-hidden');
      lightbox.refresh();
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong! Please retry');
    console.log(error);
  }
};

const handleLoadMoreBtnClick = async () => {
  newPixabayAPI.incrementPage();

  try {
    const {
      hits: images,
      totalHits: totalQuantity,
      total: quantity,
    } = await newPixabayAPI.fetchPhotos();

    if (totalQuantity < newPixabayAPI.page * newPixabayAPI.perPage) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    renderGalleryCards(images);

    autoScrollPage();

    lightbox.refresh();
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

function autoScrollPage() {
  const { height: cardHeight } =
    photosListEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 3,
    behavior: 'smooth',
  });
}

searchFormEl.addEventListener('submit', handleSearchPhoto);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);
