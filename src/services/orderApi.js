const BASE_URL = "http://10.0.2.2:3000";

export async function getOrdersAPI(token) {
  const response = await fetch(`${BASE_URL}/orders/all`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function createOrderAPI(token, items) {
  const response = await fetch(`${BASE_URL}/orders/neworder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        productID: item.id,
        price: item.price,
        quantity: item.quantity,
      })),
    }),
  });
  return response.json();
}

export async function updateOrderAPI(token, orderID, isPaid, isDelivered) {
  const response = await fetch(`${BASE_URL}/orders/updateorder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      orderID,
      isPaid,
      isDelivered,
    }),
  });

  return response.json();
}
