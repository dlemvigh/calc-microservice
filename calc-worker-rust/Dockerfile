FROM rust:1.57 AS chef 
RUN cargo install cargo-chef 
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare  --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release

FROM chef as tester
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --recipe-path recipe.json
COPY . .
RUN cargo test

# We do not need the Rust toolchain to run the binary!
FROM debian:buster-slim AS runtime
COPY --from=builder /app/target/release/calc-worker-rust /usr/local/bin
CMD ["/usr/local/bin/calc-worker-rust"]