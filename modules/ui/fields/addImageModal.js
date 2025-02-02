import { t, textDirection } from '../../util/locale';

// Create the add-image button (appending it to the 'imageInputsDiv')
// Returns the HTMLButtonElement that was added.
function createAddImageButton(imageInputsDiv) {
    let addImage = document.createElement('button');
    addImage.className = 'btn-add-image';
    imageInputsDiv.insertBefore(addImage, imageInputsDiv.firstChild);

    addImage.innerHTML = t('add-image-modal.addbutton');
    return addImage;
}

//Create add-image modal window
function createModal() {
    var modalWindow = document.createElement('div');
    modalWindow.id = 'add-image-modal';
    document.body.appendChild(modalWindow);
    var modalTitel = document.createElement('h2');
    modalTitel.innerHTML = t('add-image-modal.title');
    modalWindow.appendChild(modalTitel);

    var closeButton = document.createElement('button');
    var closeIcon = document.createElement('i');
    closeButton.className = 'modal-close';
    closeIcon.className = 'fas fa-times';

    closeButton.appendChild(closeIcon);
    modalWindow.appendChild(closeButton);
    var dropzoneDiv = document.createElement('div');
    var dropzoneInput = document.createElement('input');
    var dropzoneButton = document.createElement('button');
    dropzoneInput.setAttribute('type', 'file');
    dropzoneButton.setAttribute('type', 'submit');
    dropzoneButton.innerHTML = t('add-image-modal.submit');
    dropzoneDiv.id = 'dropzone';
    dropzoneInput.id = 'submitPicture';
    dropzoneButton.id = 'sendThePictureToWikimedia';
    dropzoneDiv.appendChild(dropzoneInput);
    dropzoneDiv.appendChild(dropzoneButton);
    modalWindow.appendChild(dropzoneDiv);

    var wikimedia = document.createElement('div');
    var wikimediaTitle = document.createElement('h3');
    var wikimediaParagraph = document.createElement('p');
    wikimedia.className = 'wikimedia-alert';
    wikimediaTitle.innerHTML = t('add-image-modal.reminder');
    var wikimediaText = document.createTextNode(t('add-image-modal.license'));
    wikimediaParagraph.appendChild(wikimediaText);
    wikimedia.appendChild(wikimediaTitle);
    wikimedia.appendChild(wikimediaParagraph);
    modalWindow.appendChild(wikimedia);
}

export { createAddImageButton };
export{ createModal };
