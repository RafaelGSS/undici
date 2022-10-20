const { fetch, setGlobalDispatcher, Agent } = require('../index')
const { WritableStream } = require('stream/web')
const { Writable } = require('stream')

const samples = 100
const parallelRequests = Array.from(Array(1000))

setGlobalDispatcher(new Agent({ connections: 50 }))

function performRequest() {
  return new Promise((resolve) => {
    return fetch('http://localhost:3001').then(res => {
      // res.body.pipeTo(new WritableStream({ write () {}, close () { resolve() } }))
      res.body
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
    console.time('fetch')
    await Promise.all(
      parallelRequests.map(performRequest)
    )
    console.timeEnd('fetch')
  }
}

main()
