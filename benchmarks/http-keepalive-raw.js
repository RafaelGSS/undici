const http = require('http')
const { Writable } = require('stream')

const samples = 100
const parallelRequests = Array.from(Array(1000))

const httpKeepAliveOptions = {
  protocol: 'http:',
  hostname: 'localhost',
  method: 'GET',
  path: '/',
  port: 3001,
  url: 'http://localhost:3001',
  agent: new http.Agent({
    keepAlive: true,
    maxSockets: 50
  })
}

function performRequest() {
  return new Promise((resolve) => {
    http.get(httpKeepAliveOptions, res => {
      res
        .pipe(
          new Writable({
            write (chunk, encoding, callback) {
              callback()
            }
          })
        )
        .on('finish', resolve)
    })
  })
}

async function main() {
  for (let i = 0; i < samples; ++i) {
    console.time('keepalive')
    await Promise.all(
      parallelRequests.map(performRequest)
    )
    console.timeEnd('keepalive')
  }
}

main()

