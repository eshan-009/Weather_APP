const city_name = document.querySelector(".city_name");
const access_grant = document.querySelector('.grant-access')
const API_key = ; // Get it from open weather
const country_icon = document.querySelector(".c-icon");
const w_desc = document.querySelector('[weather-desc]');
const w_img = document.querySelector('[weather-img]');
const temperature = document.querySelector('[temperature]');
const user_tab = document.querySelector('[tab_1]');
const search_tab = document.querySelector('[tab_2]');
const search_form = document.querySelector(".search-form");
const wind_data = document.querySelector('[wind-data]');
const humidity_data = document.querySelector('[humidity-data]');
const clouds_data = document.querySelector('[clouds-data]');
const load = document.querySelector(".loader");
const main_data = document.querySelector(".main-data-box");
const search_button = document.querySelector(".search_button");
const search_input = document.querySelector('[search-input]');
const search_error = document.querySelector(".search_error");

let old_tab = user_tab;
old_tab.classList.add("current-tab");
getfromsessionstorage();

function switch_tabs(newTab){
    if(old_tab!=newTab){
        old_tab.classList.remove("current-tab");
        old_tab=newTab;
        old_tab.classList.add("current-tab")

        if(!search_form.classList.contains("active")){
        main_data.classList.remove("active");
        search_form.classList.add("active");
        main_data.classList.remove("active");
        }
        else{
            main_data.classList.add("active");
            search_form.classList.remove("active");
            main_data.classList.add("active");
            search_error.classList.remove("active");
            getfromsessionstorage();
            search_input.value = "";
        }
    }
   

}
user_tab.addEventListener('click',()=>(switch_tabs(user_tab)));
search_tab.addEventListener('click',()=>(switch_tabs(search_tab)));

function getfromsessionstorage(){
    const localcoordinates = sessionStorage.getItem("user-data");

    if(!localcoordinates){
        access_grant.classList.add("active");
    }
    else
    {
        const Coordinates = JSON.parse(localcoordinates);
        fetchweatherdata(Coordinates);
    }
}

async function fetchweatherdata(coordinates) {
    const {lat, lon} = coordinates;
    console.log(lat,lon);
    access_grant.classList.remove("active");
    main_data.classList.remove("active")
    load.classList.add("active");
    
    
    try{
        const wdata = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`);
        const fdata = await wdata.json();
        console.log(fdata);
        renderweatherdata(fdata);
        load.classList.remove("active");
        main_data.classList.add("active")
       
    }
    catch(error){
        
    }
    
}

function renderweatherdata(data){
city_name.innerText = data?.name;
city_name.innerText = data?.name;
    temperature.innerText = `${(data?.main?.temp -273.15).toFixed(2)} °C`;
    w_img.src = `http://openweathermap.org/img/wn/${data?.weather[0]?.icon}.png`;
    w_desc.innerText = data?.weather?.[0]?.description;
    country_icon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    wind_data.innerText = `${data?.wind?.speed} m/s`
    humidity_data.innerText = `${data?.main?.humidity} %`
    clouds_data.innerText = `${data?.clouds?.all} %`
}
access_grant.addEventListener('click',function(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showloc);
    }
    else{
        alert("Geolocation Not Supported");
    }
    function showloc(position){
       
        const usercoordinates = {lat : position.coords.latitude,
                                lon : position.coords.longitude,
                            };
        
            console.log(usercoordinates);
        sessionStorage.setItem("user-data",JSON.stringify(usercoordinates));
        fetchweatherdata(usercoordinates);
    }
    
    
})

async function fetchbycity(city){
        try{
            let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}`);
            let f_response = await response.json();
            renderweatherdata(f_response);
            main_data.classList.add("active");
        }
        catch(err){
            main_data.classList.remove("active");
            search_error.classList.add("active");
        }
    
}
search_button.addEventListener('click',(e)=>{
    e.preventDefault();
    let city = search_input.value;
    if(city === ""){
        return;
    }
    fetchbycity(city);
})
