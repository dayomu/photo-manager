var photos = [];
var photosList = document.getElementById('photosList');
var photoSize = document.getElementById('photoSize');
var selectAll = document.getElementById('selectAll');
var deleteButton = document.getElementById('deleteButton');

photoSize.addEventListener('change', handleChangePhotoSizeSelect, false);
selectAll.addEventListener('change', handleChangeSelectAllCheckbox, false);
deleteButton.addEventListener('click', handleClickDeleteButton, false);

generatePhotos();
renderPhotos('all-sizes');

function generatePhotos() {
  var sizes = {
    "1": "large",
    "2": "medium",
    "3": "small"
  };
  var sizeId = 1;
  var photosCount = 120;

  for (var i = 0; i < photosCount; i++) {
    photos.push({
      id: (i + 1),
      size: sizes[sizeId.toString()],
      selected: false
    });

    if (sizeId === Object.keys(sizes).length) {
      sizeId = 1;
    } else {
      sizeId += 1;
    }
  }
}

function renderPhotos(size) {
  var photosToRender = photos.slice(0);

  if (
    (size !== undefined && size !== null)
    && (size === 'large' || size === 'medium' || size === 'small')
  ) {
    photosToRender = photosToRender.filter(function(photo) { return photo.size === size });
  }

  var html = '';
  for (var i = 0; i < photosToRender.length; i++) {
    var photo = photosToRender[i];
    var className = (photo.selected) ? 'photo selected' : 'photo';
    var checked = (photo.selected) ? 'checked' : '';

    html += '<div class="col-4 col-sm-3 col-md-2 col-xl-1"><div class="' + className + '" data-size="' + photo.size + '"><div class="photo-number">' + photo.id + '</div><div class="photo-size">' + photo.size + '</div><input class="form-check-input photo-checkbox" type="checkbox" ' + checked + ' id="'+ photo.id + '" value="'+ photo.id + '"></div></div>';
  }

  photosList.innerHTML = html;

  attachEventListeners(photosToRender);
  setDeleteButtonState();
}

function attachEventListeners(photosToRender) {
  for (var i = 0; i < photosToRender.length; i++) {
    var photo = photosToRender[i];
    var element = document.getElementById(photo.id.toString());
    element.addEventListener('change', handlePhotoCheckboxChange, false);
  }
}

function handleChangePhotoSizeSelect(e) {
  var size = e.target.value;

  photos
    .forEach(function(photo) { photo.selected = false; });
  selectAll.checked = false;

  renderPhotos(size);
}

function handlePhotoCheckboxChange(e) {
  photos.find(function(photo) { return photo.id === parseInt(e.target.value, 10) }).selected = e.target.checked;

  renderPhotos(getPhotosSize());
}

function handleChangeSelectAllCheckbox(e) {
  var size = getPhotosSize();

  if (size !== 'all-sizes') {
    photos
      .filter(function(photo) { return photo.size === size })
      .forEach(function(photo) { photo.selected = e.target.checked; });
  } else {
    photos
      .forEach(function(photo) { photo.selected = e.target.checked; });
  }

  renderPhotos(size);
}

function handleClickDeleteButton(e) {
  e.preventDefault();

  var selectedPhotos = photos.filter(function(photo) { return photo.selected === true });
  selectedPhotos.forEach(function(photo) {
    deletePhoto(photo.id);
  });

  renderPhotos(getPhotosSize());
}

function getPhotosSize() {
  return photoSize.value;
}

function setDeleteButtonState() {
  var selectedPhotosCouner = 0;
  photos.forEach(function(photo) {
    if (photo.selected) {
      selectedPhotosCouner += 1;
    }
  });

  deleteButton.disabled = selectedPhotosCouner <= 0;
}

function deletePhoto(id) {
  var photoIndex = photos.findIndex(function(photo) { return photo.id === id });
  if (photoIndex > -1) {
    photos.splice(photoIndex, 1);
  }
}