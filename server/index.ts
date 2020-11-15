import app from './setup'

const port = process.env.API_PORT || 8081

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port} on ${app.get('env')} mode`)
})
