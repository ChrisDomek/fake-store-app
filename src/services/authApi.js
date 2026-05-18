const BASE_URL = "http://10.0.2.2:3000";

export async function signUpUserAPI(name, email, password) {
  const response = await fetch(`${BASE_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  return response.json();
}

export async function signInUserAPI(email, password) {
  const response = await fetch(`${BASE_URL}/users/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  return response.json();
}

export async function updateUserAPI(token, name, password) {
  const response = await fetch(`${BASE_URL}/users/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      password,
    }),
  });
  return response.json();
}
