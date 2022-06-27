const boxOrganizer = document.getElementById('box-position-holder')

let currentStorage = []
let storagesAvailable = []
let itemsAvailable = []

async function getCurrentItems() {
    await fetch("./client/space/items")
    .then(raw => {
        return raw.json()
    })
    .then(info => {
        currentStorage = info
        console.log(currentStorage)
        itemsAvailable = info
    })
    .catch (error => {return error})
    
}

async function getCurrentStorage() {
    await fetch("./client/space/boxes")
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
              <a href="#!" class="card-link">Edit Box</a>
              <a href="#!" class="card-link">Delete Box</a>
            </div>
          </div>`
        })
        return `<div class="box-storage" id="container-${container.id}">
        <h1>${container.box}</h1>
        ${itemsElements.join()}
        <div class="box-drag-position" id="drag${container.id}" ondragover="dragOver(event)" ondragleave="dragLeave(event)" ondrop="drop(event)">
          Place Box Here
        </div>
      </div>`
    })
    console.log(containerElements)

    boxOrganizer.innerHTML = containerElements
}

function drop(ev) {
    if(ev.target.id.match('drag')) {
        ev.preventDefault();
        ev.target.classList.remove('drag-over')
        let data = ev.dataTransfer.getData("text");
        let movedElement = document.getElementById(data)
        let containerElement = ev.target.parentElement

        let originalContainerId = movedElement.parentElement.id.split('-')[1]
        let originalContainer = currentStorage.find(container => {
            return container.id == originalContainerId
        })

        const movedItem = originalContainer.items.find(item => {
            console.log(item.id)
            return item.id == data.split('-')[1]
        })
        console.log(data.split('-')[1])
        
        fetch(`./client/items/${movedItem.id}/${containerElement.id.split('-')[1]}`, {
            method: 'POST'
        })
        .then(message => {
            debug.log('storage change successful!')
        })
        console.log(currentStorage)

        containerElement.appendChild(movedElement);
        // display the draggable element
        document.getElementById(data).classList.remove('hide');
        setupDashboard()
    }
    
}

setupDashboard()