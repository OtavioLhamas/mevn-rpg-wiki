import { App } from './setup'

const app = new App().express
const port = process.env.API_PORT || 8081

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port} on ${app.get('env')} mode`)
})

// Exports our app for testing
export default app
