const calendarMonth = document.getElementById('calendarMonth');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const addCalendarBtn = document.getElementById('addCalendarBtn');
const eventDetails = document.getElementById('eventDetails');

const eventDate = {
  year: 2026,
  month: 3,
  day: 19,
  title: 'Alien Pool',
  location: 'Chacara Pé de Cana - Franco da Rocha - SP',
  description: 'Pool Party + Rave com energia cósmica e temática alienígena.',
  startTime: '20260419T090000',
  endTime: '20260419T220000'
};

let currentYear = 2026;
let currentMonth = 3;

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function renderCalendar(year, month) {
  if (!calendarMonth || !calendarDays) return;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  calendarMonth.textContent = `${monthNames[month]} ${year}`;
  calendarDays.innerHTML = '';

  for (let i = firstDay; i > 0; i--) {
    const day = document.createElement('button');
    day.className = 'calendar-day muted';
    day.textContent = String(prevMonthDays - i + 1);
    day.disabled = true;
    calendarDays.appendChild(day);
  }

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const day = document.createElement('button');
    day.className = 'calendar-day';
    day.textContent = String(dayNum);

    const isEventDay =
      year === eventDate.year &&
      month === eventDate.month &&
      dayNum === eventDate.day;

    if (isEventDay) {
      day.classList.add('event', 'selected');
    }

    day.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day').forEach(item => item.classList.remove('selected'));
      day.classList.add('selected');

      if (!eventDetails) return;

      if (isEventDay) {
        eventDetails.innerHTML = `
          <span class="section-tag secondary">Detalhes</span>
          <h3>${eventDate.title}</h3>
          <p><strong>Data:</strong> 19 de Abril de 2026</p>
          <p><strong>Horário:</strong> 09:00 às 22:00</p>
          <p><strong>Local:</strong> ${eventDate.location}</p>
          <p><strong>Tipo:</strong> Pool Party + Rave</p>
          <div class="event-buttons">
            <button id="addCalendarBtnDynamic" class="btn btn-primary" type="button">Adicionar ao calendário</button>
            <a href="#checkout" class="btn btn-secondary">Reservar agora</a>
          </div>
          <small>Pronto para integrar com Google Calendar.</small>
        `;

        const dynamicBtn = document.getElementById('addCalendarBtnDynamic');
        if (dynamicBtn) {
          dynamicBtn.addEventListener('click', openGoogleCalendar);
        }
      } else {
        eventDetails.innerHTML = `
          <span class="section-tag">Data selecionada</span>
          <h3>${dayNum} de ${monthNames[month]} de ${year}</h3>
          <p>Nenhum evento cadastrado nesta data.</p>
          <div class="event-buttons">
            <a href="#ingressos" class="btn btn-secondary">Ver ingresso</a>
          </div>
        `;
      }
    });

    calendarDays.appendChild(day);
  }

  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;

  for (let i = 1; i <= remaining; i++) {
    const day = document.createElement('button');
    day.className = 'calendar-day muted';
    day.textContent = String(i);
    day.disabled = true;
    calendarDays.appendChild(day);
  }
}

function openGoogleCalendar() {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams({
    text: eventDate.title,
    dates: `${eventDate.startTime}/${eventDate.endTime}`,
    details: eventDate.description,
    location: eventDate.location
  });

  window.open(`${baseUrl}&${params.toString()}`, '_blank');
}

if (prevMonthBtn) {
  prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
  });
}

if (nextMonthBtn) {
  nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
  });
}

if (addCalendarBtn) {
  addCalendarBtn.addEventListener('click', openGoogleCalendar);
}

renderCalendar(currentYear, currentMonth);