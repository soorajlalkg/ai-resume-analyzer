# 🚧 AI Resume Analyzer API

An AI-powered Resume Analysis platform built with **Node.js**, **Express**, and **TypeScript**.

This project is being built as a hands-on learning platform for modern AI application development, progressing from direct LLM integrations to Retrieval-Augmented Generation (RAG), embeddings, and vector search.

---

## 🎯 Project Goals

The goal of this project is to build a production-inspired AI application that can:

- Analyze resumes using AI
- Generate ATS compatibility scores
- Summarize candidate profiles
- Match resumes against job descriptions
- Generate interview questions
- Evaluate interview answers
- Explore embeddings and semantic search
- Implement Retrieval-Augmented Generation (RAG)
- Build conversational AI experiences around resumes

---

## 🧰 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### AI

#### Phase 1

- OpenAI SDK

#### Phase 2

- LangChain
- OpenAI Embeddings
- Qdrant Vector Database
- Retrieval-Augmented Generation (RAG)

### Storage

#### Current

- AWS S3 (via LocalStack)

#### Planned

- PostgreSQL
- Qdrant Vector Database

### DevOps

- Docker
- LocalStack

---

# 🚀 Development Roadmap

## Phase 1 — Core AI Features

### Dependencies

```bash
npm install openai
```

### Features

- Resume Upload
- PDF Text Extraction
- ATS Score Generation
- Resume Summary
- Job Match Analysis

### Architecture

```text
Resume Upload
      │
      ▼
PDF Extraction
      │
      ▼
OpenAI
      │
      ├── ATS Score
      ├── Resume Summary
      └── Job Match Analysis
```

### Goals

- Learn OpenAI API integration
- Design AI-powered REST APIs
- Prompt Engineering
- Structured JSON Responses
- Resume Analysis Workflows

---

## Phase 2 — RAG & AI Assistant

### Dependencies

```bash
npm install langchain
npm install @langchain/openai
npm install @langchain/qdrant
```

### Features

- Embedding Generation
- Qdrant Integration
- Semantic Search
- Retrieval-Augmented Generation (RAG)
- Resume Chat
- Interview Coach

### Architecture

```text
Resume Upload
      │
      ▼
PDF Extraction
      │
      ▼
Embeddings
      │
      ▼
Qdrant
      │
      ▼
Retriever
      │
      ▼
LLM
      │
      ├── Resume Chat
      ├── Interview Coach
      ├── ATS Analysis
      └── Job Match Analysis
```

### Goals

- Learn Embeddings
- Learn Vector Databases
- Implement Semantic Search
- Build RAG Pipelines
- Context-Aware AI Applications

---

## 📌 Current Status

### Completed

- Express + TypeScript project setup
- Dockerized development environment
- LocalStack integration
- AWS SES local testing
- AWS S3 local testing
- Resume CRUD APIs
- Resume file uploads

### In Progress

#### Phase 1

- PDF text extraction
- ATS score generation
- Resume summary generation
- Job description management
- Resume-job matching

### Planned

#### Phase 2

- LangChain integration
- Embedding generation
- Qdrant integration
- Semantic search
- RAG pipeline
- Resume chat assistant
- Interview coach
- Kubernetes deployment
- CI/CD pipeline
- Observability and monitoring

---

## 🏗️ Long-Term Architecture

```text
Resume Upload
      │
      ▼
PDF Extraction
      │
      ▼
Embedding Generation
      │
      ▼
Qdrant
      │
      ▼
Retriever
      │
      ▼
LLM
      │
      ├── ATS Score
      ├── Resume Summary
      ├── Resume Feedback
      ├── Interview Questions
      ├── Answer Evaluation
      ├── Resume Chat
      ├── Interview Coach
      └── Job Match Analysis
```

---

## 📚 Learning Objectives

This project serves as a practical learning platform for:

### Backend Engineering

- Node.js
- Express.js
- TypeScript
- REST API Design

### AI Engineering

- OpenAI API
- Prompt Engineering
- Structured Output Generation
- LangChain
- RAG Architectures
- Context Management

### Data & Retrieval

- Embeddings
- Semantic Search
- Vector Databases
- Qdrant

### DevOps & Cloud

- Docker
- LocalStack
- AWS Services
- Kubernetes
- CI/CD Pipelines

---

## 🗺️ Roadmap

### Phase 1

- [x] Express + TypeScript setup
- [x] LocalStack integration
- [x] SES testing
- [x] S3 testing
- [x] Resume CRUD APIs
- [x] Resume file uploads
- [x] PDF text extraction
- [x] ATS score generation
- [x] Resume summary
- [x] Job description management
- [x] Resume-job matching

### Phase 2

- [ ] LangChain integration
- [ ] Embedding generation
- [ ] Qdrant integration
- [ ] Semantic search
- [ ] RAG implementation
- [ ] Resume chat
- [ ] Interview coach
- [ ] AI answer evaluation

---

**🚧 This project is actively being built as a learning journey into AI Engineering, LLM applications, RAG systems, embeddings, vector databases, and cloud-native backend development.**
