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
        console.log(currentStorage)
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
        console.log(storagesAvailable)
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
    console.log(storageContainers)
    currentStorage = storageContainers
    createTable()

}

function createTable () {
    let containerElements = currentStorage.map(container => {
        let itemsElements = container.items.map(item => {
            return `<div class="card dragBox boxItem" ondragstart="dragStart(event)" draggable="true" id="item-${item.id}">
            <div class="card-body">
              <h4 class="card-title">${item.name}</h4>
              <p class="card-text">
              
              </p>
              <a href="#!" class="card-link">Edit Item</a>
              <a href="/object-handling/delete/item/${roomId.innerHTML}/${item.id}" class="card-link">Delete Item</a>
            </div>
          </div>`
        })
        return `<div class="card box-storage" id="container-${container.id}">
        <h1>${container.box}</h1>
        <a href="/object-handling/delete/box/room-view/${container.id}/?roomId=${roomId.innerHTML}">Delete Box</a>

        <a href="/object-handling/create-item/${roomId.innerHTML}/${container.box}/${container.id}">Make new Item for Box</a>
        <div class="box-drag-position" id="drag${container.id}" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
            ${itemsElements.join('')}
          Drag Item Here
        </div>
        
      </div>`
    })
    console.log(containerElements)

    boxOrganizer.innerHTML = containerElements.join('')
}

function drop(ev) {
    if(ev.target.id.match('drag')) {
        ev.preventDefault();
        ev.target.classList.remove('drag-over')
        let data = ev.dataTransfer.getData("text");
        let containerElementId = ev.target.parentElement.id.split('-')[1]
        console.log(`Item Id: ${data.split('-')[1]}`)
        console.log(`New Box Id: ${containerElementId}`)
        
        fetch(`/client/items/${data.split('-')[1]}/${containerElementId}`, {
            method: 'POST'
        })
        .then(message => {
            debug.log('storage change successful!')
        })
        .catch(message => {
            debug.log(`ERROR: ${message}`)
        })
        document.getElementById(data).classList.remove('hide');
        setupDashboard()
    }
    
}

setupDashboard()