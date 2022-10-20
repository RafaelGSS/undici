const { Writable } = require('stream')
const { Pool } = require('../index')

const samples = 100
const parallelRequests = Array.from(Array(1000))

const undiciOptions = {
  path: '/',
  method: 'GET',
}

const dispatcher = new Pool('http://localhost:3001', {
  connections: 50,
  pipelining: 1
})

function performRequest() {
  return new Promise((resolve) => {
    dispatcher.request(undiciOptions).then(({ body }) => {
      body
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
    console.time('request')
    await Promise.all(
      parallelRequests.map(performRequest)
    )
    console.timeEnd('request')
  }
}

main()

