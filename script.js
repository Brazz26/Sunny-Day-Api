console.log('hello again');
const apiKey = '695ba21512908372e18bcecc3edd916f';
const searchBox = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');
const dailyWeather = document.querySelector('.today');
const fiveDayContainer = document.querySelector('.five-Day');
const historyContainer = document.querySelector('.history-btn');

//search function for cities
async function search(searchCity) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=imperial&appid=${apiKey}`)

        const data = await response.json();
        console.log(data);
        const weatherIcon = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`
        const todayWeather = `
        <div>
        <h2>${data.name}</h2>
        <img src='${iconUrl}'/>
        <p>temp: ${parseInt(data.main.temp)}\u00B0F</p>
        <p>humidity: ${data.main.humidity}%</p>
        <p>wind-speed: ${data.wind.speed}mph</p>
        <p>${data.weather[0].description}</p>
        </div>
        `;
        dailyWeather.innerHTML = todayWeather;

        const lat = data.coord.lat;
        const lon = data.coord.lon;
        try {
            const fiveDayResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`);
            const fiveDayData = await fiveDayResponse.json();
            const formattedData = fiveDayData.list.filter(day => day.dt_txt.includes('12:00:00'));
            console.log(fiveDayData);

            let weeklyCard = '';

            for (var i = 0; i < formattedData.length; i++) {
                console.log(formattedData[i]);

                const dayOfWeek = new Date(formattedData[i].dt_txt.toLocaleString());
                const icon = formattedData[i].weather[0].icon;
                const iconImg = `<img src = 'https://openweathermap.org/img/wn/${icon}.png'/>`;
                weeklyCard += `
            <div class='card'>
            <p>${dayOfWeek}</p>
            ${iconImg}
            <h3>Temp: ${parseInt(formattedData[i].main.temp)}\u00B0F</h3>
            <h3>Humidity: ${formattedData[i].main.humidity}%</h3>
            <h3>Wind Speed: ${formattedData[i].wind.speed}mph</h3>
            </div>
            `;

                fiveDayContainer.innerHTML = weeklyCard;
                console.log(dayOfWeek);
            }
        } catch (error) {
            console.error(error);
        }
    }
    catch (error) {
        console.error(error)
    }
}

//creates a click event to callback on saveSearches and Search functions so it happens sequentially
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    const searchCity = searchBox.value.trim();
    saveSearches();
    search(searchCity);
})
//sets and retrieves from local storage
function saveSearches() {
    let previousSearch = searchBox.value.trim();
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(previousSearch)
    localStorage.setItem('history', JSON.stringify(history))
    createBtn(history)
}
//creates a history of cities to call back to from local storage
function createBtn(history) {
    for (var i = 0; i < history.length; i++) {
        const btn = document.createElement('li');
        btn.textContent = history[i];
        btn.className += 'city-btn';
        historyContainer.appendChild(btn);

        btn.addEventListener('click', function (event) {
            event.preventDefault();
            let pastCity = btn.textContent;
            search(pastCity);
        })
    }

}