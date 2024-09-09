// Function to open the link when the "Start" button is clicked
function openChatLink() {
  window.open('https://chatgpt.com/g/g-mX4bzHXGt-dexter', '_blank');
}

// Add event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.querySelector('.chat-start-button');
  if (startButton) {
    startButton.addEventListener('click', openChatLink);
  }

  // Modal functionality
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close-btn');
  const chatInfoButton = document.querySelector('.chat-info-button');
  const tradingSimulationButton = document.querySelector('.trading-simulation-button');
  const wordOfTheDayButton = document.querySelector('.word-of-the-day-button');
  const aboutButton = document.querySelector('.about-link');
  const contactButton = document.querySelector('.contact-link');
  const homeLink = document.querySelector('.home-link');
  const simulationStartButton = document.querySelector('.simulation-start-button');
  const homeButton = document.querySelector('.home-button');

  // Show the home content when Home is clicked
  homeLink.onclick = function () {
    window.location.reload(); // Reload the page to show the default content
  };

  // Show About modal
  aboutButton.onclick = function () {
    document.getElementById('aboutModal').style.display = 'block';
  };

  // Show Contact modal
  contactButton.onclick = function () {
    document.getElementById('contactModal').style.display = 'block';
  };

  // Show the Chat with Dexter infographic modal
  chatInfoButton.onclick = function () {
    document.getElementById('chatInfographicModal').style.display = 'block';
  };

  // Show the Trading Simulation infographic modal
  tradingSimulationButton.onclick = function () {
    document.getElementById('tradingSimulationModal').style.display = 'block';
  };

  // Show the Word of the Day modal when the button is clicked
  wordOfTheDayButton.onclick = function () {
    showWordOfTheDay();
    document.getElementById('wordOfTheDayModal').style.display = 'block';
  };

  // Close all modals when the close button is clicked
  closeButtons.forEach(btn => {
    btn.onclick = function () {
      modals.forEach(modal => modal.style.display = 'none');
    };
  });

  // Close modals when clicking outside of them
  window.onclick = function (event) {
    if (modals.length) {
      modals.forEach(modal => {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      });
    }
  };

  // Start simulation when the "Start" button is clicked in the Trading Simulation section
  simulationStartButton.onclick = function () {
    document.querySelectorAll('section, header, footer').forEach(element => element.style.display = 'none'); // Hide other content
    document.getElementById('simulationApp').style.display = 'flex'; // Show the simulation
    startSimulation(); // Start the simulation
  };

  // Return to home from simulation
  homeButton.onclick = function () {
    document.querySelectorAll('section, header, footer').forEach(element => element.style.display = 'block'); // Show other content
    document.getElementById('simulationApp').style.display = 'none'; // Hide the simulation
  };
});

// Show a financial market word with its in-depth meaning
function showWordOfTheDay() {
  const words = [
    { term: "Bear Market", definition: "A bear market is a market condition where prices of securities are falling or are expected to fall, typically by 20% or more from recent highs." },
    { term: "Bull Market", definition: "A bull market is a financial market of a group of securities in which prices are rising or are expected to rise." },
    { term: "Liquidity", definition: "Liquidity refers to how easily an asset, or security, can be converted into cash without affecting its market price." },
    { term: "Diversification", definition: "Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio." },
    { term: "Portfolio", definition: "A portfolio is a collection of financial investments like stocks, bonds, commodities, cash, and cash equivalents, including mutual funds and ETFs." },
    { term: "IPO", definition: "Initial Public Offering (IPO) is the process through which a private company offers shares to the public in a new stock issuance." },
    { term: "Volatility", definition: "Volatility is a statistical measure of the dispersion of returns for a given security or market index, often measured by standard deviation or variance." }
  ];

  const today = new Date().getDay(); // Get the day of the week as a number (0-6)
  const word = words[today % words.length]; // Cycle through the words array based on the day
  const wordDefinitionElement = document.getElementById('wordOfTheDayDefinition');
  wordDefinitionElement.innerHTML = `<strong>${word.term}:</strong> ${word.definition}`;
}

