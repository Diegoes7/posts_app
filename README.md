Stop and remove all containers and volumes:

docker compose down --volumes --remove-orphans

Build images:

docker compose build

Start containers and trigger seed.sql: from the root directory of the project

docker compose up -d
