import {app} from './app'
import {startWorker} from './worker'

app.listen(3000, '0.0.0.0', () => console.log('Server is running.'))
startWorker()
