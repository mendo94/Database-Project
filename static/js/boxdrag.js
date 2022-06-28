// select the item element
const item = document.querySelector('.boxItem');

// attach the dragstart event handler
item.addEventListener('dragstart', dragStart);

// handle the dragstart

function dragStart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    
}

const boxes = document.querySelectorAll('.box-drag-position');
console.log(boxes)

/*boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});*/

function dragOver(ev) {
    if (ev.target.id.match("drag"))
    {
        ev.preventDefault()
        ev.target.classList.add('drag-over')
    }

      
    
}

function dragLeave(ev) {
    if (ev.target.id.match("drag"))
    {
        ev.preventDefault()
        ev.target.classList.remove('drag-over')
    }
}