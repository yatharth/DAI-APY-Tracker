# DAI APY Tracker

This is a simple containerised full-stack application to comparing historical DAI interest rates across several on-chain protocols.

The current protocols supported are:

- Compound Finance
- Aave

The web app has two views:

- Realtime, which displays the last 30 days of data and updates in real time.
- Historical, which displays several years of data, at a 5-minute resolution.

The app is designed to scale in two respects:

- a large number of users
- a growing amount of data stored over time 


## Installation

Simply clone the repo, run `yarn install`, and with `make run`, you’re up.


## Architecture

The app is containerised using Docker Compose. It provisions a Redis server, a Postgres database, and a web service.

The web services consists of a React front-end (in `src/client`) and a back-end server (`src/server`). The server is responsible for 

- serving the React front-end
- serving some API functions for the front-end to consume
- running a worker to check for the latest rates periodically

The database uses TimescaleDB, which is a Postgres extensions designed to make scaling with time series simple and performant.

Most of the code is well-modularised into different components in `src/lib`:

- `cache` provides an interface to the Redis server.
- `db` provides an interface to the Postgres server.
- `crypto` provides an interface to data on the blockchain.
- `misc` provides some small utilities.

None of these components depend on each other.


## Scalability

The app was designed for massive scalability in terms of two things:

- a large number of users
- a growing amount of data stored over time

As such, I minimised the data transfer, disk storage, compute, and memory, requirements to as asymptotically small as possible.

Data transfer is linear with respect number of users, thanks to caching and using the client to update in real-time. It is reduced for historical data through downsampling the resolution of the data.

Memory usage is mainly impacted by cache, and is similar.

Compute is correspondingly minimised thanks to heavy caching, only needing to fetch the latest rates every 10 minutes or so, and by using TimescaleDB’s efficient querying.

Data storage is minimised with compression of data older than a year. It can be distributed across disks too transparently.

Infrastructure cost on something like AWS could cut to small fraction by using spot instances, as no requests need to serve synchronously that are not cached, and operations run quickly and idempotently.


## Design decisions

I decided to make the server periodically check the chain for updates, instead of clients checking and posting the results to the server, as the latter would be a security threat: clients could post fake data.

However, the clients do check for updates on their own too. The client gets an initial load of historical data before checking for real time data. This dramatically lessens the data transfer load on the server. Otherwise, the server would have to push data using web sockets.

As it is, the server only has to expose two easily-cacheable endpoints: /recents and /historical. The CDN can take the brunt of user requests; the server only has to be checked every 10 minutes for the /recents data and every hour of the /historical data.

The historical data uses downsampling: it returns the average APY at a 5-minute resolution, further greatly reducing the data transfer and cache memory load.

Storage is minimised by using TimescaleDB’s compression features, to compress data older than one year.

Compute time is minimised by using TimescaleDB’s very performant indexing and querying for retrieving the data.

If we only had one end-point, then we could not cache efficiently. We don’t want the recents data getting too old, so we’d have to update it every 10 minutes or less, but dragging in all of the historical data would be expensive.

This way, users can get a realtime view with the last 30 days of data, and if they want a historical view, we can offer that as well, at the cost of it being stale by an hour. 
