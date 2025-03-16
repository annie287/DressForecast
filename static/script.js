document.getElementById('btn-sun').addEventListener('click', async () => {
  showSun(`1`); 
  s = setInterval(showRays, 1000,`1`); // Add a new sunray every 1000ms
});

document.getElementById('btn-cloud').addEventListener('click', async () => {
  c = setInterval(showCloud, 1000,`2`); // Add a new Cloud every 1000ms

});

document.getElementById('btn-rain').addEventListener('click', async () => {
  r = setInterval(showRain, 100,`3`); // Add a new rain every 1000ms
});

document.getElementById('btn-snow').addEventListener('click', async () => {
  sn = setInterval(showSnow, 600,`4`); // Add a new snow every 1000ms
});

document.getElementById('btn-mist').addEventListener('click', async () => {
  mi = setInterval(showMist, 1000,`5`); // Add a new mist every 1000ms
});

var dayweathertag = [];

document.getElementById('city').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') { // 或者 event.keyCode === 13 (对于旧版浏览器)
      event.preventDefault(); // 阻止默认行为（如果需要）

      var url = "/weather?q=" + document.getElementById('city').value;
      var formatter = new Intl.DateTimeFormat("en-US",{month: "short", day:"numeric",});

      // clear all weather animations
      for (i in dayweathertag){
        clearInterval(dayweathertag[i]); 
      }

      var tes = document.getElementById('test');
      
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          document.querySelector("#main").textContent="";
          var weatherobj = JSON.parse(xhr.responseText);
          tes.textContent = "";

          // show city background
          el = document.getElementById('main');
          let cityName = document.getElementById('city').value;
          cityName = cityName.toLowerCase();
          
          const citylists = ['sydney','melbourn'];
          if (citylists.includes(cityName)){
            el.style.backgroundImage = `url("/images/city/${cityName}.jpg")`;
          }
          else {
            el.style.backgroundImage = "url('/images/city/default.jpg')";
          }

          // show weather animation for each day 
          for (i in weatherobj.list){

            let el = document.createElement('div');
            el.classList.add('day-card');
            el.id = 'd'+i;
            document.querySelector("#main").appendChild(el);

            var dt = weatherobj.list[i].dt;
            dt = dt * 1000;

            var sp = weatherobj.list[i].speed;
            var cl = weatherobj.list[i].clouds;
            var ra = weatherobj.list[i].rain;
            var sn = weatherobj.list[i].snow;
            var pop = weatherobj.list[i].pop;

            el = document.createElement('div');
            el.classList.add('weather');
            document.querySelector('#d'+i).appendChild(el);

            //test dymanic add weather information.
            el = document.createElement('div');
            el.classList.add('day');
            el.textContent = formatter.format(new Date(dt));
            document.querySelector('#d'+i).appendChild(el);


            el = document.createElement('div');
            el.classList.add('tday');
            el.textContent = 'Day  :' + weatherobj.list[i].temp.day + '°C';
            document.querySelector('#d'+i).appendChild(el);

            el = document.createElement('div');
            el.classList.add('tmin');
            el.textContent = 'min  :' + weatherobj.list[i].temp.min + '°C';
            document.querySelector('#d'+i).appendChild(el);

            el = document.createElement('div');
            el.classList.add('tmax');
            el.textContent = 'max  :' + weatherobj.list[i].temp.max + '°C';
            document.querySelector('#d'+i).appendChild(el);

            el = document.createElement('div');
            el.classList.add('tnight');
            el.textContent = 'night:' + weatherobj.list[i].temp.night + '°C';
            document.querySelector('#d'+i).appendChild(el);

            el = document.createElement('div');
            el.classList.add('tmorn');
            el.textContent = 'morn :' + weatherobj.list[i].temp.morn + '°C';
            document.querySelector('#d'+i).appendChild(el);

            // show weather animations
            var wea = weatherobj.list[i].weather[0].id;
            if (wea == 500)
            {
              dayweathertag[i] = setInterval(showRain, 1000,i); // Add a new rain every 1000ms
            } else
            if (wea == 501)
            {
              dayweathertag[i] = setInterval(showRain, 500,i); // Add a new rain every 1000ms
            } else
            if (wea == 502)
            {
              dayweathertag[i] = setInterval(showRain, 200,i); // Add a new rain every 1000ms
            } else
            if (wea == 503)
            {
              dayweathertag[i] = setInterval(showRain, 50,i); // Add a new rain every 1000ms
            } else
            if (wea == 504)
            {
              dayweathertag[i] = setInterval(showRain, 10,i); // Add a new rain every 1000ms
            } else
            if (wea >=600 && wea<700)
            {
              dayweathertag[i] = setInterval(showSnow, 1000, i); // Add a new snow every 1000ms
            } else
            if (wea >=700 && wea<800)
            {
              dayweathertag[i] = setInterval(showMist, 1000, i); // Add a new mist every 1000ms
            }else
            if (wea ===800)
            {
              showSun(i);
              dayweathertag[i] = setInterval(showRays, 1000, i)
            }else 
            if (wea >800 && wea<900)
            {
              dayweathertag[i] = setInterval(showCloud, 1000, i); // Add a new Cloud every 1000ms
            }
            
            // show dress suggest.
            showDressForecast(i, weatherobj.list[i]);

          }
          
        } else {
          //tes.textContent = xhr.responseText;
        }

      };
      
      xhr.onerror = function () {
          console.error('There was a network error.');
      };
      
      xhr.send();

  }
});

