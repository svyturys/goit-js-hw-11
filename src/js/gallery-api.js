import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '36228377-bf14151824182249707120aad';

export default class GalleryApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

 async fetchPhotos() {
try {
const { data } = await axios({params: {
    key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
  }})
  return data;
} catch (error) {
  console.log(error);
}}

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
