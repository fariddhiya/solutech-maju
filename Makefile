.PHONY: setup up down logs clean shell migrate seed status rebuild help

setup:
	docker-compose down -v
	docker-compose up --build -d
	@echo "Waiting for app to be ready..."
	@sleep 10
	@echo "Solutech API is running at http://localhost:3000"
	@echo "PostgreSQL is running at localhost:5432"

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker rmi solutech-maju-app || true

shell:
	docker exec -it solutech-app sh

migrate:
	docker exec -it solutech-app npx prisma migrate dev

seed:
	docker exec -it solutech-app npx prisma db seed

status:
	docker exec -it solutech-app npx prisma migrate status

rebuild:
	docker-compose up --build -d

help:
	@echo "Available commands:"
	@echo "  make setup    - Build and start everything from scratch"
	@echo "  make up       - Start existing containers"
	@echo "  make down     - Stop containers"
	@echo "  make logs     - Follow logs"
	@echo "  make clean    - Remove containers, volumes, and images"
	@echo "  make shell    - Open shell inside app container"
	@echo "  make migrate  - Run Prisma migrate dev inside container"
	@echo "  make seed     - Run Prisma seed inside container"
	@echo "  make status   - Check migration status"
	@echo "  make rebuild  - Rebuild and restart containers"
