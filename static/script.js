
// This script is used to get the user's location and display the weather forecast for that location.
// Author: Anny
// last updated: 2025-04-06

//Initialize variables
var dayweather_animation_tag = []; // Init weather animation tag
var cityName = ""; // Init city name
var dayNumber = 5;
var weatherobj;

// Get user's location using the Geolocation API
fetch("https://api.ipgeolocation.io/ipgeo?apiKey=ce5e1a3deed94a2897f1c83aba82b031&fields=city,country_code2")
  .then(response => response.json())
  .then(data => {
      console.log(`Your city is ：${data.city}, ${data.country_code2}`);
      document.getElementById('city').value = data.city+','+data.country_code2;
      document.getElementById('city').dispatchEvent(new KeyboardEvent('keypress', {
        'key': 'Enter',
        'code': 'Enter',
        'which': 13,
        'keyCode': 13,
        'bubbles': true
      }));
    })
  .catch(error => {
    console.error('request error:', error);
  });

//Init date formatter.
var formatter = new Intl.DateTimeFormat("en-US",{month: "short", day:"numeric",});

//Init temperature chart.
google.charts.load('current', {'packages':['corechart']});

// Add event listener to the input element's keypress event.
document.getElementById('city').addEventListener('keypress', function(event) {
  if (event.key === 'Enter' || event.keyCode === 13) { // User pressed Enter.

      event.preventDefault(); // disable default action.
 
      // clear every day's weather animations
      for (i in dayweather_animation_tag ){
        clearInterval(dayweather_animation_tag [i]); 
      }

      //clear weather div.
      document.getElementById('main').innerHTML = "";
      cityName = document.getElementById('city').value;
      

      // Get weather data from Open Weather API.
      var url = "/api/weather/daily/" + cityName.replace(",","/");

      fetch(url)
        .then(response => {
          if (!response.ok) { //peocess error response.
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          
          var chartdata =  new google.visualization.DataTable();
          chartdata.addColumn('string', 'Date');
          chartdata.addColumn('number', 'Max');
          chartdata.addColumn('number', 'Day');
          chartdata.addColumn('number', 'Min');

          var options = {
          vAxis: {title: 'Temperature (°C)'},
          curveType: 'function',
          legend: { position: 'right' }
          };

          showCityBackground(cityName.toLowerCase().split(",")[0]); // show city background

          for (i in data.list){
            let el = document.createElement('div');
            el.classList.add('day-card');
            el.id = 'd'+i;

            let el1 = document.createElement('div');
            el1.classList.add('day');
            el1.textContent = formatter.format(new Date(data.list[i].dt * 1000));
            el.appendChild(el1);
          
            el1 = document.createElement('div');
            el1.classList.add('tday');
            el1.textContent = data.list[i].temp.day + '°C';
            el.appendChild(el1);
          
            //Add day's weather div.
            el1 = document.createElement('div');
            el1.classList.add('weather');
            el.appendChild(el1);

            document.querySelector("#main").appendChild(el);

            showWeatherAnimation(i,data.list[i]); // show weather condition animation.
            
            showDressForecast(i, data.list[i]); // show dress suggest.

            callOpenAI(i,data.list[i]); // show cloth suggestion from OpenAI.

            chartdata.addRows([[formatter.format(new Date(data.list[i].dt)),data.list[i].temp.max,data.list[i].temp.day,data.list[i].temp.min]]);
          
          }

          //show weather charts
          var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
          chart.draw(chartdata, options);

        })
        .catch(error => console.error('Error:', error));
  }
});

// Show city background
function showCityBackground(cityName) {
  fetch ('/citylist.txt')
  .then(response => response.text())
  .then(data => {
    if (data.includes(cityName)){
      document.getElementById('main').style.backgroundImage = `url("/images/city/${cityName}.jpg")`;
    }
    else {
      document.getElementById('main').style.backgroundImage = "url('/images/city/default.jpg')";
    }
  })
  .catch(error => console.error('Error:', error));
};

// Show day‘⬆️weather animations
function showWeatherAnimation(i,weatherobj) {
  //test dymanic add weather information.
  // show weather animations
  switch (weatherobj.weather[0].icon) {
    case "01d": // clear sky
      showSun(i);
      dayweather_animation_tag[i] = setInterval(showRays, 1000, i); // Add a new sunray
      break;
    case "02d": // 	few clouds
      showSun(i);
      dayweather_animation_tag[i] = setInterval(showCloud, weatherobj.clouds * 10, i); // Add a new Cloud
      break;
    case "03d":  // scattered clouds
      dayweather_animation_tag[i] = setInterval(showCloud, weatherobj.clouds * 10, i); // Add a new Cloud
      break;
    case "04d": // broken clouds
      dayweather_animation_tag[i] = setInterval(showCloud, weatherobj.clouds * 100, i); // Add a new Cloud
      break;
    case  "09d": //shower rain
      dayweather_animation_tag[i] = setInterval(showRain, 1000/weatherobj.rain,i); // Add a new rain
      break;
    case "10d": //rain
      dayweather_animation_tag[i] = setInterval(showRain, 1000/weatherobj.rain,i); // Add a new rain
      break;
    case "11d": //thunderstorm
      dayweather_animation_tag[i] = setInterval(showThunderstorm, 1000, i); // Add a new thunderstorm
      break;
    case "13d": //snow
      dayweather_animation_tag[i] = setInterval(showSnow, 1000, i); // Add a new snow
      break;
    case "50d": //mist
      dayweather_animation_tag[i] = setInterval(showMist, 1000, i); // Add a new mist
      break;
    default:
      break;
  }
}

// Dress forecast by temperature
function showDressForecast(i,weatherobj) {

  // show dress suggest
  let el =  document.createElement('div');
  el.classList.add('dress_pic');

  // show base people layer
  let x = document.createElement('img');
  x.classList.add('layer');
  x.style.zIndex = 1;
  x.src = "images/dress/girl.png";
  el.appendChild(x);

  //show tops layer.
  let x1 = document.createElement('img');
  x1.classList.add('layer');
  x1.style.zIndex = 3;

  //show coats layer.
  let x2 = document.createElement('img');
  x2.classList.add('layer');
  x2.style.zIndex = 4;

  //show bottoms layer.
  let x3 = document.createElement('img');
  x3.classList.add('layer');
  x3.style.zIndex = 3;

  //show shoes layer.
  let x4 = document.createElement('img');
  x4.classList.add('layer');
  x4.style.zIndex = 2;

  //show accessories layer.
  let x5 = document.createElement('img');
  x5.classList.add('layer');
  x5.style.zIndex = 2;

  var weacon = weatherobj.weather[0].main;

	if (weatherobj.temp.day > 25) {     
    x1.src = "/images/dress/tops/white_tshirt.png";

    // Randomly choose between shorts and skirts
    let t = Math.random();
    if (t > 0.75){
      x3.src = "/images/dress/pants/short.png";
    }
    else if (t > 0.5 && t <= 0.75){
      x3.src = "/images/dress/pants/pink_skirt.png";}
    
    else if (t > 0.25 && t <= 0.5){
      x3.src = "/images/dress/pants/yellow_skirt.png";
    }
    else{
      x3.src = "/images/dress/pants/green_long_dress.png";
    }

    x4.src = "/images/dress/shoes/sandles.png";
  } 
  else if (weatherobj.temp.day > 20 && weatherobj.temp.day <= 25) {
    x1.src = "/images/dress/tops/white_tshirt.png";

    // Randomly choose between shorts and skirts
    let t = Math.random();
    if (t > 0.75){
      x3.src = "/images/dress/pants/short.png";
    }
    else if (t > 0.5 && t <= 0.75){
      x3.src = "/images/dress/pants/pink_skirt.png";}
    
    else if (t > 0.25 && t <= 0.5){
      x3.src = "/images/dress/pants/yellow_skirt.png";
    }
    else {
      x3.src = "/images/dress/pants/green_long_dress.png";
    }
      
    x4.src = "/images/dress/shoes/shoes.png";
  } 
  else if (weatherobj.temp.day > 17 && weatherobj.temp.day <= 20) {
    x1.src = "/images/dress/tops/long_sleeve.png"; 
    x3.src = "/images/dress/pants/pant.png";
    x4.src = "/images/dress/shoes/shoes.png";
  } 
  else if (weatherobj.temp.day > 15 && weatherobj.temp.day <= 17){
    let t = Math.random();
    if (t > 0.5){
      x1.src = "/images/dress/tops/long_sleeve.png"; 
    }
    else{
      x1.src = "/images/dress/tops/sweater.png";
    }
    x3.src = "/images/dress/pants/pant.png";
    x4.src = "/images/dress/shoes/shoes.png";
  } 
  else if (weatherobj.temp.day > 10 && weatherobj.temp.day <= 15){
  let t = Math.random();
    if (t > 0.5){
      x1.src = "/images/dress/tops/long_sleeve.png"; 
    }
    else{
      x1.src = "/images/dress/tops/sweater.png";
    }

    x2.src = "/images/dress/coats/trench_coat.png";
    el.appendChild(x2);

    x3.src = "/images/dress/pants/pant.png";
    x4.src = "/images/dress/shoes/boots.png";

    x5.src = "/images/dress/accessories/scarf.png";
    el.appendChild(x5);
    x5.src = "/images/dress/accessories/gloves.png";
    el.appendChild(x5);
    x5.src = "/images/dress/accessories/hat.png";
    el.appendChild(x5);
    x5.src = "/images/dress/accessories/binnie.png";
    el.appendChild(x5);
  } 
  else if (weatherobj.temp.day <= 10){
    let t = Math.random();
    if (t > 0.5){
      x1.src = "/images/dress/tops/long_sleeve.png"; 
    }
    else{
      x1.src = "/images/dress/tops/sweater.png";
    }
    x2.src = "/images/dress/coats/puffer_jacket.png";
    el.appendChild(x2);
    x3.src = "/images/dress/pants/pant.png";
    x4.src = "/images/dress/shoes/boots.png";
    
    x5.src = "/images/dress/accessories/scarf.png";
    el.appendChild(x5);
    x5.src = "/images/dress/accessories/gloves.png";
    el.appendChild(x5);
    x5.src = "/images/dress/accessories/hat.png";
    el.appendChild(x5);
    x5.src = "/images/dress/accessories/binnie.png";
    el.appendChild(x5);
  }

  if (weacon == "Clear"){
    x5.src = "/images/dress/accessories/sunglasses.png";
    el.appendChild(x5);
  }

  if (weacon == "Rain" || weacon == "Drizzle"){
    x2.src = "/images/dress/coats/raincoat.png";
    el.appendChild(x2);
    x4.src = "/images/dress/shoes/rain_shoes.png";
  }

    el.appendChild(x1); //show tops layer. 
    el.appendChild(x3); //show pants layer.
    el.appendChild(x4); //show shoes layer.

  document.getElementById('d'+i).appendChild(el); // show dress pic.

}

// This script is used to call the OpenAI API and get a response based on the weather forecast.
async function callOpenAI(i,weatherobj) {
  //promptText = " "+JSON.stringify(weatherobj);
  const response = await fetch("https://www.dressforecast.com/api/openai/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "model": "gpt-4o-mini",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "As a fusion expert. Give me the dressing suggestion which is less than 50 tokens base on the weather forecast. Only dressing suggestion, no weather conditions, no temperatures. Here is the weather forecast from Open Weather API."
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": JSON.stringify(weatherobj)
            }
          ]
        }],
      "text": {
        "format": {
          "type": "text"
        }
      },
      "reasoning": {},
      "tools": [],
      "temperature": 1,
      "max_output_tokens": 100,
      "top_p": 0.75,
      "store": false
    }),
  });

  const data = await response.json();

  let el = document.createElement('div');
  el.classList.add('dress_content');

  el.textContent = data.output[0].content[0].text;

  document.getElementById("d"+i).appendChild(el);
  
}

