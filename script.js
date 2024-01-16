console.log('hello again')
const apiKey = '695ba21512908372e18bcecc3edd916f'
const searchBox = document.querySelector('#search')
const searchBtn = document.querySelector('#search-btn')
const dailyWeather = document.querySelector('.today')
const fiveDayContainer = document.querySelector('.five-Day')
const historyContainer = document.querySelector('.history-btn')

async function search(searchCity) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=imperial&appid=${apiKey}`)

        const data = await response.json()

        const weatherIcon = data.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`
        const todayWeather = `
        <div>
        <h2>${data.name}</h2>
        <p>temp: ${data.main.temp}</p>
        <p>humidity: ${data.main.humidity}</p>
        <p>wind-speed: ${data.wind.speed}</p>
        <p>${data.weather[0].description}</p>
        <img src='${iconUrl}'/>
        </div>
        `;
        dailyWeather.innerHTML = todayWeather

        const lat = data.coord.lat
        const lon = data.coord.lon
        try {
            const fiveDayResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const fiveDayData = await fiveDayResponse.json()
        const formattedData = fiveDayData.list.filter(day => day.dt_txt.includes('12:00:00'));
        
            let weeklyCard = '';
        for(var i = 0; i < formattedData.length; i++){
            console.log(formattedData[i])

            const dayOfWeek = new Date(formattedData[i].dt_txt.toLocaleString());
            const icon = formattedData[i].weather[0].icon
            const iconImg = `<img src = 'https://openweathermap.org/img/wn/${icon}.png'/>`
            weeklyCard += `
            <div class='card'>
            <p>${dayOfWeek}</p>
            ${iconImg}
            <h3>Temperature ${formattedData[i].main.temp}</h3>
            <h3>Humidity ${formattedData[i].main.humidity}</h3>
            <h3>Wind Speed ${formattedData[i].wind.speed}</h3>
            </div>
            `;
            
            fiveDayContainer.innerHTML = weeklyCard
            console.log(dayOfWeek)
        }
    } catch (error) {
        console.error(error)
    }
}
catch (error) {
    console.error(error)
}
}


searchBtn.addEventListener('click', function (event) {
    event.preventDefault()
    const searchCity = searchBox.value.trim()
    saveSearches()
    search(searchCity)
})
function saveSearches() {
    let previousSearch = searchBox.value.trim()
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(previousSearch)
    localStorage.setItem('history', JSON.stringify(history))
    createBtn(history)
}

function createBtn(history) {
    for(var i = 0; i < history.length; i++) {
        const btn = document.createElement('li')
        btn.textContent = history[i]
        btn.className += 'city-btn'
        historyContainer.appendChild(btn)

        btn.addEventListener('click', function(event){
            event.preventDefault()
            let pastCity = btn.textContent
            search(pastCity)
        })
    }

}