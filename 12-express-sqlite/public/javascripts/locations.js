
(function () {

    //============================================================================
    //a function that adds to the table the new data the user had submitted
    //============================================================================

    function add2list(event){

        event.preventDefault() //this will prevent the submitting of the form to the browser

        let table = document.getElementById("table");
        let row = document.createElement("tr");
        table.appendChild(row);

        //create a radio button for each item in the table
        let radio = document.createElement("input")
        radio.type = "radio"
        radio.name = "radio"
        row.appendChild(document.createElement("td"))
        row.lastChild.appendChild(radio)

        row.appendChild(document.createElement("td"));
        row.lastChild.innerText = document.getElementById("address").value;

        row.appendChild(document.createElement("td"));
        row.lastChild.innerText = document.getElementById("longitude").value;

        row.appendChild(document.createElement("td"));
        row.lastChild.innerText = document.getElementById("latitude").value;

        //create a 'remove' button for each item in the table
        let remove = document.createElement("button");
        remove.type = "button";
        remove.className = "form-control btn btn-light";
        remove.innerText = "remove";
        row.appendChild(document.createElement("td"))
        row.lastChild.appendChild(remove);

        //display the table if it is not empty
        if(document.getElementById("list").style.display === "none"){
            document.getElementById("list").style.display = "block";
        }
        //reset the form, so the user will be able to add new data
        document.getElementById("form").reset();

    }

    //============================================================================
    //a function that handles the press on a button (the remove button or show button)
    //============================================================================

    function buttonHandler(event){

        if(event.target.innerText === "remove") {
            event.target.parentElement.parentElement.remove() //remove that row from the table
        }

        //the table is empty (has just the thead row) -> display = "none"
        if(document.getElementById("table").childElementCount <= 1){
            document.getElementById("list").style.display = "none";
        }

        else if(event.target.innerText === "show"){
            let radioBottuns = document.getElementsByName("radio");
            for(r of radioBottuns){
                if(r.checked){
                    let lon =  r.parentElement.parentElement.childNodes[2].innerText;
                    let lat =  r.parentElement.parentElement.childNodes[3].innerText;
                    myFetch(lon, lat);
                    return;
                }
            }

        }
    }

    //============================================================================
    //a function that gets (lon, lat) and gets the weather from 7timer site
    //============================================================================

    function myFetch(lon, lat) {

        let url = new URL('http://www.7timer.info/bin/api.pl');
        url.search = new URLSearchParams({'lon': lon, 'lat':lat, 'product':'civillight', 'output':'json'});

        //get the weather
        fetch(url).then(
            function (response) {
                // handle the error
                if (response.status !== 200) {
                    document.getElementById("weather").innerHTML = 'Looks like there was a problem. Status Code: ' +
                        response.status;
                    return;
                }
                response.json().then(weatherProcessor);}
        )
            .catch(function (err) {
                console.log('Fetch Error :', err);
            });

        //get the picture
        url = new URL('http://www.7timer.info/bin/astro.php');
        url.search = new URLSearchParams({'lon': lon, 'lat':lat, 'ac':0, 'lang':'en', 'unit':'metric','output':'internal', 'tzshift':0});

        let image = document.createElement("img");
        image.src = url;
        image.onerror = ()=> {
            image.src = "weather.jpg";
            image.title = "default image displayed do to en error"
        }
        document.getElementById("image").appendChild(image);
    }


    //============================================================================
    //a function that process out the data from the jason
    //============================================================================

    function weatherProcessor(json){
        document.getElementById("weather").style.display = "block";

        //clear the weather of last time
        let result = document.getElementById("result");
        while (result.hasChildNodes())
            result.removeChild(result.lastChild)

        //process the weather out of the jason
        for (i in json.dataseries){
            let row = document.createElement("tr");
            result.appendChild(row);
            row.appendChild(document.createElement("td"))
            row.lastChild.innerText = ((str)=>{ return str.slice(6, 8) +'/'+ str.slice(4, 6)+'/'+ str.slice(0, 4)})
            (json.dataseries[i]["date"].toString())
            row.appendChild(document.createElement("td"))
            row.lastChild.innerText = json.dataseries[i]["weather"]
            row.appendChild(document.createElement("td"))
            row.lastChild.innerText = "max: " + json.dataseries[i]["temp2m"]["max"]
                + ", min: " + json.dataseries[i]["temp2m"]["min"]
            row.appendChild(document.createElement("td"))
            if(json.dataseries[i]["wind10m_max"] !== 1) {
                row.lastChild.innerText = json.dataseries[i]["wind10m_max"]
            }
        }
    }


    document.addEventListener('DOMContentLoaded', function () {
        document.getElementById("form").addEventListener("submit", add2list);
        document.getElementById("list").addEventListener("click", buttonHandler);
    }, false);

}())