// Simulation JavaScript

class Stock {
    constructor(ticker, price) {
        this.ticker = ticker;
        this.price = price;
        this.priceHistory = this.generatePriceHistory();
        this.previousPrice = price;
    }

    generatePriceHistory() {
        let history = [];
        let currentPrice = this.price;
        for (let i = 0; i < 100; i++) {
            let change = (Math.random() * 0.1 - 0.05) * currentPrice;
            currentPrice += change;
            if (currentPrice < 1) currentPrice = 1;
            history.push({ time: i, price: currentPrice });
        }
        return history;
    }

    updatePrice() {
        this.previousPrice = this.price;
        let change = (Math.random() * 0.1 - 0.05) * this.price;
        this.price += change;
        if (this.price < 1) this.price = 1;
        this.priceHistory.push({ time: this.priceHistory.length, price: this.price });
    }

    getPriceChange() {
        const change = this.price - this.previousPrice;
        const changePercentage = (change / this.previousPrice) * 100;
        return { change: change.toFixed(2), changePercentage: changePercentage.toFixed(2) };
    }

    applyPressRelease(news) {
        let change;
        if (news.effect === 'positive') {
            change = (Math.random() * 0.1 + 0.05) * this.price;
        } else if (news.effect === 'negative') {
            change = (Math.random() * 0.1 - 0.15) * this.price;
        } else {
            change = (Math.random() * 0.1 - 0.05) * this.price;
        }
        this.price += change;
        if (this.price < 1) this.price = 1;
        this.priceHistory.push({ time: this.priceHistory.length, price: this.price });
        addNews(news, this.ticker);
    }
}

class Portfolio {
    constructor() {
        this.cash = 10000;
        this.stocks = {};
        this.transactionHistory = [];
        this.totalCommission = 0;
        this.initializeStocks();
        this.commissionRate = 0.018; // Updated to 1.8% commission on trades
    }

    initializeStocks() {
        gseStocks.forEach(stock => {
            this.stocks[stock.ticker] = { stock: stock, quantity: 100 }; // Initialize with 100 shares of each stock
        });
    }

    buy(stock, quantity, accepted = false) {
        let cost = stock.price * quantity;
        let commission = cost * this.commissionRate;
        let status = 'Executed';
        if (accepted) {
            this.cash += commission; // Only increase by commission if accepted
            this.stocks[stock.ticker].quantity += quantity;
            this.totalCommission += commission;
        } else if (this.cash >= (cost + commission)) {
            this.cash -= (cost + commission);
            this.stocks[stock.ticker].quantity += quantity;
            this.totalCommission += commission;
        } else {
            status = 'Not Executed';
        }
        this.transactionHistory.push({
            action: 'Buy',
            ticker: stock.ticker,
            quantity: quantity,
            price: stock.price.toFixed(2),
            commission: commission.toFixed(2),
            status: status
        });
        updateDisplay();
    }

    sell(stock, quantity, client, accepted = false) {
        let revenue = stock.price * quantity;
        let commission = revenue * this.commissionRate;
        let status = 'Executed';
        if (this.stocks[stock.ticker].quantity >= quantity && client.holdsStock(stock.ticker, quantity)) {
            this.stocks[stock.ticker].quantity -= quantity;
            if (accepted) {
                this.cash += commission; // Only increase by commission if accepted
            } else {
                this.cash += (revenue - commission);
            }
            client.reduceStock(stock.ticker, quantity);
            this.totalCommission += commission;
        } else {
            status = 'Not Executed';
        }
        this.transactionHistory.push({
            action: 'Sell',
            ticker: stock.ticker,
            quantity: quantity,
            price: stock.price.toFixed(2),
            commission: commission.toFixed(2),
            status: status
        });
        updateDisplay();
    }

    portfolioValue() {
        let total = this.cash;
        for (let stockData of Object.values(this.stocks)) {
            total += stockData.quantity * stockData.stock.price;
        }
        return total;
    }
}

