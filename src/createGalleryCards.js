export function createGalleryCards({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads }) {
  return  `<div class="photo-card">
                <a href="${largeImageURL}">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery-img img" />
                </a>
                
                <div class="info">
                  <p class="info-item">
                    <b>Likes<span class="description_info">${likes}</span></b>
                  </p>
                  <p class="info-item">
                    <b>Views<span class="description_info">${views}</span></b>
                  </p>
                  <p class="info-item">
                    <b>Comments<span class="description_info">${comments}</span></b>
                  </p>
                  <p class="info-item">
                    <b>Downloads<span class="description_info">${downloads}</span></b>
                  </p>
                </div>
              </div>`
  }






