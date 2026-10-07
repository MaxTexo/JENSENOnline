const API_URL = "https://localhost:7145/api"

async function getCsrfToken() {
  const response = await fetch(`${API_URL}/csrf`, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("Could not get CSRF token")
  }

  const data = await response.json()

  return data.token
}

export async function getProducts(search = "") {
  const url = search
    ? `${API_URL}/products?search=${encodeURIComponent(search)}`
    : `${API_URL}/products`

  const response = await fetch(url, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("Could not fetch products")
  }

  return await response.json()
}

export async function createProduct(
  name,
  description,
  price,
  stockQuantity
) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken
    },
    body: JSON.stringify({
      name,
      description,
      price,
      stockQuantity
    })
  })

  if (!response.ok) {
    throw new Error("Could not create product")
  }

  return await response.json()
}

export async function updateProduct(
  productId,
  name,
  description,
  price,
  stockQuantity
) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken
      },
      body: JSON.stringify({
        name,
        description,
        price,
        stockQuantity
      })
    }
  )

  if (!response.ok) {
    throw new Error("Could not update product")
  }

  return await response.json()
}

export async function deleteProduct(productId) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(
    `${API_URL}/products/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrfToken
      }
    }
  )

  if (!response.ok) {
    throw new Error("Could not delete product")
  }
}

export async function register(email, password) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  if (!response.ok) {
    throw new Error("Could not register user")
  }

  return await response.json()
}

export async function login(email, password) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken
    },
    body: JSON.stringify({
      email,
      password
    })
  })

  if (!response.ok) {
    throw new Error("Invalid email or password")
  }

  return await response.json()
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: "include"
  })

  if (!response.ok) {
    return null
  }

  return await response.json()
}

export async function logout() {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-TOKEN": csrfToken
    }
  })

  if (!response.ok) {
    throw new Error("Could not log out")
  }

  return await response.json()
}

export async function createOrder(productId, quantity) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken
    },
    body: JSON.stringify({
      items: [
        {
          productId,
          quantity
        }
      ]
    })
  })

  if (!response.ok) {
    throw new Error("Could not create order")
  }

  return await response.json()
}

export async function getMyOrders() {
  const response = await fetch(`${API_URL}/orders/my`, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("Could not fetch orders")
  }

  return await response.json()
}

export async function getAllOrders() {
  const response = await fetch(`${API_URL}/orders`, {
    credentials: "include"
  })

  if (!response.ok) {
    throw new Error("Could not fetch all orders")
  }

  return await response.json()
}