class Client {
    constructor(name, accountCode, initialStocks) {
        this.name = name;
        this.accountCode = accountCode;
        this.stocks = initialStocks;
        this.messages = [];
        this.quoteAccepted = false;
    }

    addStock(ticker, quantity) {
        if (!this.stocks[ticker]) {
            this.stocks[ticker] = 0;
        }
        this.stocks[ticker] += quantity;
    }

    reduceStock(ticker, quantity) {
        if (this.stocks[ticker]) {
            this.stocks[ticker] -= quantity;
            if (this.stocks[ticker] < 0) this.stocks[ticker] = 0;
        }
    }

    holdsStock(ticker, quantity) {
        return this.stocks[ticker] && this.stocks[ticker] >= quantity;
    }

    requestTrade() {
        const action = Math.random() < 0.5 ? "buy" : "sell";
        const stockTicker = gseStocks[Math.floor(Math.random() * gseStocks.length)].ticker;
        const quantity = Math.floor(Math.random() * 10) + 1;
        const message = `I would like to ${action} ${quantity} of ${stockTicker}.`;
        this.messages.push({ sender: this.name, text: message });
        return { action, stockTicker, quantity, message };
    }

    addMessage(message) {
        this.messages.push(message);
    }
}

const gseStocks = [
    new Stock("GCB", 5.0),
    new Stock("ECOBANK", 7.0),
    new Stock("SCB", 20.0),
    new Stock("AGA", 35.0),
    new Stock("MTN", 1.0)
];

const pressReleases = {
    "GCB": [
        {"headline": "GCB reports record profits", "details": "GCB has announced record profits for the fiscal year, driven by strong loan growth and increased customer deposits. This has led to increased investor confidence.", "effect": "positive"},
        {"headline": "GCB faces major lawsuit", "details": "GCB is facing a major lawsuit over alleged regulatory violations, causing concerns among investors.", "effect": "negative"}
    ],
    "ECOBANK": [
        {"headline": "Ecobank faces regulatory fines", "details": "Ecobank has been fined by the regulatory authorities for non-compliance with certain banking regulations. This has negatively impacted the bank's reputation and stock price.", "effect": "negative"},
        {"headline": "Ecobank expands digital services", "details": "Ecobank has successfully expanded its digital banking services, attracting a large number of new customers and boosting revenues.", "effect": "positive"}
    ],
    "SCB": [
        {"headline": "SCB announces new CEO", "details": "SCB has appointed a new CEO, who is expected to bring innovative strategies to boost the bank's performance. Investors are optimistic about the future.", "effect": "positive"},
        {"headline": "SCB under investigation", "details": "SCB is under investigation for potential regulatory breaches, causing uncertainty among investors.", "effect": "negative"}
    ],
    "AGA": [
        {"headline": "AGA to expand mining operations", "details": "AGA has announced plans to expand its mining operations in Ghana. The expansion is expected to increase gold production and revenue significantly.", "effect": "positive"},
        {"headline": "AGA faces labor strikes", "details": "AGA is facing labor strikes at its key mining sites, leading to disruptions in production and concerns over future output.", "effect": "negative"}
    ],
    "MTN": [
        {"headline": "MTN faces increased competition", "details": "MTN is facing increased competition from new entrants in the telecom market, leading to concerns about its market share and future growth prospects.", "effect": "negative"},
        {"headline": "MTN reports subscriber growth", "details": "MTN has reported significant growth in its subscriber base, driven by new service offerings and competitive pricing.", "effect": "positive"}
    ]
};

const portfolio = new Portfolio();
const clients = [
    new Client("Client A", "A001", {"GCB": 50, "ECOBANK": 30, "SCB": 20, "AGA": 10, "MTN": 0}),
    new Client("Client B", "B001", {"GCB": 0, "ECOBANK": 100, "SCB": 0, "AGA": 50, "MTN": 20}),
    new Client("Client C", "C001", {"GCB": 70, "ECOBANK": 0, "SCB": 30, "AGA": 0, "MTN": 10}),
    new Client("Tradexter Securities", "TRD001", {"GCB": 30, "ECOBANK": 50, "SCB": 10, "AGA": 20, "MTN": 40})
];

