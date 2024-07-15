document.addEventListener('DOMContentLoaded', function() {
  const customers = [
    { id: 1, name: 'Ahmed Ali' },
    { id: 2, name: 'Aya Elsayed' },
    { id: 3, name: 'Mina Adel' },
    { id: 4, name: 'Sarah Reda' },
    { id: 5, name: 'Mohamed Sayed' },
    { id: 6, name: 'Layla Hassan' },
    { id: 7, name: 'Omar Youssef' },
    { id: 8, name: 'Nour El-Deen' },
    { id: 9, name: 'Hana Khaled' },
    { id: 10, name: 'Kareem Ahmed' }
  ];

  const transactions = [
    { id: 1, customer_id: 1, date: '2022-01-01', amount: 1000 },
    { id: 2, customer_id: 1, date: '2022-01-02', amount: 5750 },
    { id: 3, customer_id: 1, date: '2022-01-07', amount: 1000 },
    { id: 4, customer_id: 1, date: '2022-01-23', amount: 900 },
    { id: 5, customer_id: 2, date: '2022-01-01', amount: 550 },
    { id: 6, customer_id: 2, date: '2022-01-02', amount: 3350 },
    { id: 7, customer_id: 2, date: '2022-01-08', amount: 2500 },
    { id: 8, customer_id: 2, date: '2022-01-12', amount: 450 },
    { id: 9, customer_id: 3, date: '2022-01-01', amount: 500 },
    { id: 10, customer_id: 3, date: '2022-01-02', amount: 2000 },
    { id: 11, customer_id: 3, date: '2022-01-07', amount: 800 },
    { id: 12, customer_id: 4, date: '2022-01-01', amount: 750 },
    { id: 13, customer_id: 4, date: '2022-01-08', amount: 650 },
    { id: 14, customer_id: 5, date: '2022-01-01', amount: 2500 },
    { id: 15, customer_id: 5, date: '2022-01-02', amount: 6375 },
    { id: 16, customer_id: 5, date: '2022-01-07', amount: 1500 },
    { id: 17, customer_id: 5, date: '2022-01-20', amount: 550 },
    { id: 18, customer_id: 6, date: '2022-01-03', amount: 800 },
    { id: 19, customer_id: 6, date: '2022-01-04', amount: 2000 },
    { id: 20, customer_id: 6, date: '2022-01-07', amount: 1500 },
    { id: 21, customer_id: 6, date: '2022-01-27', amount: 550 },
    { id: 22, customer_id: 7, date: '2022-01-03', amount: 1000 },
    { id: 23, customer_id: 7, date: '2022-01-04', amount: 750 },
    { id: 24, customer_id: 7, date: '2022-01-09', amount: 1500 },
    { id: 25, customer_id: 8, date: '2022-01-05', amount: 2000 },
    { id: 26, customer_id: 8, date: '2022-01-06', amount: 1500 },
    { id: 27, customer_id: 8, date: '2022-01-09', amount: 1000 },
    { id: 28, customer_id: 8, date: '2022-01-22', amount: 550 },
    { id: 29, customer_id: 9, date: '2022-01-05', amount: 1200 },
    { id: 30, customer_id: 9, date: '2022-01-06', amount: 1000 },
    { id: 31, customer_id: 9, date: '2022-01-10', amount: 1500 },
    { id: 32, customer_id: 9, date: '2022-01-20', amount: 1000 },
    { id: 33, customer_id: 10, date: '2022-01-07', amount: 1000 },
    { id: 34, customer_id: 10, date: '2022-01-08', amount: 3000 },
    { id: 35, customer_id: 10, date: '2022-01-10', amount: 1500 }
  ];

  const transactionTableBody = document.getElementById('transactionTableBody');
  const customerFilter = document.getElementById('customerFilter');
  const amountFilter = document.getElementById('amountFilter');
  const chartContainer = document.querySelector('.chart-container');
  const transactionChartCanvas = document.getElementById('transactionChart');
  let myChart;

  function renderTransactions(transactionsToRender) {
    transactionTableBody.innerHTML = '';

    const renderedCustomers = new Set();

    transactionsToRender.forEach(transaction => {
      const customer = customers.find(c => c.id === transaction.customer_id);
      if (!customer || renderedCustomers.has(customer.id)) return;

      renderedCustomers.add(customer.id);

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.name}</td>
        <td>${transaction.amount}</td>
        <td><button onclick="viewCustomerTransactions(${customer.id})">View </button></td>
      `;
      transactionTableBody.appendChild(row);
    });
  }

  renderTransactions(transactions);

  function filterTransactions() {
    const customerFilterValue = customerFilter.value.toLowerCase();
    const amountFilterValue = parseFloat(amountFilter.value);

    const filteredTransactions = transactions.filter(transaction => {
      const customer = customers.find(c => c.id === transaction.customer_id);
      if (!customer) return false;

      const customerName = customer.name.toLowerCase();
      const matchesCustomer = customerName.includes(customerFilterValue);
      const matchesAmount = isNaN(amountFilterValue) || transaction.amount === amountFilterValue;

      return matchesCustomer && matchesAmount;
    });

    renderTransactions(filteredTransactions);
  }

  window.viewCustomerTransactions = function(customerId) {
    const customerTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
    updateChart(customerTransactions);
    chartContainer.style.display = 'block'; 
  };

  function updateChart(filteredTransactions) {
    const ctx = transactionChartCanvas.getContext('2d');

    const customer = customers.find(c => c.id === filteredTransactions[0].customer_id);
    if (!customer) return;

    const dates = filteredTransactions.map(transaction => {
      const date = new Date(transaction.date);
      return `${date.getDate()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
    });

    const amounts = filteredTransactions.map(transaction => transaction.amount);

    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: `${customer.name}'s Transactions`,
          data: amounts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  customerFilter.addEventListener('input', filterTransactions);
  amountFilter.addEventListener('input', filterTransactions);
});
