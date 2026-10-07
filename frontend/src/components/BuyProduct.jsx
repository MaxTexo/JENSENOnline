import { useState } from "react"

function BuyProduct({ productId, onBuy }) {
  const [quantity, setQuantity] = useState(1)

  async function handleBuy() {
    await onBuy(productId, Number(quantity))
  }

  return (
    <div>
      <label>
        Antal:
        <input
          type="number"
          min="1"
          max="100"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />
      </label>

      <button onClick={handleBuy}>
        Köp
      </button>
    </div>
  )
}

export default BuyProduct