import { dispatch as d3_dispatch } from 'd3-dispatch';
import { select as d3_select, event as d3_event } from 'd3-selection';
import { t, textDirection } from '../../util/locale';

//Create add-image button
function createAddImageButton() {
    var imageInputsDiv = document.getElementsByClassName('image-inputs')[0];
    var addImage = document.createElement('button');
    addImage.className = 'btn-add-image';
    imageInputsDiv.appendChild(addImage);
    
    var imageButton = document.getElementsByClassName('btn-add-image')[0];
    imageButton.innerHTML = t('add-image-modal.addbutton');
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
    var closeSVG = document.createElement('svg');
    var closeUse = document.createElement('use');
    closeButton.className = 'modal-close';
    closeSVG.className = 'icon';
    closeUse.setAttribute('href', '#iD-icon-close');

    closeSVG.appendChild(closeUse);
    closeButton.appendChild(closeSVG);
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
