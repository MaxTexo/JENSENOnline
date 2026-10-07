import { useState } from "react"
import { createProduct } from "../services/api"

function CreateProduct({ onProductCreated }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await createProduct(
        name,
        description,
        Number(price),
        Number(stockQuantity)
      )

      setName("")
      setDescription("")
      setPrice("")
      setStockQuantity("")
      setMessage("Produkten skapades.")

      await onProductCreated()
    } catch {
      setMessage("Kunde inte skapa produkten.")
    }
  }

  return (
    <section>
      <h2>Skapa produkt</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Produktnamn"
          value={name}
          onChange={(event) => setName(event.target.value)}
          minLength="2"
          maxLength="100"
          required
        />

        <input
          type="text"
          placeholder="Beskrivning"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength="500"
          required
        />

        <input
          type="number"
          placeholder="Pris"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          min="0.01"
          step="0.01"
          required
        />

        <input
          type="number"
          placeholder="Lagersaldo"
          value={stockQuantity}
          onChange={(event) => setStockQuantity(event.target.value)}
          min="0"
          max="100000"
          required
        />

        <button type="submit">Skapa produkt</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default CreateProduct