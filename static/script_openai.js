// This script is used to call the OpenAI API and get a response based on the weather forecast.
async function callOpenAI(promptText) {
  const response = await fetch("http://www.dressforecast.com/api/openai/v1/responses", {
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
              "text": "As a fusion expert. Give me the daily dressing suggestions base on the weather forecast.\nThis is the weather forecast from Open Weather API. \n{\"city\":{\"id\":2147714,\"name\":\"Sydney\",\"coord\":{\"lon\":151.2073,\"lat\":-33.8679},\"country\":\"AU\",\"population\":1000000,\"timezone\":39600},\"cod\":\"200\",\"message\":1.1897653,\"cnt\":5,\"list\":[{\"dt\":1743642000,\"sunrise\":1743624504,\"sunset\":1743666500,\"temp\":{\"day\":25.16,\"min\":14.8,\"max\":27.69,\"night\":20.08,\"eve\":22.2,\"morn\":15.01},\"feels_like\":{\"day\":24.72,\"night\":19.79,\"eve\":21.96,\"morn\":14.81},\"pressure\":1010,\"humidity\":38,\"weather\":[{\"id\":800,\"main\":\"Clear\",\"description\":\"sky is clear\",\"icon\":\"01d\"}],\"speed\":4.27,\"deg\":98,\"gust\":5.33,\"clouds\":0,\"pop\":0},{\"dt\":1743728400,\"sunrise\":1743710948,\"sunset\":1743752820,\"temp\":{\"day\":22.16,\"min\":17.88,\"max\":23.13,\"night\":20.39,\"eve\":21.83,\"morn\":18.11},\"feels_like\":{\"day\":22.18,\"night\":20.52,\"eve\":21.79,\"morn\":17.91},\"pressure\":1017,\"humidity\":67,\"weather\":[{\"id\":802,\"main\":\"Clouds\",\"description\":\"scattered clouds\",\"icon\":\"03d\"}],\"speed\":5.09,\"deg\":81,\"gust\":7.41,\"clouds\":34,\"pop\":0},{\"dt\":1743814800,\"sunrise\":1743797392,\"sunset\":1743839140,\"temp\":{\"day\":22.89,\"min\":16.76,\"max\":22.89,\"night\":17.97,\"eve\":19.84,\"morn\":17.16},\"feels_like\":{\"day\":22.07,\"night\":17.57,\"eve\":19.45,\"morn\":16.86},\"pressure\":1016,\"humidity\":32,\"weather\":[{\"id\":800,\"main\":\"Clear\",\"description\":\"sky is clear\",\"icon\":\"01d\"}],\"speed\":7,\"deg\":153,\"gust\":10.25,\"clouds\":0,\"pop\":0.05},{\"dt\":1743901200,\"sunrise\":1743883836,\"sunset\":1743925461,\"temp\":{\"day\":20.81,\"min\":15.53,\"max\":24.66,\"night\":19.83,\"eve\":24.48,\"morn\":16.52},\"feels_like\":{\"day\":20.07,\"night\":18.7,\"eve\":23.85,\"morn\":16.19},\"pressure\":1017,\"humidity\":43,\"weather\":[{\"id\":800,\"main\":\"Clear\",\"description\":\"sky is clear\",\"icon\":\"01d\"}],\"speed\":4.32,\"deg\":295,\"gust\":8.57,\"clouds\":0,\"pop\":0},{\"dt\":1743987600,\"sunrise\":1743970281,\"sunset\":1744011782,\"temp\":{\"day\":21.35,\"min\":16.29,\"max\":21.35,\"night\":18.33,\"eve\":19.68,\"morn\":16.65},\"feels_like\":{\"day\":20.59,\"night\":17.97,\"eve\":19.19,\"morn\":15.49},\"pressure\":1019,\"humidity\":40,\"weather\":[{\"id\":800,\"main\":\"Clear\",\"description\":\"sky is clear\",\"icon\":\"01d\"}],\"speed\":6.51,\"deg\":150,\"gust\":12.87,\"clouds\":0,\"pop\":0}]}"
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
      "max_output_tokens": 1024,
      "top_p": 0.75,
      "store": false
    }),
  });

  const data = await response.json();
  document.getElementById("output").innerText = data.output[0].content[0].text;
}

callOpenAI("This is a test.");