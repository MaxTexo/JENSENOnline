import { useState } from "react"
import { register } from "../services/api"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await register(email, password)
      setMessage("Kontot skapades.")
      setEmail("")
      setPassword("")
    } catch {
      setMessage("Kunde inte skapa kontot.")
    }
  }

  return (
    <section>
      <h2>Skapa konto</h2>

   <form className="register-form" onSubmit={handleSubmit}>
    <input
    type="email"
    placeholder="E-post"
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    required
  />

  <input
    type="password"
    placeholder="Lösenord"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    required
  />

  <small>
    Lösenordet måste innehålla minst 8 tecken, en stor bokstav,
    en liten bokstav, en siffra och ett specialtecken.
  </small>

  <button type="submit">Skapa konto</button>
</form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default Register