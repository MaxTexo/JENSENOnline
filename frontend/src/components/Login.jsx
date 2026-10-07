import { useState } from "react"
import { login } from "../services/api"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await login(email, password)
      await onLogin()

      setMessage("")
      setEmail("")
      setPassword("")
    } catch {
      setMessage("Fel e-postadress eller lösenord.")
    }
  }

  return (
    <section>
      <h2>Logga in</h2>

      <form className="login-form" onSubmit={handleSubmit}>
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

        <button type="submit">Logga in</button>
      </form>

      {message && <p>{message}</p>}
    </section>
  )
}

export default Login