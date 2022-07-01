const boxOrganizer = document.getElementById('box-position-holder')
const roomId = document.getElementById('roomId')
console.log(roomId)

let currentStorage = []
let storagesAvailable = []
let itemsAvailable = []

async function getCurrentItems() {
    await fetch("/client/space/items")
    .then(raw => {
        return raw.json()
    })
    .then(info => {
        itemsAvailable = info
    })
    .catch (error => {return error})
    
}

async function getCurrentStorage() {
    await fetch(`/client/space/boxes/sort/${roomId.innerHTML}`)
    .then(raw => {
        return raw.json()
    })
    .then(info => {
        currentStorage = info
        
        storagesAvailable = info
    })
    .catch (error => {return error})
}

async function setupDashboard () {
    await getCurrentStorage()
    await getCurrentItems()

    let storageContainers = storagesAvailable
    let storageItems = itemsAvailable
    for (let index = 0; index < storageContainers.length; index++) {
        const element = storageContainers[index];
        storageContainers[index].items = storageItems.filter(item => {
            return item.containerId == storageContainers[index].id
        })
    }
    currentStorage = storageContainers
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

function createTable () {
    let containerElements = currentStorage.map(container => {
        let itemsElements = container.items.map(item => {

            return `<div class="card dragBox boxItem" ondragstart="dragStart(event)" draggable="true" id="item-${item.id}">
            <div  class="card-body">
              <h4 class="card-title" id="itemTitle-${item.id}">${item.name}</h4>
              
            <form action="/client/update-item/${roomId.innerHTML}" style="display: none;" id="itemUpdate-${item.id}" method="POST">
              <div class="form-group">
                <input type="text" class="form-control" id="formGroupExampleInput" name="name"
                  value="${item.name}">
              </div>
              <button id="itemEditConfirm-${item.id}" name="id" value="${item.id}" type="submit"
              class="btn content-btn">
                Confirm</button>
            </form>

              <button id="itemEditButton-${item.id}" onclick="updateObjectStart(${item.id}, 'item')" class="btn content-btn">Edit Item</button>

              <a href="/object-handling/delete/item/${roomId.innerHTML}/${item.id}" class="btn content-btn">Delete Item</a>
            </div>
          </div>`
        })
        return `<div class="card box-storage" id="container-${container.id}">
        <h1 id="boxTitle-${container.id}">${container.box}</h1>
        <form action="/client/update-box/${roomId.innerHTML}" style="display: none;" id="boxUpdate-${container.id}" method="POST">
              <div class="form-group">
                <input type="text" class="form-control" id="formGroupExampleInput" name="name"
                  value="${container.box}">
              </div>
              <button  id="boxEditConfirm-${container.id}" name="id" value="${container.id}" type="submit"
              class="btn content-btn">
                Confirm</button>
            </form>

        <button id="boxEditButton-${container.id}" onclick="updateObjectStart(${container.id}, 'box')" class="btn content-btn card-link">Edit Box</button>
        <a class="btn content-btn" href="/object-handling/delete/box/room-view/${container.id}/?roomId=${roomId.innerHTML}">Delete Box</a>

        <form action="/object-handling/create-item/${roomId.innerHTML}/${container.id}">
            <button class="btn content-btn" name="containerName" value="${container.box}">Register new Item for Box</button>
        </form>
        <div class="box-drag-position" id="drag${container.id}" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
            ${itemsElements.join('')}
          Drag Item Here
        </div>
        
      </div>`
    })

    boxOrganizer.innerHTML = containerElements.join('')
}

function drop(ev) {
    if(ev.target.id.match('drag')) {
        ev.preventDefault();
        ev.target.classList.remove('drag-over')
        let data = ev.dataTransfer.getData("text");
        let containerElementId = ev.target.parentElement.id.split('-')[1]
        
        fetch(`/client/items/${data.split('-')[1]}/${containerElementId}`, {
            method: 'POST'
        })
        .then(message => {
            console.log('storage change successful!')
        })
        .catch(message => {
            console.log(`ERROR: ${message}`)
        })
        document.getElementById(data).classList.remove('hide');
        setupDashboard()
    }
    
}

setupDashboard()