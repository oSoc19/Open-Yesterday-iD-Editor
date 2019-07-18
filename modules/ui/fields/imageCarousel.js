 var imageButtons = selection.selectAll('.image-buttons');

            //add image carousel buttons
            imageButtons
                .append('button')
                .attr('class', 'btn-carousel btn-prev fas fa-chevron-left')
                .merge(imageButtons);

            imageButtons
                .append('button')
                .attr('class', 'btn-carousel btn-next fas fa-chevron-right')
                .merge(imageButtons);