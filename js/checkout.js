const createOrderForm = document.getElementById('checkoutForm');
const paymentSection = document.getElementById('paymentSection');
const createOrderBtn = document.getElementById('createOrderBtn');
const customerName = document.getElementById('name');
const customerEmail = document.getElementById('email');
const customerPhone = document.getElementById('phone');
const quantityInput = document.getElementById('quantity');

function validateCheckoutFields() {
  if (!customerName || !customerName.value.trim()) return 'Digite seu nome completo.';
  if (!customerEmail || !customerEmail.value.trim()) return 'Digite seu e-mail.';
  if (!customerPhone || !customerPhone.value.trim()) return 'Digite seu telefone.';
  return null;
}

function buildOrderPayload() {
  return {
    customer: {
      name: customerName.value.trim(),
      email: customerEmail.value.trim(),
      phone: customerPhone.value.trim()
    },
    items: [
      {
        ticketType: 'Único',
        quantity: Number(quantityInput?.value || 1),
        unitPrice: 10
      }
    ],
    paymentMethod: 'pix'
  };
}

async function createOrderRequest(payload) {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível criar o pedido.');
  }

  return data;
}

if (createOrderForm) {
  createOrderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const error = validateCheckoutFields();
    if (error) {
      alert(error);
      return;
    }

    try {
      if (createOrderBtn) {
        createOrderBtn.disabled = true;
        createOrderBtn.textContent = 'Criando pedido...';
      }

      const payload = buildOrderPayload();
      const order = await createOrderRequest(payload);

      localStorage.setItem('alienPoolCurrentOrderId', order.orderId);
      localStorage.setItem('alienPoolCurrentOrder', JSON.stringify(order));

      if (paymentSection) {
        paymentSection.classList.remove('hidden');
      }

      renderPixPayment(order);
      startOrderPolling(order.orderId);
      paymentSection?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      alert(err.message || 'Erro ao criar o pedido.');
    } finally {
      if (createOrderBtn) {
        createOrderBtn.disabled = false;
        createOrderBtn.textContent = 'Gerar PIX';
      }
    }
  });
}