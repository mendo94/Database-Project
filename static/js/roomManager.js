const boxOrganizer = document.getElementById('box-position-holder')

let currentRooms = []
let roomsAvailable = []
let boxesAvailable = []

async function getCurrentBoxes() {
    await fetch("../client/space/boxes")
        .then(raw => {
            return raw.json()
        })
        .then(info => {
            boxesAvailable = info
        })
        .catch(error => { return error })

}

async function getCurrentStorage() {
    await fetch("../client/space/rooms")
        .then(raw => {
            return raw.json()
        })
        .then(info => {
            currentRooms = info

            roomsAvailable = info
        })
        .catch(error => { return error })
}

async function setupDashboard() {
    await getCurrentStorage()
    await getCurrentBoxes()

    let storageRooms = roomsAvailable
    let storageBoxes = boxesAvailable
    for (let index = 0; index < storageRooms.length; index++) {
        const element = storageRooms[index];
        storageRooms[index].boxes = storageBoxes.filter(item => {
            return item.roomId == storageRooms[index].id
        })
    }
    currentRooms = storageRooms
    createTable()

}

function updateObjectStart(objectId, objectType) {
    console.log(objectId)
    console.log(objectType)
    const cardTitle = document.getElementById(`${objectType}Title-${objectId}`)
    const cardForm = document.getElementById(`${objectType}Update-${objectId}`)
    const cardButton = document.getElementById(`${objectType}EditButton-${objectId}`)
    const card = document.getElementById(`${objectType}-${objectId}`)
    cardForm.style.display = 'flex';
    cardTitle.style.display = 'none';
    cardButton.style.display = 'none';
    card.setAttribute('draggable', 'false');
}

function createTable() {
    let roomElements = currentRooms.map(container => {
        let boxElements = container.boxes.map(box => {
            return `<div class="card dragBox boxItem" ondragstart="dragStart(event)" draggable="true" id="box-${box.id}">
            <div class="card-body">
              <h4 id="boxTitle-${box.id}" class="card-title">${box.box}</h4>
              <form action="/client/update-box" style="display: none;" id="boxUpdate-${box.id}" method="POST">
              <div class="form-group">
                <input type="text" class="form-control" id="formGroupExampleInput" name="name"
                  value="${box.box}">
              </div>
              <button id="boxEditConfirm-${box.id}" name="id" value="${box.id}" type="submit"
              class="btn content-btn">
                Confirm</button>
            </form>

        <button id="boxEditButton-${box.id}" onclick="updateObjectStart(${box.id}, 'box')" class="btn content-btn">Edit Box</button>

              <a class="btn content-btn" href="/object-handling/delete/box/room/${box.id}" >Delete Box</a>
            </div>
          </div>`
        })
        return `<div class="card box-storage" id="container-${container.id}">
        <h1 id="roomTitle-${container.id}">${container.name}</h1>
        <form action="/client/update-room" style="display: none;" id="roomUpdate-${container.id}" method="POST">
              <div class="form-group">
                <input type="text" class="form-control" id="formGroupExampleInput" name="name"
                  value="${container.name}">
              </div>
              <button class="btn content-btn" id="roomEditConfirm-${container.id}" name="id" value="${container.id}" type="submit">
                Confirm</button>
        </form>

        <button class="btn content-btn" id="roomEditButton-${container.id}" onclick="updateObjectStart(${container.id}, 'room')" >Rename Room</button>
        <a class="btn content-btn" href="/navigation/room-view/${container.id}">Modify Room</a>
        <a class="btn content-btn" href="/object-handling/delete/room/${container.id}">Delete Room</a>
        <div class="box-drag-position" id="drag${container.id}" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
            ${boxElements.join('')}
          Drag Item Here
        </div>
        
      </div>`
    })

    boxOrganizer.innerHTML = roomElements.join('')
}

function drop(ev) {
    if (ev.target.id.match('drag')) {
        ev.preventDefault();
        ev.target.classList.remove('drag-over')
        let data = ev.dataTransfer.getData("text");
        let containerElementId = ev.target.parentElement.id.split('-')[1]

        fetch(`../client/boxes/${data.split('-')[1]}/${containerElementId}`, {
            method: 'POST'
        })
            .then(message => {
                console.log('storage change successful!')
            })
        document.getElementById(data).classList.remove('hide');
        setupDashboard()
    }

}

setupDashboard()