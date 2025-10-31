import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
