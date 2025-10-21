const express = require('express');
const app = express();
const port = 3000;

// Маршрут /login возвращает логин
app.get('/login', (req, res) => {
  res.send('diflymer');
});

// Маршрут /hour возвращает текущий час по Московскому времени в формате HH
app.get('/hour', (req, res) => {
  const now = new Date();
  // Получаем московское время
  const moscowTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Moscow"}));
  const hour = moscowTime.getHours().toString().padStart(2, '0');
  res.send(hour);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