document.getElementById('btn-clear').addEventListener('click', async () => {
  clearInterval(s);
  clearInterval(c);
  clearInterval(r);
  clearInterval(sn);
  clearInterval(mi);
});

// Dress forecast by  temperature
function showDressForecast(i,weatherobj) {

  // show dress suggest
  var el = document.createElement('div');
  el.classList.add('dress_pic');

  // show base people kayer
  let x = document.createElement('img');
  x.classList.add('layer');
  x.style.zIndex = 1;
  x.src = "images/woman1.png";
  el.appendChild(x);

  //show cloths layer.

  x = document.createElement('img');
  x.classList.add('layer');
  x.style.zIndex = 2;

	if (weatherobj.temp.day > 35) {
    // Randomly choose between "Short-sleeve Top" and "Short Skirt"
    let t = Math.random();
    if (t > 0.5)
      x.src = "images/dress/t-shirt.png";// outfit = "t-shirt";
    else 
      x.src = "images/dress/skirt.png"; // outfit = "short-skirt";
  } else if (weatherobj.temp.day > 20 && weatherobj.temp.day <= 35) {
      x.src = "images/dress/long-dress.png";
  } else if (weatherobj.temp.day > 10 && weatherobj.temp.day <= 20) {
      x.src = "images/dress/pant.png"; // outfit = "Long-sleeved Top, Long Pants, and a Coat";
  } else {
      x.src = "images/dress/puffer-jacket.png";  // outfit = "Long-sleeved Top, Long Pants, and a Down Jacket";
  }

  el.appendChild(x);

  //show pants layer.

  //show coat layer.

  //show shoes layer.

  //show accessory layer.

  //show umbrella
  if (weatherobj.temp.rain > 35) {
    x = document.createElement('img');
    x.classList.add('layer');
    x.style.zIndex = 3;
    x.src = "images/umbrella.png";
    el.appendChild(x);
  }


  
  document.querySelector('#d'+i).appendChild(el);

}

function showSun(d){
    let sun = document.createElement('div');
    sun.classList.add('sun');

    const x = document.createElement('img');
    let wd = 80;
    x.style.width = `${wd}px`; // Random sun's size
    x.style.height = `${wd}px`;
    x.src="images/sun2.png";

    sun.appendChild(x);
    sun.style.position = 'absolute';
    sun.style.left = `${(document.body.clientWidth-1000)/2 + 200*d+140}px`
    sun.style.top = `240px`; 

    document.querySelector('#d'+ d + '  .weather').appendChild(sun);
}

// Show sun weather
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


// Show cloud weather
function showCloud(d) {
  let cloud = document.createElement('div');
  cloud.classList.add('clouds'); // Ensure this matches your CSS class name
  
  let x = document.createElement('img');
  let wd = Math.random() * 10 + 60;
  x.style.width = `${wd+30}px`; // Random cloud size
  x.style.height = `${wd+20}px`;
  x.src="images/clouds.png";

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

//show rain weather
function showRain(d){ //d=1,2,3,4,5
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

//show snow weather
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

//show mist weather
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
