const express = require('express');
const session = require('express-session');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const router = jsonServer.router('.json');
const middlewares = jsonServer.defaults();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true
}));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    req.session.user = { username };
    return res.json({ message: 'Login bem-sucedido' });
  }
  res.status(401).json({ message: 'Credenciais inválidas' });
});

app.use((req, res, next) => {
  if (req.session.user || req.path === '/login' || req.path === '/public') {
    next();
  } else {
    res.status(401).json({ message: 'Não autorizado' });
  }
});

app.use('/api', middlewares);
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
