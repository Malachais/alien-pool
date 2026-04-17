const ticketStatus = document.getElementById('ticketStatus');
const ticketQr = document.getElementById('ticketQr');

async function fetchTicketByCode(ticketCodeValue) {
  const response = await fetch(`/api/tickets/${encodeURIComponent(ticketCodeValue)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao carregar ingresso.');
  }

  return data;
}

async function fetchOrder(orderIdValue) {
  const response = await fetch(`/api/orders/${encodeURIComponent(orderIdValue)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao carregar pedido.');
  }

  return data;
}

function renderTicket(data) {
  if (ticketBuyer) ticketBuyer.textContent = data.buyerName || '---';
  if (ticketType) ticketType.textContent = data.ticketType || 'Único';
  if (ticketCode) ticketCode.textContent = data.ticketCode || '---';
  if (ticketStatus) ticketStatus.textContent = data.status || 'valid';
  if (ticketQr && data.qrCodeBase64) ticketQr.src = data.qrCodeBase64;
}

(async function initTicketPage() {
  try {
    if (ticketCodeParam) {
      const ticket = await fetchTicketByCode(ticketCodeParam);
      renderTicket(ticket);
      return;
    }

    if (orderIdParam) {
      const order = await fetchOrder(orderIdParam);
      if (order.ticketCode) {
        const ticket = await fetchTicketByCode(order.ticketCode);
        renderTicket(ticket);
        return;
      }
    }

    const cachedOrder = localStorage.getItem('alienPoolCurrentOrder');
    if (cachedOrder) {
      const order = JSON.parse(cachedOrder);
      if (order.ticketCode) {
        const ticket = await fetchTicketByCode(order.ticketCode);
        renderTicket(ticket);
        return;
      }
    }

    throw new Error('Ingresso não encontrado.');
  } catch (error) {
    alert(error.message || 'Erro ao abrir o ingresso.');
  }
})();