// Show weather animation of sun.
function showSun(d){
    let sun = document.createElement('div');
    sun.classList.add('sun');

    const x = document.createElement('img');
    let wd = 80;
    x.style.width = `${wd}px`; // Random sun's size
    x.style.height = `${wd}px`;
    x.src="/images/icons/01d.png";

    sun.appendChild(x);
    sun.style.position = 'absolute';
    sun.style.left = `${(document.body.clientWidth-1000)/2 + 200*d+140}px`
    sun.style.top = `240px`; 

    document.querySelector('#d'+ d + '  .weather').appendChild(sun);
}

// Show weather animation of sunray.
function showRays(d){
    let ray = document.createElement('div');
    ray.classList.add('sunray');

    let x = document.createElement('img');
    let wd = Math.random() * 10 + 50;
    x.style.width = `${wd}px`; // Random sunray's size
    x.style.height = `${wd}px`;
    x.src="images/sunrays.png";

    ray.appendChild(x);

    var l = Math.random(d) * 90; // random sunray angle

    //ray.style.setProperty('--dynamic-angle', `${l}`);  // change angle to animation position
    ray.style.setProperty('--dynamic-x', `${-300*(Math.cos(l*Math.PI/180))}px`);  // change angle to animation position
    ray.style.setProperty('--dynamic-y', `${300*(Math.sin(l*Math.PI/180))}px`);

    ray.style.left = `${(document.body.clientWidth-1000)/2 + 200*d+150}px`; //random sunray position
    ray.style.top = `250px`; 

    ray.style.animationDuration = `5s`; // Randomize animation duration

    document.querySelector('#d'+ d + '  .weather').appendChild(ray);
    
    // Remove comet after animation completes
    setTimeout(() => {
      ray.remove();
  }, 4000);
  }


