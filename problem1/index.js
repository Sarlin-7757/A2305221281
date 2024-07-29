
const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

const port = 3000;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIyMjQzNzc5LCJpYXQiOjE3MjIyNDM0NzksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImYwMjZiYjYzLTlhMmMtNDAxYy1iNDM1LWMxOTAwMzFkODY0ZSIsInN1YiI6InNhcmFuc2gubGluZ3dhbEBzLmFtaXR5LmVkdSJ9LCJjb21wYW55TmFtZSI6IkFNSVRZIFVOSVZFUlNJVFRZIE5PSURBIiwiY2xpZW50SUQiOiJmMDI2YmI2My05YTJjLTQwMWMtYjQzNS1jMTkwMDMxZDg2NGUiLCJjbGllbnRTZWNyZXQiOiJKRmlPamltTWF4REdwdE1EIiwib3duZXJOYW1lIjoiU2FyYW5zaCBMaW5nd2FsIiwib3duZXJFbWFpbCI6InNhcmFuc2gubGluZ3dhbEBzLmFtaXR5LmVkdSIsInJvbGxObyI6IkEyMzA1MjIxMjgxIn0.FKM0mVYHuQKfIMDJX1CbXx7dQ4XCP0SWLqYgDhs9NHA"
   

const windowSize = 10;

let windowCurrState = [];

async function fetchNumbers(numberid) {
    try {
        const response = await axios.get(`http://20.244.56.144/test/${numberid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching numbers:", error);
        return [];
    }
}

function calculateAverage(numbers) {
    if (numbers.length === 0) {
        return 0;
    }
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

app.get("/numbers/:numberId", async (req, res) => {
    const numberId = req.params.numberId;
    let type;
    // Fetch numbers from the third-party server
    if (numberId === "e") {
        type = "even";
    } else if (numberId === "p") {
        type = "primes";
    } else if (numberId === "f") {
        type = "fibo";
    } else if (numberId === "r") {
        type = "rand";
    }
    const numbers = await fetchNumbers(type);

    // Updating the window state
    const windowPrevState = [...windowCurrState];
    windowCurrState = [...windowCurrState, ...numbers.numbers];

    windowCurrState = windowCurrState.slice(-windowSize);

    const average = calculateAverage(windowCurrState);

    const response = {
        windowPrevState,
        windowCurrState,
        numbers: numbers.numbers,
        avg: average,
    };

    res.json(response);
});

app.listen(port, () => {
    console.log(`Average Calculator microservice listening on port ${port}`);
});
