const BASE_URL = "http://10.0.2.2:3000";

export async function getCartAPI(token) {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function updateCartAPI(token, cartItems) {
  const response = await fetch(`${BASE_URL}/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: cartItems,
    }),
  });

  return response.json();
}