// Show weather animation of cloud
function showCloud(d) {
  let cloud = document.createElement('div');
  cloud.classList.add('clouds'); // Ensure this matches your CSS class name
  
  let x = document.createElement('img');
  let wd = Math.random() * 10 + 60;
  x.style.width = `${wd+30}px`; // Random cloud size
  x.style.height = `${wd+20}px`;
  x.src="/images/icons/03d.png";

  cloud.appendChild(x);
  cloud.style.position = 'absolute';
  cloud.style.left = `${(document.body.clientWidth-1000)/2 + 200*d+50 + Math.random() * 50}px`; // Random cloud position
  cloud.style.top = `${Math.random() * 200+160}px`; 
  cloud.style.animationName = `clouds`; //@keyframes in css
  cloud.style.animationIterationCount = `1`;
  //cloud.style.animationDuration = `${Math.random() * 5 + 2}s`; // Randomize animation duration
  cloud.style.animationDuration = `5s`; // Randomize animation duration
  
  document.querySelector('#d'+ d + ' .weather').appendChild(cloud);
  // Remove comet after animation completes
  setTimeout(() => {
    cloud.remove();
}, 4000);
}

//show weather animation of rain.
function showRain(d){ 
  let rain = document.createElement('div');
  rain.classList.add('rain');

  let x = document.createElement('img');
  let wd = Math.random() * 5+5;
  x.style.width = `${wd}px`; // Random rain size
  x.style.height = `${wd}px`;
  x.src="images/raindrop.png";

  rain.appendChild(x);

  rain.style.position= 'absolute';
  rain.style.left = `${(document.body.clientWidth-1000)/2 + 200*d + Math.random() * 200}px`; // Random rain position
  rain.style.top = `180px`;
  rain.style.animationName = `raindrops`;
  rain.style.animationIterationCount = `1`;
  //rain.style.animationDuration = `${Math.random() * 10}s`; // Randomize animation duration
  rain.style.animationDuration = `5s`;

  document.querySelector('#d'+ d + '  .weather').appendChild(rain);
  // Remove comet after animation completes
  setTimeout(() => {
    rain.remove();
}, 4000);
}

