let CurrentCity = '';

// Call Immediately Invoked Function
(async function (city) {
    let x = await setEffects(null, city);
    if (x) {
        document.body.classList.add('clear-loading-page');
        document.querySelector('.loading').classList.add('clear-loading');
    }
})('sohag');
// Add shadow in search group div on Focus
input_search.addEventListener('focus', e => {
    // Delete is-invalid class From Input Group
    e.target.parentElement.classList.remove('is-invalid');
    // Add Focus Class To Input Group
    e.target.parentElement.classList.add('focus');
    //    Change Placeholder
    input_search.placeholder = 'Find Your Location...'
})

input_search.addEventListener('blur', e => {
    e.target.parentElement.classList.remove('focus');
    e.target.parentElement.classList.remove('is-invalid');
})

// While User Input 
input_search.addEventListener('input', e => {
    input_search.parentElement.classList.remove('is-invalid');
    setEffects(e, e.target.value);
});

// Once User Click On Submit Btn
btn_search.addEventListener('click', e => {
    setEffects(e, input_search.value)
    input_search.value = ''; // Clear Input Field
});

// main Function 
async function setEffects(e, loc_) {
    let city = loc_;
    if (city != '') {
        let cityExist = await checkCity(city);

        if (cityExist.length > 0) {

            last_update.parentElement.classList.remove('d-none'); // show Last Update Box

            // get Weather Data of city-[input]
            let { current, location: { name: cityName }, forecast: { forecastday } } = await getData(city);


            // ----------------------------|=< Start Current Day Data >=|----------------------------//
            // ------------|Set Current Day Data|---------------//

            // get date of current day
            const dayDate = new Date(forecastday[0].date);

            const monthName = dayDate.toLocaleString("default", { month: "long" });
            const dayName = dayDate.toLocaleString("default", { weekday: "long" });
            const dayMonth = dayDate.getDate();

            current_day_date.textContent = dayName;
            current_dayMonth_date.textContent = `${dayMonth}-${monthName}`;
            // ------------|Set Current Day Data|---------------//

            // ------------|Set Current Day Weather Data|---------------//
            // console.log(current);
            // Destructure Current Day Data From Current Object
            let { last_updated, temp_c, wind_kph, cloud, wind_dir } = current; // get current weather data
            let { text: condText, icon: currentCondiIcon } = current.condition; // condition weather

            current_day_forecast_num.textContent = temp_c; // forecast degree

            current_forecast_condition.textContent = condText;// Weather Condition
            current_forecast_icon.src = `https://${currentCondiIcon}`;// Condition Icon

            cloud_percent.textContent = `${cloud}%`; // Cloud Percentage
            wind_deg.textContent = `${wind_kph}km/h`; // cloud degree
            wind_direction.textContent = `${wind_dir}` // Wind Direction

            // ------------|Set Current Day Weather Data|---------------//
            // ----------------------------|=< End Current Day Data >=|----------------------------//

            // ----------------------------|=< Start Next Day Data >=|----------------------------//
            // console.log(forecastday[1]);
            // Destructure Next Day Data From ForecastDay Object
            let { date: nextDay, day: { condition: { text: nextCondiText, icon: nextCondiIcon }, maxtemp_c: nextMaxtemp_c, mintemp_c: nextMintemp_c }, } = forecastday[1];

            next_day_date.textContent = new Date(nextDay).toLocaleString("default", { weekday: "long" });
            next_forecast_condition.textContent = nextCondiText; // Condition Text
            next_forecast_icon.src = `https://${nextCondiIcon}`; // Condition Icon
            next_day_forecast_high.textContent = nextMaxtemp_c; // Highest Forecast Tem Degree
            next_day_forecast_low.textContent = nextMintemp_c;  // Lowerest Forecast Tem Degree

            // ----------------------------|=< End Next Day Data >=|----------------------------//

            // ----------------------------|=< Start Next x2 Day Data >=|----------------------------//
            // console.log(forecastday[2]);
            // Destructure Next Next Day Data From ForecastDay Object
            let { date: next_2_Day, day: { condition: { text: next_2_CondiText,
                icon: next_2_CondiIcon }, maxtemp_c: next_2_maxtemp_c, mintemp_c: next_2_mintemp_c }, } = forecastday[2];

            next_2_day_date.textContent = new Date(next_2_Day).toLocaleString("default", { weekday: "long" });
            next_2_forecast_condition.textContent = next_2_CondiText; // Condition Text
            next_2_forecast_icon.src = `https://${next_2_CondiIcon}`; // Condition Icon
            next_2_day_forecast_high.textContent = next_2_maxtemp_c; // Highest Forecast Tem Degree
            next_2_day_forecast_low.textContent = next_2_mintemp_c;  // Lowerest Forecast Tem Degree

            // ----------------------------|=< End Next x2 Day Data >=|----------------------------//
            location_element.textContent = cityName; // Put City Name At Specific Paragraph
            CurrentCity = cityName; // Store City Name For Future Refresh 
            last_update.textContent = last_updated; // Update last update date 

            return true;
        }
    }
    else {
        input_search.placeholder = 'You Must Input Some Data';
        input_search.parentElement.classList.add('is-invalid')
    }
    return false;
}

// Refresh Btn To Get Lastest Update
btn_refresh.addEventListener('click', e => {
    if (CurrentCity) {
        // split(" ").join('') To validate that current city not last word will be searched
        //     that happen because of space between Word 
        setEffects(e, CurrentCity.split(" ").join(''));
    }
})

// Check If City Exist Or Not
async function checkCity(city) {
    // get if there city With Thats chars 
    //      if not found return []
    //          else return Not Empty Array
    let res = await fetch(`http://api.weatherapi.com/v1/search.json?key=8a148a00e2f14425af8202503221010&q=${city}`);
    return await res.json();
}
// 
async function getData(city) {
    let resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=8a148a00e2f14425af8202503221010&q=${city}&days=3&aqi=yes&alerts=no
    `);

    return await resp.json()
}
