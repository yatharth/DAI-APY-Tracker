CREATE DATABASE "app";

\c "app";

CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

CREATE TABLE IF NOT EXISTS "rates"
(
    "timestamp"   TIMESTAMP NOT NULL,
    "protocol"    TEXT      NOT NULL,
    "blockNumber" INT       NOT NULL,
    "apy"         REAL      NOT NULL
);

SELECT create_hypertable('rates', 'timestamp');

ALTER TABLE "rates"
    SET (
        timescaledb.compress,
        timescaledb.compress_segmentby = 'protocol'
        );

SELECT add_compression_policy('rates', INTERVAL '30 days');
