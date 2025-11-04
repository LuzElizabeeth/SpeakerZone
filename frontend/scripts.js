// Fecha de la próxima conferencia (formato: Año, Mes (0-11), Día, Hora, Minuto, Segundo)
const targetDate = new Date(2025, 10, 15, 11, 0, 0); // 15 de noviembre 2025 a las 11:00 AM

function updateCountdown() {
  const now = new Date();
  const timeLeft = targetDate - now;

  if (timeLeft <= 0) {
    document.querySelector('.timer').innerHTML = "¡La conferencia ha comenzado!";
    return;
  }

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  document.querySelector('.timer').innerHTML = `
    <span>${days}</span>
    <span>${hours}</span>
    <span>${minutes}</span>
    <span>${seconds}</span>
  `;
}

// Actualiza cada segundo
setInterval(updateCountdown, 1000);
updateCountdown();
