$(document).ready(function() {
    const rows = 4;
    const cols = 4;
    const puzzleContainer = $('#puzzle-container');
    const imageUrl = 'https://ik.imagekit.io/superman0my0id/superman.my.id/Kneel-Before-Zod-4-1-scaled.jpg?updatedAt=1712314591087'; // Replace with your image URL
    const pieceWidth = puzzleContainer.width() / cols;
    const pieceHeight = puzzleContainer.height() / rows;
    let correctPieces = 0;

    // Load the image and create puzzle pieces
    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const piece = $('<div class="puzzle-piece"></div>').css({
                    width: pieceWidth,
                    height: pieceHeight,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `-${j * pieceWidth}px -${i * pieceHeight}px`
                }).data({
                    row: i,
                    col: j,
                    correctRow: i,
                    correctCol: j
                });

                puzzleContainer.append(piece);
                piece.draggable({
                    containment: '#puzzle-container',
                    start: function() {
                        $(this).addClass('dragging');
                    },
                    stop: function() {
                        $(this).removeClass('dragging');
                    }
                }).droppable({
                    accept: '.puzzle-piece',
                    drop: function(event, ui) {
                        const dropped = ui.helper;
                        const droppedOn = $(this);

                        const droppedData = dropped.data();
                        const droppedOnData = droppedOn.data();

                        // Swap positions
                        const tempTop = dropped.css('top');
                        const tempLeft = dropped.css('left');

                        dropped.css({
                            top: droppedOn.css('top'),
                            left: droppedOn.css('left')
                        });

                        droppedOn.css({
                            top: tempTop,
                            left: tempLeft
                        });

                        // Swap data
                        dropped.data({
                            row: droppedOnData.row,
                            col: droppedOnData.col
                        });

                        droppedOn.data({
                            row: droppedData.row,
                            col: droppedData.col
                        });

                        // Check if the piece is in the correct position
                        if (dropped.data('row') === dropped.data('correctRow') &&
                            dropped.data('col') === dropped.data('correctCol')) {
                            correctPieces++;
                        } else {
                            correctPieces--;
                        }

                        if (correctPieces === rows * cols) {
                            alert('Puzzle complete!');
                        }
                    }
                });
            }
        }

        // Shuffle pieces
        shufflePuzzle();
    };

    function shufflePuzzle() {
        $('.puzzle-piece').each(function() {
            const randomTop = Math.floor(Math.random() * (puzzleContainer.height() - pieceHeight));
            const randomLeft = Math.floor(Math.random() * (puzzleContainer.width() - pieceWidth));
            $(this).css({
                top: randomTop,
                left: randomLeft
            }).data({
                row: null,
                col: null
            });
        });
    }
});