//show weather animation of rain.
function showThunderstorm(d){ 
  let thunder = document.createElement('div');
  thunder.classList.add('thunderstorm');

  let x = document.createElement('img');
  let wd = Math.random() * 5+5;
  x.style.width = `${wd}px`; // Random rain size
  x.style.height = `${wd}px`;
  x.src="/images/raindrop.png";

  thunder.appendChild(x);

  thunder.style.position= 'absolute';
  thunder.style.left = `${(document.body.clientWidth-1000)/2 + 200*d + Math.random() * 200}px`; // Random rain position
  thunder.style.top = `180px`;
  thunder.style.animationName = `raindrops`;
  thunder.style.animationIterationCount = `1`;
  //rain.style.animationDuration = `${Math.random() * 10}s`; // Randomize animation duration
  thunder.style.animationDuration = `5s`;

  document.querySelector('#d'+ d + '  .weather').appendChild(thunder);
  // Remove comet after animation completes
  setTimeout(() => {
    thunder.remove();
}, 4000);
}

//show weather animation of snow.
function showSnow(d){
  let snow = document.createElement('div');
  snow.classList.add('snow');

  let x = document.createElement('img');
  let wd = Math.random() * 10+20;
  x.style.width = `${wd}px`; // Random snow size
  x.style.height = `${wd}px`;
  x.src="images/snowflake.png";

  snow.appendChild(x);

  snow.style.position= 'absolute';
  snow.style.left = `${(document.body.clientWidth-1000)/2 + 200*d + Math.random() * 200}px`; // Random rain position
  snow.style.top = `240px`;
  snow.style.animationName = `snowflakes`;
  snow.style.animationIterationCount = `1`;
  snow.style.animationDuration = `5s`; // Randomize animation duration

  document.querySelector('#d'+ d + '  .weather').appendChild(snow);
  // Remove comet after animation completes
  setTimeout(() => {
    snow.remove();
}, 4000);
}

//show weather animation of mist.
function showMist(d){
  let mist = document.createElement('div');
  mist.classList.add('mists'); // Ensure this matches your CSS class name
  
  let x = document.createElement('img');
  let wd = Math.random() * 20 + 60;
  x.style.width = `${wd}px`; // Random mist size
  x.style.height = `${wd}px`;
  x.src="images/mist.png";

  mist.appendChild(x);
  mist.style.position = 'absolute';
  mist.style.left = `${(document.body.clientWidth-1000)/2 + 200*d + 100 + Math.random() * 50}px`; // Random mist position
  mist.style.top = `${Math.random() * 50+260}px`; 
  mist.style.animationName = `mists`; //@keyframes in css
  mist.style.animationIterationCount = `1`;
  mist.style.animationDuration = `${Math.random() * 5 + 2}s`; // Randomize animation duration
  
  document.querySelector('#d'+ d + '  .weather').appendChild(mist);
  // Remove comet after animation completes
  setTimeout(() => {
    mist.remove();
}, 4000);
}
