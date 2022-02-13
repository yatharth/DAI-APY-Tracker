CONTAINER_WEB := $(shell docker-compose ps -q web)
CONTAINER_POSTGRES := $(shell docker-compose ps -q postgres)

install:
	yarn install
	npm run build

run:
	docker-compose up --build

db_clean: # By default, the database volume is persisted. If you want to start fresh, run this command.
	docker-compose down --volumes

docker_clean: # By default, orphaned volumes and images are not removed. If you want to remove them, run this command.
	docker-compose down --volumes --remove-orphans

shell:
	docker exec -it ${CONTAINER_WEB} /bin/bash

db_shell:
	docker exec -it ${CONTAINER_POSTGRES} /bin/bash

psql:
	docker exec -it ${CONTAINER_POSTGRES} psql -h localhost -p 5432 -U pguser app