const stockList = document.getElementById('stockList');
const marketBookBody = document.getElementById('marketBookBody');
const clientRequestList = document.getElementById('clientRequestList');
const chatMessages = document.getElementById('chatMessages');
const cashElement = document.getElementById('cash');
const portfolioValueElement = document.getElementById('portfolioValue');
const totalCommissionElement = document.getElementById('totalCommission');
const stockChart = document.getElementById('stockChart').getContext('2d');
let chart;
let currentClient = null;
let selectedTrader = null;
const traderChats = {
    "LDM 1": [],
    "LDM 2": [],
    "LDM 3": []
};
let currentClientName = null;

function updateDisplay() {
    stockList.innerHTML = '';
    for (let stock of gseStocks) {
        let listItem = document.createElement('li');
        const { change, changePercentage } = stock.getPriceChange();
        const changeColor = change >= 0 ? 'green' : 'red';
        listItem.innerHTML = 
            `<span class="ticker">${stock.ticker}</span>
            <span class="price">GH₵${stock.price.toFixed(2)}</span>
            <span class="change" style="color: ${changeColor};">${change} (${changePercentage}%)</span>`;
        listItem.addEventListener('click', () => showStockHistory(stock.ticker));
        stockList.appendChild(listItem);
    }

    marketBookBody.innerHTML = '';
    for (let transaction of portfolio.transactionHistory) {
        let row = document.createElement('tr');
        row.innerHTML = 
            `<td>${transaction.action}</td>
            <td>${transaction.ticker}</td>
            <td>${transaction.quantity}</td>
            <td>GH₵${transaction.price}</td>
            <td>GH₵${transaction.commission}</td>
            <td>${transaction.status}</td>`;
        marketBookBody.appendChild(row);
    }

    cashElement.innerText = portfolio.cash.toFixed(2);
    portfolioValueElement.innerText = portfolio.portfolioValue().toFixed(2);
    totalCommissionElement.innerText = portfolio.totalCommission.toFixed(2);
}

