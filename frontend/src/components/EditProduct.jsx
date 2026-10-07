import { useState } from "react"
import { updateProduct } from "../services/api"

function EditProduct({ product, onProductUpdated, onCancel }) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price)
  const [stockQuantity, setStockQuantity] = useState(product.stockQuantity)
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await updateProduct(
        product.id,
        name,
        description,
        Number(price),
        Number(stockQuantity)
      )

      setMessage("Produkten uppdaterades.")
      await onProductUpdated()
    } catch {
      setMessage("Kunde inte uppdatera produkten.")
    }
  }

  return (
    <section>
      <h2>Redigera produkt</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength="2"
          maxLength="100"
          required
        />

        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength="500"
          required
        />

        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <input
          type="number"
          value={stockQuantity}
          onChange={(event) => setStockQuantity(event.target.value)}
          min="0"
          max="100000"
          required
        />

        <button type="submit">
          Spara ändringar
        </button>

        <button type="button" onClick={onCancel}>
          Avbryt
        </button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default EditProduct