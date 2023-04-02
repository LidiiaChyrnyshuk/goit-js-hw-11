import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34848340-3921ebdedd421f5516455587c';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
   this.perPage = 40;
  }

 async fetchPhotos() {
   const searchParams = new URLSearchParams({
     key: this.#API_KEY,
     q: this.searchQuery,
     image_type: 'photo',
     orientation: 'horizontal',
     safesearch: true,
     per_page: this.perPage,
     page: this.page,
   });

   const response = await axios.get(`${this.#BASE_URL}?${searchParams}`);
   console.log(response.data);
   return response.data;
    
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  // get query() {
  //   return this.searchQuery;
  // }

  // set query(newQuery) {
  //   this.query = newQuery;
  // }
}