function displayClientRequest(client, request) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${client.name}:</strong> ${request.message}`;
    clientRequestList.appendChild(listItem);

    // Remove oldest request if more than 6
    if (clientRequestList.childNodes.length > 6) {
        clientRequestList.removeChild(clientRequestList.firstChild);
    }
}

function getClientByCode(code) {
    return clients.find(client => client.accountCode === code);
}

function buyStock() {
    const clientCode = document.getElementById('clientCode').value.trim();
    const stockTicker = document.getElementById('actionStock').value.trim();
    const quantity = parseInt(document.getElementById('actionQuantity').value);
    const stock = gseStocks.find(stock => stock.ticker === stockTicker);
    const client = getClientByCode(clientCode);

    if (!client) {
        alert("Invalid client code.");
        return;
    }

    if (stock && quantity > 0) {
        portfolio.buy(stock, quantity, client.quoteAccepted);
        client.addStock(stockTicker, quantity);
    } else {
        alert("Invalid stock or quantity.");
    }
}

function sellStock() {
    const clientCode = document.getElementById('clientCode').value.trim();
    const stockTicker = document.getElementById('actionStock').value.trim();
    const quantity = parseInt(document.getElementById('actionQuantity').value);
    const stock = gseStocks.find(stock => stock.ticker === stockTicker);
    const client = getClientByCode(clientCode);

    if (!client) {
        alert("Invalid client code.");
        return;
    }

    if (stock && quantity > 0 && client.holdsStock(stockTicker, quantity)) {
        portfolio.sell(stock, quantity, client, client.quoteAccepted);
    } else {
        alert("Invalid stock, quantity, or insufficient shares.");
    }
}

function simulateTraderMessages() {
    // Example messages tuned to the stocks and currency in simulation
    const traderMessages = [
        { trader: "LDM 1", message: "Looking to sell 100 shares of GCB at GH₵5.10 each. Interested?" },
        { trader: "LDM 2", message: "Can you do GH₵5.00 per share instead?" },
        { trader: "LDM 1", message: "How about GH₵5.05? It's a fair middle ground." },
        { trader: "LDM 2", message: "Deal at GH₵5.05." },
    ];

    let messageIndex = 0;

    function sendNextMessage() {
        if (messageIndex < traderMessages.length) {
            const msg = traderMessages[messageIndex];
            traderChats[msg.trader].push(`${msg.trader}: ${msg.message}`);
            // Show bell icon when a trader message comes in
            document.getElementById(`bell-${msg.trader.toLowerCase().replace(' ', '-')}`).style.display = 'inline';
            messageIndex++;
        }
    }

    // Trigger the next message only after a user response
    chatMessages.addEventListener('DOMNodeInserted', () => {
        if (chatMessages.lastElementChild.innerText.startsWith('You:')) {
            sendNextMessage();
        }
    });

    sendNextMessage(); // Start with the first message
}

function showStockHistory(stockTicker) {
    const stock = gseStocks.find(stock => stock.ticker === stockTicker);
    if (stock) {
        const labels = stock.priceHistory.map(item => item.time);
        const data = stock.priceHistory.map(item => item.price);
        const lineChartData = {
            labels: labels,
            datasets: [{
                label: `${stock.ticker} Price`,
                data: data,
                borderColor: '#3e95cd', // Static color
                fill: false
            }]
        };
        if (chart) {
            chart.destroy();
        }
        chart = new Chart(stockChart, {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price (GH₵)'
                        }
                    }
                }
            }
        });
    }
}

function sendTraderMessage() {
    const traderMessage = document.getElementById('traderChatInput').value.trim();
    if (traderMessage && selectedTrader) {
        traderChats[selectedTrader].push(`You: ${traderMessage}`);
        document.getElementById('traderChatInput').value = '';

        // Simulate immediate response from trader based on negotiation
        setTimeout(() => {
            const response = getTraderResponse(traderMessage);
            traderChats[selectedTrader].push(`${selectedTrader}: ${response}`);
            displayChatHistory(selectedTrader);
        }, 1000); // Delay response by 1 second
    } else {
        alert("Please select a trader to chat with.");
    }
}

function getTraderResponse(message) {
    const priceRegex = /GH₵\d+(\.\d{1,2})?/; // Matches prices in GHC format
    const userResponse = message.match(priceRegex);

    if (userResponse) {
        const suggestedPrice = parseFloat(userResponse[0].replace('GH₵', ''));
        if (Math.random() < 0.5) { // 50% chance of LDM agreeing
            return 'Deal';
        } else {
            const counterPrice = (suggestedPrice * (1 + (Math.random() * 0.05 - 0.025))).toFixed(2); // ±2.5% range
            return `How about GH₵${counterPrice}?`;
        }
    } else if (message.toLowerCase().includes('yes')) {
        return 'Deal';
    } else {
        return 'Please provide a price in GH₵ to continue.';
    }
}

function selectTrader(trader) {
    selectedTrader = trader;
    // Hide bell icon when you click on trader
    document.getElementById(`bell-${trader.toLowerCase().replace(' ', '-')}`).style.display = 'none';
    displayChatHistory(trader);
}

function displayChatHistory(trader) {
    chatMessages.innerHTML = traderChats[trader].map(msg => `<div>${msg}</div>`).join('');
}

function sendQuote() {
    const bid = document.getElementById('clientBid').value.trim();
    const offer = document.getElementById('clientOffer').value.trim();
    if (!bid || !offer) {
        alert("Please enter both bid and offer.");
        return;
    }

    const client = clients.find(c => c.name === currentClientName);
    if (client) {
        // Simulate client response
        const accepted = Math.random() > 0.5; // 50% chance of acceptance
        client.quoteAccepted = accepted;
        document.getElementById('statusDisplay').innerText = accepted ? 'ACCEPTED - Go ahead and execute' : 'REJECTED';
    }
}

function selectClient(clientName, clientCode) {
    currentClientName = clientName;
    document.getElementById('clientCode').value = clientCode;
    document.getElementById('selectedClient').innerText = `Selected Client: ${clientName}`;
}

function addNews(news, ticker) {
    const newsList = document.getElementById('pressReleaseList');
    const listItem = document.createElement('li');
    const time = new Date();
    listItem.classList.add('blink');
    listItem.innerHTML = 
        `<strong>${ticker}:</strong> ${news.headline}
        <div class="news-details">${news.details}</div>
        <small>${formatTime(time)}</small>`;

    newsList.insertBefore(listItem, newsList.firstChild);

    // Remove blinking effect after animation ends
    setTimeout(() => listItem.classList.remove('blink'), 1000);

    // Remove oldest news if there are more than 6
    if (newsList.childNodes.length > 6) {
        newsList.removeChild(newsList.lastChild);
    }
}

function formatTime(time) {
    const secondsAgo = Math.floor((new Date() - time) / 1000);
    return secondsAgo + 's ago';
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const countdown = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(countdown);
            endSimulation();
        }
    }, 1000);
}

function endSimulation() {
    // Calculate performance statistics and ratings
    const speed = Math.floor(Math.random() * 20) + 80; // Randomized for example
    const spreads = Math.floor(Math.random() * 20) + 80;
    const customerSatisfaction = Math.floor(Math.random() * 20) + 80;
    const commission = Math.floor(Math.random() * 20) + 80;

    const overallRating = Math.floor((speed + spreads + customerSatisfaction + commission) / 4);

    // Show performance summary
    alert(
        `Simulation Ended!\n
        Performance Summary:\n
        Speed: ${speed}/100\n
        Good Spreads: ${spreads}/100\n
        Customer Satisfaction: ${customerSatisfaction}/100\n
        Commission: ${commission}/100\n
        Overall Rating: ${overallRating}/100`
    );
}

function startSimulation() {
    // Initialize simulation
    const initialStock = gseStocks[0]; // Display first company by default
    showStockHistory(initialStock.ticker);

    // Show a news item immediately on start
    const initialNewsStock = gseStocks[Math.floor(Math.random() * gseStocks.length)];
    const initialNews = pressReleases[initialNewsStock.ticker][Math.floor(Math.random() * pressReleases[initialNewsStock.ticker].length)];
    initialNewsStock.applyPressRelease(initialNews);

    // Simulate trader messages on start
    simulateTraderMessages();

    // Display client requests sequentially
    clients.forEach((client, index) => {
        setTimeout(() => {
            const request = client.requestTrade();
            displayClientRequest(client, request);
        }, index * 10000); // 10-second interval for each request
    });

    // Start countdown timer for 30 minutes
    const countdownTimer = document.getElementById('timer');
    startTimer(1800, countdownTimer); // 1800 seconds = 30 minutes
}

function toggleMode() {
    document.body.classList.toggle('dark-mode');
    // Additional adjustments for dark mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.querySelectorAll('*::selection').forEach(el => {
        el.style.backgroundColor = isDarkMode ? '#555' : '#f0f2f5';
        el.style.color = isDarkMode ? '#f0f2f5' : '#333';
    });
    // Adjust the news details text color in dark mode
    document.querySelectorAll('.news-details').forEach(el => {
        el.style.backgroundColor = isDarkMode ? '#666' : '#f9f9f9';
        el.style.color = isDarkMode ? '#fff' : '#000';
    });
}

setInterval(() => {
    for (let stock of gseStocks) {
        stock.updatePrice();
    }
    updateDisplay();
}, 5000); // Update stock prices every 5 seconds

setInterval(() => {
    if (Math.random() < 0.15) { // 15% chance of a press release
        const stock = gseStocks[Math.floor(Math.random() * gseStocks.length)];
        const news = pressReleases[stock.ticker][Math.floor(Math.random() * pressReleases[stock.ticker].length)];
        stock.applyPressRelease(news);
    }
}, 25000); // 25 seconds interval for press releases

setInterval(() => {
    updateDisplay();
}, 20000); // 20 seconds interval for updating the display
