import {app} from './app'
import {insertNewRates, insertSomeRates, startWorker} from './worker'
import {getLastBlockNumber, getRecent} from '../lib/db/index'

async function main() {

    // Start listening for new rates in the background.
    startWorker()

    // If no rates in database, load some before we start the web server.
    if (!await getLastBlockNumber()) {
        console.log("Please wait; loading for first-time.")
        await insertNewRates()
        console.log("Done; now starting web server.")
    }

    // Start web server.
    app.listen(3000, '0.0.0.0', () => console.log('Server is running.'))

}

main()

