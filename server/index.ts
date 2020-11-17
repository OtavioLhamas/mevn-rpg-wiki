import { App } from './setup'

async function startServer () {
  const app = new App()
  const express = await app.expressSetup()

  const mongo = await app.mongoSetup()

  const port = process.env.API_PORT || 8081

  express.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port} on ${express.get('env')} mode`)
  })
}

const app = startServer()
