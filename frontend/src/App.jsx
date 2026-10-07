import { useEffect, useState } from "react"
import {
  getProducts,
  getCurrentUser,
  logout,
  createOrder,
  getMyOrders,
  getAllOrders,
  deleteProduct
} from "./services/api"
import Register from "./components/Register"
import Login from "./components/Login"
import CreateProduct from "./components/CreateProduct"
import EditProduct from "./components/EditProduct"
import BuyProduct from "./components/BuyProduct"
import "./App.css"

function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)

  async function loadProducts(searchText = "") {
    const data = await getProducts(searchText)
    setProducts(data)
  }

  useEffect(() => {
    async function loadInitialData() {
      const productData = await getProducts()
      setProducts(productData)

      const userData = await getCurrentUser()
      setUser(userData)
    }

    loadInitialData()
  }, [])

  async function handleSearch(event) {
    event.preventDefault()
    await loadProducts(search)
  }

  async function handleLogin() {
    const userData = await getCurrentUser()
    setUser(userData)
  }

  async function handleLogout() {
    try {
      await logout()
      setUser(null)
      setOrders([])
      setEditingProduct(null)
    } catch {
      alert("Kunde inte logga ut.")
    }
  }

  async function handleBuy(productId, quantity) {
    try {
      const order = await createOrder(productId, quantity)

      alert(`Beställning skapad. Ordernummer: ${order.id}`)

      await loadProducts()
    } catch {
      alert("Kunde inte skapa beställningen.")
    }
  }

  async function handleGetMyOrders() {
    try {
      const data = await getMyOrders()
      setOrders(data)
    } catch {
      alert("Kunde inte hämta beställningar.")
    }
  }

  async function handleGetAllOrders() {
    try {
      const data = await getAllOrders()
      setOrders(data)
    } catch {
      alert("Kunde inte hämta alla beställningar.")
    }
  }

  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort produkten?"
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteProduct(productId)

      if (editingProduct?.id === productId) {
        setEditingProduct(null)
      }

      await loadProducts()
    } catch {
      alert("Kunde inte ta bort produkten.")
    }
  }

  return (
    <main className="app-container">
      <header className="header">
        <div>
          <h1>JENSENOnline</h1>
          <p>Elektronik och kontorsprodukter för hem och företag.</p>
        </div>

        {user && (
          <div className="header-user">
            <span>{user.email}</span>
            <span className="role-badge">
              {user.roles.join(", ")}
            </span>
          </div>
        )}
      </header>

      {user && (
        <section className="user-panel">
          <div>
            <h2>Välkommen</h2>
            <p>Inloggad som {user.email}</p>
          </div>

          <div className="button-group">
            {user.roles.includes("Customer") && (
              <button onClick={handleGetMyOrders}>
                Mina beställningar
              </button>
            )}

            {user.roles.includes("Admin") && (
              <button onClick={handleGetAllOrders}>
                Alla beställningar
              </button>
            )}

            <button
              className="secondary-button"
              onClick={handleLogout}
            >
              Logga ut
            </button>
          </div>
        </section>
      )}

      {orders.length > 0 && (
        <section className="orders-section">
          <div className="section-heading">
            <h2>
              {user?.roles.includes("Admin")
                ? "Alla beställningar"
                : "Mina beställningar"}
            </h2>
          </div>

          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-header">
                  <h3>Order #{order.id}</h3>

                  <span>
                    {new Date(order.orderDate).toLocaleString("sv-SE")}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div
                      className="order-item"
                      key={item.productId}
                    >
                      <div>
                        <strong>{item.productName}</strong>
                        <p>Antal: {item.quantity}</p>
                      </div>

                      <span>{item.unitPrice} kr/st</span>
                    </div>
                  ))}
                </div>

                <div className="order-total">
                  Totalt: {order.totalPrice} kr
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="products-section">
        <div className="section-heading">
          <div>
            <h2>Produkter</h2>
            <p>Hitta elektronik och produkter för kontoret.</p>
          </div>

          <form
            className="search-form"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Sök produkter..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit">
              Sök
            </button>
          </form>
        </div>

        <div className="product-list">
          {products.map((product) => (
            <article
              className="product-card"
              key={product.id}
            >
              <div className="product-content">
                <h3>{product.name}</h3>

                <p className="product-description">
                  {product.description}
                </p>

                <p className="product-price">
                  {product.price} kr
                </p>
              </div>

              <div className="product-actions">
                {user?.roles.includes("Customer") && (
                  <BuyProduct
                    productId={product.id}
                    onBuy={handleBuy}
                  />
                )}

                {user?.roles.includes("Admin") && (
                  <div className="button-group">
                    <button
                      onClick={() => setEditingProduct(product)}
                    >
                      Redigera
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDeleteProduct(product.id)
                      }
                    >
                      Ta bort
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-message">
            Inga produkter hittades.
          </div>
        )}
      </section>

      {user?.roles.includes("Admin") && (
        <section className="admin-section">
          <div className="section-heading">
            <div>
              <h2>Administration</h2>
              <p>Hantera produkter i JENSENOnline.</p>
            </div>
          </div>

          <div className="admin-grid">
            {editingProduct && (
              <div className="form-card">
                <h3>Redigera produkt</h3>

                <EditProduct
                  product={editingProduct}
                  onProductUpdated={async () => {
                    await loadProducts()
                    setEditingProduct(null)
                  }}
                  onCancel={() => setEditingProduct(null)}
                />
              </div>
            )}

            <div className="form-card">
              <h3>Skapa ny produkt</h3>

              <CreateProduct
                onProductCreated={() => loadProducts()}
              />
            </div>
          </div>
        </section>
      )}

      {!user && (
        <section className="auth-section">
          <div className="auth-heading">
            <h2>Kom igång</h2>
            <p>
              Logga in på ditt konto eller skapa ett nytt.
            </p>
          </div>

          <div className="auth-grid">
            <div className="form-card">
              <h3>Skapa konto</h3>
              <Register />
            </div>

            <div className="form-card">
              <h3>Logga in</h3>
              <Login onLogin={handleLogin} />
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default App