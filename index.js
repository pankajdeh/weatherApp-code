// const BASE_URL= "https://api.openweathermap.org/data/2.5"


    

const userTab = document.querySelector("[data-userWeather]")
const searchTab = document.querySelector("[data-searchWeahter]")
const userContainer = document.querySelector(".weather-container")  

const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm  = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container")

const userInfoContainer = document.querySelector(".user-info-container")


// initially variables need?

let currentTab = userTab ;
const API_KEY = "87af4856be9e4dfc3b4346ad20091354"
currentTab.classList.add("current-tab")

getfromSessionStorage()



// 
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab
        currentTab.classList.add("current-tab")

    }

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active")
        grantAccessContainer.classList.remove("active")
        searchForm.classList.add("active")
    }
    else{
        // main pehle search wale tab m tha, ab your-weather-tab visible krna hai 
        searchForm.classList.remove("active")
        userInfoContainer.classList.remove("active")
        //ab m your-weather-tab m aagya hu, toh weather bhi display krna padega
        // for coordinates , if we haved saved them there,
        getfromSessionStorage()

    }

}

userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab)
})

searchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab)
})

//check if coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        //agar local coordinates nahi mile 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

///api call kr rhe h --async fun banana padega 
async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates                    
    //make grantContainer invisible 

    grantAccessContainer.classList.remove("active")
    //make loader visible
    loadingScreen.classList.add("active")

    //API CALL
    try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
        const data = await response.json();
        console.log(data)
        loadingScreen.classList.remove("active") 
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
    }

    catch(error){
        // console.error(error)
        console.log("helo")
        loadingScreen.classList.remove("active") 
    }

}

//ab api call kr dia hai toh apne element m  vo api wale data ko insert krwana padega 

function renderWeatherInfo(weatherInfo){

    //firstly , we have to fetch the element 

const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]")
const  desc = document.querySelector("[data-weatherDesc]")
const  weatherIcon = document.querySelector("[data-weatherIcon]")
const  temp = document.querySelector("[data-temp]")
const  windspeed = document.querySelector("[data-windspeed]")
const  humidity = document.querySelector("[data-humidity]")
const  cloudiness = document.querySelector("[data-cloudiness]")

//fetch values from the weather INFO object and pull it UI elements

cityName.innerText = weatherInfo?.name;
// countryIcon.src = `https://flagcdn.com/144×108/${weatherInfo?.sys?.country.toLowerCase()}.png`
countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText = weatherInfo?.main?.temp;
windspeed.innerText = weatherInfo?.wind?.speed;
humidity.innerText = weatherInfo?.main?.humidity;
cloudiness.innerText = weatherInfo?.clouds?.all; 

}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("NO geological support available")
    }
}
function showposition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)

}

const grantAccessButton  = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener("click", getLocation)


const searchInput  = document.querySelector("[data-searchInput]")

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault()
    let cityName = searchInput.value

    if(cityName == "")
    return;
    else{
        fetchSearchWeatherInfo(cityName)
    }
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active")
    userInfoContainer.classList.remove("active")
    grantAccessContainer.classList.remove("active")

    //api call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data)
        
    }
    catch(error){
        // console.error(error)
        console.log("something went wrong in search api call")
    }
}






// https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=87af4856be9e4dfc3b4346ad20091354

// /weather?lat={lat}&lon={lon}&appid={API key}
