# 🚧 AI Resume Analyzer API

An AI-powered Resume Analysis platform built with **Node.js**, **Express**, and **TypeScript**.

This project is currently a **work in progress** and is being developed primarily as a learning project to gain hands-on experience with:

* Large Language Models (LLMs)
* Retrieval-Augmented Generation (RAG)
* LangChain
* Vector Databases
* Embeddings & Semantic Search

---

## 🎯 Project Goals

The goal of this project is to build a real-world AI application that can:

* Analyze resumes using AI
* Generate ATS compatibility scores
* Create interview questions based on resume content
* Evaluate interview answers
* Match resumes against job descriptions
* Explore RAG-based document retrieval
* Learn vector search and embedding workflows

---

## 🧰 Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript

### AI & RAG (Planned)

* OpenAI / LLM Provider
* LangChain
* Embeddings
* Retrieval-Augmented Generation (RAG)

### Storage (Planned)

* PostgreSQL
* Vector Database (Pinecone, Qdrant, Weaviate, or Chroma)

### DevOps

* LocalStack

---

## 📌 Current Status

### Completed

* Express + TypeScript project setup
* Dockerized development environment
* LocalStack integration
* AWS SES local testing
* AWS S3 local testing
* Basic API structure

### In Progress

* Resume management APIs
* ATS score generation
* Interview question generation
* AI integration
* Job description management
* Resume-job matching

### Planned

* LangChain integration
* Vector database integration
* Embedding generation
* RAG pipeline
* Kubernetes deployment
* CI/CD pipeline
* Observability and monitoring

---

## 🏗️ Planned Architecture

```text
Resume Upload
      │
      ▼
Text Extraction
      │
      ▼
Embedding Generation
      │
      ▼
Vector Database
      │
      ▼
Retriever (RAG)
      │
      ▼
LLM
      │
      ├── ATS Score
      ├── Resume Feedback
      ├── Interview Questions
      ├── Answer Evaluation
      └── Job Match Analysis
```

---

## 🚀 Planned API Endpoints

### Resume Analysis

```http
POST /api/resumes/:resumeId/ats-score
```

Generate ATS compatibility score and recommendations.

### Interview Questions

```http
POST /api/resumes/:resumeId/interview-questions
```

Generate interview questions based on resume content.

### Answer Evaluation

```http
POST /api/interview/evaluate
```

Evaluate interview answers using AI.

---

## 📄 Job Descriptions

### Create Job Description

```http
POST /api/job-descriptions
```

### Get All Job Descriptions

```http
GET /api/job-descriptions
```

### Get Single Job Description

```http
GET /api/job-descriptions/:jobDescriptionId
```

### Delete Job Description

```http
DELETE /api/job-descriptions/:jobDescriptionId
```

---

## 📊 Resume Match Analysis

### Analyze Resume Against Job Description

```http
POST /api/analysis
```

Example request:

```json
{
  "resumeId": "uuid",
  "jobDescriptionId": "uuid"
}
```

Planned response:

```json
{
  "analysisId": "uuid",
  "matchPercentage": 82,
  "strengths": [],
  "missingSkills": [],
  "recommendations": []
}
```

---

## 🐳 Local Development

### Start LocalStack

```bash
docker-compose up -d
```

### Verify LocalStack

```bash
curl http://localhost:4566/_localstack/health
```

---

## 📧 SES Testing

### Verify Email Identity

```bash
aws --endpoint-url=http://localhost:4566 \
  ses verify-email-identity \
  --email-address notifications@test.com
```

### List Identities

```bash
aws --endpoint-url=http://localhost:4566 \
  ses list-identities
```

---

## 🪣 S3 Testing

### Create Bucket

```bash
aws --endpoint-url=http://localhost:4566 \
  s3api create-bucket \
  --bucket my-test-bucket
```

### List Buckets

```bash
aws --endpoint-url=http://localhost:4566 \
  s3 ls
```

---

## 🗺️ Roadmap

* [x] Express + TypeScript setup
* [x] LocalStack integration
* [x] SES testing
* [x] S3 testing
* [x] Resume CRUD APIs
* [x] Resume file uploads
* [ ] ATS score generation
* [ ] Interview question generation
* [ ] AI answer evaluation
* [ ] Job description management
* [ ] Resume-job matching
* [ ] LangChain integration
* [ ] Embedding generation
* [ ] Vector database integration
* [ ] RAG implementation

---

## 📚 Learning Objectives

This project serves as a practical learning platform for:

* TypeScript Backend Development
* REST API Design
* AI Application Development
* LangChain
* RAG Architectures
* Vector Databases
* Docker
* LocalStack
* AWS Services

---

**🚧 This project is actively being built and will evolve as I learn more about AI engineering, RAG systems, vector databases, and cloud-native application development.**
