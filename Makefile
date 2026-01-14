.PHONY: help dev build start install clean lint format test

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	yarn install

dev: ## Start development server
	yarn dev

build: ## Build for production
	yarn build

start: ## Start production server
	yarn start

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules .next

format: ## Format code with Prettier
	yarn prettier --write .

lint: ## Run linting
	yarn next lint

test: ## Run tests
	yarn test

