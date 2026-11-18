---
name: api-auth-patterns
description: Guidelines and best practices for API Authentication (JWT, Bearer keys) and common API communication patterns (REST, GraphQL, gRPC, WebSockets, Webhooks, MCP).
---

# Skill: API Authentication and Usage Patterns

This skill enables an AI agent to understand how to authenticate requests and interact with various API architectures effectively.

## 1. Authentication Mechanisms

### JWT (JSON Web Tokens)
* **Condition:** Use when you need a stateless, fast, and self-contained method of authentication.
* **How it works:** The token contains the identity, permissions, and expiry. The server verifies the token signature without needing to query a database for every request.

### Bearer Authentication (API Keys)
* **Condition:** Use for third-party service integrations (e.g., OpenAI API) or where a specific key identifies the caller.
* **How it works:** The API key is sent in the request header using the `Authorization: Bearer <token>` format.

## 2. API Communication Patterns

| Architecture | Best Used When... |
| :--- | :--- |
| **REST** | Building standard resource-oriented APIs with CRUD actions. |
| **GraphQL** | You need to prevent over-fetching/under-fetching by allowing the client to request specific fields. |
| **SOAP** | Working with legacy enterprise, banking, or government systems requiring strict XML contracts. |
| **gRPC** | High-performance, low-latency microservice-to-microservice communication using binary formats. |
| **WebSockets** | Real-time, bi-directional communication (e.g., chat apps, AI token-by-token streaming). |
| **Webhooks** | Event-driven scenarios where an external service needs to notify your app of an event (e.g., payment success). |

## 3. Infrastructure & Tooling

* **API Gateway:** Essential in production to handle rate limiting, authentication, logging, and metrics.
* **Monitoring:** Use tools like *Prometheus* or *Grafana* to track health and response times.
* **Documentation:** Always use *Swagger* or *OpenAPI* to ensure developers understand how to interface with your API.
* **Frameworks:** 
    * *Flask/FastAPI*: Ideal for Python-based REST APIs.
    * *ExpressJS/Spring Boot*: For Node.js and Java enterprise environments respectively.

## 4. AI-Specific Integration

* **MCP (Model Context Protocol):** Use this to standardize how AI models connect to external tools/databases, preventing custom connector breakage when switching model providers.
