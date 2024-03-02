let selectedFile = ''
const fileInput = document.getElementById('file-input')
fileInput.addEventListener('change', event => {
  selectedFile = event.target.files[0]
  loadFile(selectedFile)
})

let userInput = '1050'
let lkz = 'A'
let outerFileArray = []
let outputArr = []

function loadInput () {
  userInput = document.getElementById('inputPLZ').value
  console.log(userInput)
}

function loadFile (file) {
  const reader = new FileReader()

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })

    //select desired sheet
    const sheet = workbook.Sheets['Tabelle1']

    // convert xlsx file to javascript array
    let fileArray = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    outerFileArray = fileArray

    const entfA = arr => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i][2] === 'A') {
          // Aktualisiere den Wert in arr[i][1] mit den ersten zwei Zeichen entfernt
          arr[i][3] = arr[i][3].substring(2)
        }
      }
    }

    entfA(fileArray)

    //process generic javascript array to specific array of target objects
    const rowDataArray = []

    for (let i = 1; i < fileArray.length; i++) {
      let dateValue = fileArray[i][31]
      let processedDate = '-'
      if (dateValue !== undefined) {
        let jsDatum = new Date((fileArray[i][31] - 25569) * 86400 * 1000)
        processedDate = jsDatum.toLocaleDateString()
      }

      const rowData = new RowData(
        fileArray[i][3], //plz
        fileArray[i][10], //nachname
        fileArray[i][14], //straße
        fileArray[i][15], //ort
        fileArray[i][20], //sn
        fileArray[i][21], //geräte
        processedDate //letzter einsatz
      )

      if (fileArray[i][3] === userInput) {
        rowDataArray.push(rowData)
      }
      console.log(dateValue)
    }

    console.log(fileArray[2][26])
    console.log(fileArray)
    console.log(rowDataArray)
    outputArr = rowDataArray
    output(rowDataArray)

    plzBefore()
    plzAfter()
  }
  reader.readAsArrayBuffer(file)
}

const allPLZ = arr => {
  const plzs = []
  for (let i = 0; i < arr.length; i++) {
    plzs.push(arr[i][3])
  }
  return plzs
}

const plzBefore = () => {
  let plzs = allPLZ(outerFileArray)

  let firstIndex = plzs.indexOf(userInput)

  return plzs[firstIndex - 1]
}

const plzAfter = () => {
  let plzs = allPLZ(outerFileArray)

  let lastIndex = plzs.lastIndexOf(userInput)

  return plzs[lastIndex + 1]
}

function output (arr) {
  function clear () {
    console.log('Clearing the list')
    let thingToClear = document.getElementById('list')

    while (thingToClear.firstChild) {
      thingToClear.removeChild(thingToClear.firstChild)
    }
  }

  let list = document.getElementById('list')
  list.style.display = 'block'

  let heading1 = document.createElement('h1')
  heading1.className = 'headingTop'
  list.appendChild(heading1)
  heading1.innerHTML = 'Kunden mit PLZ: ' + userInput

  for (i = 0; i < arr.length; i++) {
    let newDiv = document.createElement('div')

    newDiv.className = 'divJS'

    list.appendChild(newDiv)

    newDiv.innerHTML += '<strong>PLZ:</strong> ' + arr[i].plz + '<br>' + '<br>'
    newDiv.innerHTML += '<strong>Ort:</strong> ' + arr[i].ort + '<br>' + '<br>'
    newDiv.innerHTML +=
      '<strong>Straße:</strong> ' + arr[i].straße + '<br>' + '<br>'
    newDiv.innerHTML +=
      '<strong>Nachname:</strong> ' + arr[i].nachname + '<br>' + '<br>'
    newDiv.innerHTML +=
      '<strong>Letzter Einsatz:</strong> ' +
      arr[i].letzterEinsatz +
      '<br>' +
      '<br>'
    newDiv.innerHTML += '<strong>SN:</strong> ' + arr[i].sn + '<br>' + '<br>'
  }

  let headingPlzs = document.createElement('h2')
  headingPlzs.className = 'heading'
  list.appendChild(headingPlzs)
  headingPlzs.innerHTML = 'PLZs in der Nähe:'

  let beforePlz = document.createElement('div')
  beforePlz.className = 'plzButton'
  list.appendChild(beforePlz)

  let afterPlz = document.createElement('div')
  afterPlz.className = 'plzButton'
  list.appendChild(afterPlz)

  beforePlz.innerHTML = plzBefore()
  afterPlz.innerHTML = plzAfter()

  beforePlz.addEventListener('click', function () {
    clear()
    userInput = beforePlz.innerHTML
    loadFile(selectedFile)
  })

  afterPlz.addEventListener('click', function () {
    clear()
    userInput = afterPlz.innerHTML
    loadFile(selectedFile)
  })

  //entfernen von 1.ter seite

  let plzInputField = document.getElementById('inputPLZ')
  plzInputField.style.display = 'none'

  let button = document.getElementById('buttonInputField')
  button.style.display = 'none'

  let fileInput = document.getElementById('file-input')
  fileInput.style.display = 'none'

  let topHeading = document.getElementById('firstSiteTopHeading')
  topHeading.style.display = 'none'
}
