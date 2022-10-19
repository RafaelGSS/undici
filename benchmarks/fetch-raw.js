const { fetch, setGlobalDispatcher, Agent } = require('../index')
const { WritableStream } = require('stream/web')

const samples = 100
const parallelRequests = Array.from(Array(1000))

setGlobalDispatcher(new Agent({ connections: 50 }))

function performRequest() {
  return new Promise((resolve) => {
    return fetch('http://localhost:3001').then(res => {
      res.body.pipeTo(new WritableStream({ write () {}, close () { resolve() } }))
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
