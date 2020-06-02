'use strict';




// TODO consult treebrowser use of browserify for reminders about how to structure HTML-JS relationship
// But can just do a static HTML mock up of example grid to start, if that is easier.
class GridView {
    constructor (worldState) {
        this.worldState = worldState;

        this.cornerCoord = undefined;
    }
    
    tableHtml () {
        for (let element of data) {
            let row = table.insertRow();

            for (key in element) {
                let cell = row.insertCell();
                let text = document.createTextNode(element[key]);

                cell.appendChild(text);
            }
        }
    }

    setExampleGridHtml () {
        const table = undefined;

        for (let r = 0; r < GridView.WINDOW_SQUARES; r++) {
            for (let c = 0; c < GridView.WINDOW_SQUARES; c++) {

            }
        }
    }

    static run () {
        // set up example
        const view = new GridView();

        view.setExampleGridHtml();
    }
}

GridView.WINDOW_SQUARES = 20;




let mountains = [
    { name: "Monte Falco", height: 1658, place: "Parco Foreste Casentinesi" },
    { name: "Monte Falterona", height: 1654, place: "Parco Foreste Casentinesi" },
    { name: "Poggio Scali", height: 1520, place: "Parco Foreste Casentinesi" },
    { name: "Pratomagno", height: 1592, place: "Parco Foreste Casentinesi" },
    { name: "Monte Amiata", height: 1738, place: "Siena" }
];

// function generateTableHead(table, data) {
//   let thead = table.createTHead();
//   let row = thead.insertRow();
//   for (let key of data) {
//     let th = document.createElement("th");
//     let text = document.createTextNode(key);
//     th.appendChild(text);
//     row.appendChild(th);
//   }
// }

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

let table = document.querySelector("table");
let data = Object.keys(mountains[0]);
generateTableHead(table, data);
generateTable(table, mountains);
