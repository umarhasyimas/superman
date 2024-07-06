$(document).ready(function() {
    const rows = 8;
    const cols = 8;
    const puzzleContainer = $('#puzzle-container');
    const imageUrl = 'https://ik.imagekit.io/superman0my0id/superman.my.id/kneel-before-zod-4-preview-jpg.jpg?updatedAt=1712314594337'; // Replace with your image URL
    const pieceWidth = puzzleContainer.width() / cols;
    const pieceHeight = puzzleContainer.height() / rows;
    let correctPieces = 0;

    // Load the image and create puzzle pieces
    const img = new Image();
    img.src = imageUrl;
    img.onload = function() {
        let pieces = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const piece = $('<div class="puzzle-piece"></div>').css({
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `-${j * pieceWidth}px -${i * pieceHeight}px`
                }).data({
                    row: i,
                    col: j,
                    correctRow: i,
                    correctCol: j
                });

                pieces.push(piece);
            }
        }

        // Shuffle pieces
        pieces = shuffleArray(pieces);

        // Append shuffled pieces to the container in a grid
        pieces.forEach((piece, index) => {
            const i = Math.floor(index / cols);
            const j = index % cols;

            piece.css({
                gridRowStart: i + 1,
                gridColumnStart: j + 1
            });

            puzzleContainer.append(piece);
            piece.draggable({
                containment: '#puzzle-container',
                start: function() {
                    $(this).addClass('dragging');
                },
                stop: function() {
                    $(this).removeClass('dragging');
                    checkCorrectPosition($(this));
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
                    checkCorrectPosition(dropped);
                    checkCorrectPosition(droppedOn);

                    if (correctPieces === rows * cols) {
                        alert('Puzzle complete!');
                    }
                }
            });
        });
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkCorrectPosition(piece) {
        const data = piece.data();
        const position = piece.position();

        const row = Math.round(position.top / pieceHeight);
        const col = Math.round(position.left / pieceWidth);

        if (row === data.correctRow && col === data.correctCol) {
            if (!piece.hasClass('correct')) {
                piece.addClass('correct');
                correctPieces++;
            }
        } else {
            if (piece.hasClass('correct')) {
                piece.removeClass('correct');
                correctPieces--;
            }
        }
    }
});
