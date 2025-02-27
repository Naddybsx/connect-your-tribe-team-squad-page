// Alle kaarten ophalen
const cards = document.querySelectorAll(".card");
const container = document.getElementById('person-list')
// Hier bewaren we de kaarten die de view inkomen
const initiallyVisible = [];

container.classList.remove('client')
// Observer opzetten
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        initiallyVisible.push(entry.target);
        obs.unobserve(entry.target);
      }
    });

    if (initiallyVisible.length > 0) {
      // Default delay van de animatie tussen kaarten
      const delayBetweenCards = 75;
      // Loop door de nieuw toegevoegde kaarten
      initiallyVisible.forEach((card, index) => {
        // Random nummer voor variatie
        const randomMultiplier = Math.random() * (3 - 1) + 1;
        // Timeout tussen class assignment
        setTimeout(() => {
          card.classList.add("bubble-up");
        }, index * delayBetweenCards * randomMultiplier);
      });
      // Leegt de array
      initiallyVisible.length = 0;
    }
  },
  // Hoeveel % van de kaart moet visible zijn om de functie te triggeren
  { threshold: 0.5 }
);

// Elke kaart observeren
cards.forEach((card) => observer.observe(card));
