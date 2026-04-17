const pixQrImage = document.getElementById('pixQrImage');
const pixCode = document.getElementById('pixCode');
const paymentStatus = document.getElementById('paymentStatus');
const paymentExpiresAt = document.getElementById('paymentExpiresAt');
const copyPixBtn = document.getElementById('copyPixBtn');

function renderPixPayment(order) {
  if (pixQrImage && order.pixQrCodeBase64) {
    pixQrImage.src = order.pixQrCodeBase64;
  }

  if (pixCode && order.pixQrCode) {
    pixCode.value = order.pixQrCode;
  }

  if (paymentStatus) {
    paymentStatus.textContent = 'Aguardando pagamento';
  }

  if (paymentExpiresAt && order.expiresAt) {
    const date = new Date(order.expiresAt);
    paymentExpiresAt.textContent = `Expira em: ${date.toLocaleString('pt-BR')}`;
  }
}

async function getOrderStatus(orderId) {
  const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao consultar o pedido.');
  }

  return data;
}

function startOrderPolling(orderId) {
  const interval = setInterval(async () => {
    try {
      const order = await getOrderStatus(orderId);

      if (paymentStatus) {
        if (order.status === 'paid') {
          paymentStatus.textContent = 'Pagamento aprovado';
        } else if (order.status === 'expired') {
          paymentStatus.textContent = 'Pagamento expirado';
        } else if (order.status === 'cancelled') {
          paymentStatus.textContent = 'Pagamento cancelado';
        } else {
          paymentStatus.textContent = 'Aguardando pagamento';
        }
      }

      if (order.status === 'paid') {
        clearInterval(interval);

        const nextUrl = new URL('success.html', window.location.href);
        nextUrl.searchParams.set('orderId', order.orderId);

        if (order.ticketCode) {
          nextUrl.searchParams.set('ticketCode', order.ticketCode);
        }

        window.location.href = nextUrl.toString();
      }

      if (order.status === 'expired' || order.status === 'cancelled') {
        clearInterval(interval);
      }
    } catch (error) {
      console.error(error);
    }
  }, 5000);
}

if (copyPixBtn) {
  copyPixBtn.addEventListener('click', async () => {
    if (!pixCode || !pixCode.value) return;

    try {
      await navigator.clipboard.writeText(pixCode.value);
      copyPixBtn.textContent = 'PIX copiado';

      setTimeout(() => {
        copyPixBtn.textContent = 'Copiar código PIX';
      }, 2000);
    } catch (error) {
      alert('Não foi possível copiar o código PIX.');
    }
  });
}