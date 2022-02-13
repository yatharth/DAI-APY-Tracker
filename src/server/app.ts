import express, {NextFunction, Request, Response} from 'express'
import bodyParser from 'body-parser'

import * as api from './api'


export const app = express()

// Log errors
app.use((err, req, res, next) => {
    console.error(err)
    next(err)
})

// Parse request data.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Serve static files.
app.use('/bundles', express.static(`public/bundles`, {maxAge: 604800e3}))
app.use(express.static(`public`, {maxAge: 604800e3}))

// Serve API.
app.get('/recent', api.recent)
app.get('/historical', api.historical)

function disableCaching(res: Response) {
    res.setHeader('Surrogate-Control', 'no-store')
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
}

const htmlForReactApp = `
  <html>
    <head>
      <title>DAI APY Tracker</title>
    </head>
    <body>
      <div id="app"></div>
      <script src="/bundles/main.bundle.js"></script>
    </body>
  </html>
`

// Serve web app.
app.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        disableCaching(res)  // Only for development.
        res.send(htmlForReactApp)
    } catch (err) {
        next(err)
    }
})
