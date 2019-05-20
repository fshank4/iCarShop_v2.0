const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');
const form2 = document.querySelector('#searchbar');
// create element and render cafe

function renderCafe(doc) {
    let li = document.createElement('li');
    let make = document.createElement('span');
    let model = document.createElement('span');
    let year = document.createElement('span');
    let body = document.createElement('span');
    let price = document.createElement('span');
    let mileage = document.createElement('span');
    let interior_color = document.createElement('span');
    let exterior_color = document.createElement('span');
    let used = document.createElement('span');
    let vin = document.createElement('span');
    let stats = document.createElement('div');
    document.getElementById('CarTitle').innerHTML = doc.data().make + " " + doc.data().model;

    li.setAttribute('data-id', doc.id);
    make.textContent = "Make: " + doc.data().make;
    model.textContent = "Model: " + doc.data().model;
    year.textContent = "Year: " + doc.data().year;
    body.textContent = "Body type: " + doc.data().body;
    price.textContent = "Price: " + doc.data().price;
    mileage.textContent = "Mileage: " + doc.data().mileage;
    interior_color.textContent = "Int. Color: " + doc.data().interior_color;
    exterior_color.textContent = "Ext. Color: " + doc.data().exterior_color;
    used.textContent = "New/Used: " + doc.data().used;
    vin.textContent = "VIN: " + doc.data().vin;
    stats.className = "stats_section";

    stats.appendChild(make);
    stats.appendChild(model);
    stats.appendChild(year);
    stats.appendChild(body);
    stats.appendChild(price);
    stats.appendChild(mileage);
    stats.appendChild(interior_color);
    stats.appendChild(exterior_color);
    stats.appendChild(used);
    stats.appendChild(vin);
    li.appendChild(stats);

    cafeList.appendChild(li);
}

// load map for location
const urlParams = new URLSearchParams(window.location.search);

// load immage carousel 
window.onload = db.collection('vehicles').where('vin', '==', urlParams.get('vin')).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        var URL_1 = doc.data().images.First_Image;
        var URL_2 = doc.data().images.Second_Image;
        var URL_3 = doc.data().images.Third_Image;

        document.getElementById('Image_1').src = URL_1;
        document.getElementById('Image_2').src = URL_2;
        document.getElementById('Image_3').src = URL_3;
    })
})

// getting data
// where method is used for searching 
window.onload = db.collection('vehicles').where('vin', '==', urlParams.get('vin')).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    })
})


