console.log('hello again')
const apiKey = '695ba21512908372e18bcecc3edd916f'
const searchBox = document.querySelector('#search')
const searchBtn = document.querySelector('#search-btn')
const dailyWeather = document.querySelector('.today')


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
            // const fiveDayResponse = await fetch(`https://openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
            const fiveDayResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`);
            const fiveDayData = await fiveDayResponse.json()
            const formattedData = fiveDayData.list.filter(day => day.dt_txt.includes('12:00:00'));
            console.log(formattedData)
        } catch (error) {
            console.error(error)
        }
    } catch (error) {
        console.error(error)
    }
}


searchBtn.addEventListener('click', function(event){
    event.preventDefault()
    const searchCity = searchBox.value.trim()
    search(searchCity)
})