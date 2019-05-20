const vehicleList = document.querySelector('#vehicle-list');
const form = document.querySelector('#search-car-form');
const form2 = document.querySelector('#searchbar');

// create element and render vehicles
function renderVehicle(doc) {
    let li = document.createElement('li');
    let make = document.createElement('span');
    let model = document.createElement('span');
    let year = document.createElement('span');
    let price = document.createElement('span');
    let button = document.createElement('button');
    let stats = document.createElement('div');
    let imgDiv = document.createElement('div');
    let img = show_image(doc.data().image, 90, 70, 'Photo');

    function show_image(image_source, width, height, alt) {
        let image = document.createElement('img');
        image.src = image_source;
        image.width = width;
        image.height = height;
        image.alt = alt;
        return image;
    }

    li.setAttribute('data-id', doc.id);
    make.textContent = "Make: " + doc.data().make;
    model.textContent = "Model: " + doc.data().model;
    year.textContent = "Year: " + doc.data().year;
    price.textContent = "Price: " + doc.data().price;
    button.textContent = "More Details";
    button.onclick = function () { window.location = "detailPage.html?vin=" + doc.data().vin; }
    stats.className = "stats_section";
    imgDiv.className = "img_div";
    img.className = "img_class";

    stats.appendChild(make);
    stats.appendChild(model);
    stats.appendChild(year);
    stats.appendChild(price);
    stats.appendChild(button);
    imgDiv.appendChild(img)
    li.appendChild(stats);
    li.appendChild(imgDiv);

    vehicleList.appendChild(li);
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/*An array containing all the country names in the world:*/

/* var docRef = db.collection("vehicles");

docRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    }); */

var collectionRef = db.collection("vehicles");

/* Get autocomplete list for "make" values */
collectionRef.get().then(function (querySnapshot) {
    /* get the data of all the documents into an array */
    var data = querySnapshot.docs.map(function (documentSnapshot) {
        return documentSnapshot.data().make;
    });
    /* get an array of distinct values */
    let make = [...new Set(data)];
    autocomplete(document.getElementById("make"), make);
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

/* Get autocomplete list for "model" values */
collectionRef.get().then(function (querySnapshot) {
    /* get the data of all the documents into an array */
    var data = querySnapshot.docs.map(function (documentSnapshot) {
        return documentSnapshot.data().model;
    });
    /* get an array of distinct values */
    let model = [...new Set(data)];
    autocomplete(document.getElementById("model"), model);
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

/* Get autocomplete list for "body" values */
collectionRef.get().then(function (querySnapshot) {
    /* get the data of all the documents into an array */
    var data = querySnapshot.docs.map(function (documentSnapshot) {
        return documentSnapshot.data().body;
    });
    /* get an array of distinct values */
    let body = [...new Set(data)];
    autocomplete(document.getElementById("body"), body);
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

/* Get autocomplete list for "interior_color" values */
collectionRef.get().then(function (querySnapshot) {
    /* get the data of all the documents into an array */
    var data = querySnapshot.docs.map(function (documentSnapshot) {
        return documentSnapshot.data().interior_color;
    });
    /* get an array of distinct values */
    let interior_color = [...new Set(data)];
    autocomplete(document.getElementById("interior_color"), interior_color);
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

/* Get autocomplete list for "exterior_color" values */
collectionRef.get().then(function (querySnapshot) {
    /* get the data of all the documents into an array */
    var data = querySnapshot.docs.map(function (documentSnapshot) {
        return documentSnapshot.data().exterior_color;
    });
    /* get an array of distinct values */
    let exterior_color = [...new Set(data)];
    autocomplete(document.getElementById("exterior_color"), exterior_color);
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

/* Get autocomplete list for "used" values */
collectionRef.get().then(function (querySnapshot) {
    /* get the data of all the documents into an array */
    var data = querySnapshot.docs.map(function (documentSnapshot) {
        return documentSnapshot.data().used;
    });
    /* get an array of distinct values */
    let used = [...new Set(data)];
    autocomplete(document.getElementById("used"), used);
}).catch(function (error) {
    console.log("Error getting documents: ", error);
});

window.onload = load();

function load() {
    document.getElementById("vehicle-list").innerHTML = "";
    if (form.make.value != '' ||
        form.model.value != '' ||
        form.year.value != '' ||
        form.body.value != '' ||
        form.price.value != '' ||
        form.mileage.value != '' ||
        form.interior_color.value != '' ||
        form.exterior_color.value != '' ||
        form.used.value != '') {

        var searchArray = [];

        if (form.make.value != '') {
            searchArray.push(['make', form.make.value]);
        }
        if (form.model.value != '') {
            searchArray.push(['model', form.model.value]);
        }
        if (form.year.value != '') {
            searchArray.push(['year', form.year.value]);
        }
        if (form.body.value != '') {
            searchArray.push(['body', form.body.value]);
        }
        if (form.price.value != '') {
            searchArray.push(['price', form.price.value]);
        }
        if (form.mileage.value != '') {
            searchArray.push(['mileage', form.mileage.value]);
        }
        if (form.interior_color.value != '') {
            searchArray.push(['interior_color', form.interior_color.value]);
        }
        if (form.exterior_color.value != '') {
            searchArray.push(['exterior_color', form.exterior_color.value]);
        }
        if (form.used.value != '') {
            searchArray.push(['used', form.used.value]);
        }

        console.log(searchArray.includes());

        if (searchArray.length == 1) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 2) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 3) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 4) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).where(searchArray[3][0], '==', searchArray[3][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 5) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).where(searchArray[3][0], '==', searchArray[3][1]).where(searchArray[4][0], '==', searchArray[4][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 6) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).where(searchArray[3][0], '==', searchArray[3][1]).where(searchArray[4][0], '==', searchArray[4][1]).where(searchArray[5][0], '==', searchArray[5][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 7) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).where(searchArray[3][0], '==', searchArray[3][1]).where(searchArray[4][0], '==', searchArray[4][1]).where(searchArray[5][0], '==', searchArray[5][1]).where(searchArray[6][0], '==', searchArray[6][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 8) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).where(searchArray[3][0], '==', searchArray[3][1]).where(searchArray[4][0], '==', searchArray[4][1]).where(searchArray[5][0], '==', searchArray[5][1]).where(searchArray[6][0], '==', searchArray[6][1]).where(searchArray[7][0], '==', searchArray[7][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
        if (searchArray.length == 9) {
            db.collection('vehicles').where(searchArray[0][0], '==', searchArray[0][1]).where(searchArray[1][0], '==', searchArray[1][1]).where(searchArray[2][0], '==', searchArray[2][1]).where(searchArray[3][0], '==', searchArray[3][1]).where(searchArray[4][0], '==', searchArray[4][1]).where(searchArray[5][0], '==', searchArray[5][1]).where(searchArray[6][0], '==', searchArray[6][1]).where(searchArray[7][0], '==', searchArray[7][1]).where(searchArray[8][0], '==', searchArray[8][1]).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    renderVehicle(doc);
                })
            })
        }
    }
    else {
        var docRef = db.collection('vehicles');
        var query = docRef.where("year", ">=", "2011");
        query.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                renderVehicle(doc);
            });
        })
    }
}

// loading data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    load();
})

form2.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById("vehicle-list").innerHTML = "";
    if (form2.content.value == "") {
        load();
    }
    else {
        db.collection('vehicles').where('vin', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('make', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('model', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('year', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('price', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('body', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('mileage', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('interior_color', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('exterior_color', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
        db.collection('vehicles').where('used', '==', form2.content.value).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                renderVehicle(doc);
            })
        })
    }
})