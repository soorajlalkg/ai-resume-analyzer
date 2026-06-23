# 🚀 TalentMatch AI

AI-powered Resume Analysis, ATS Scoring, Semantic Job Matching, and Candidate Discovery Platform built with Node.js, TypeScript, LangChain, OpenAI, PostgreSQL, and Qdrant.

---

## Overview

TalentMatch AI is a production-inspired AI recruitment platform designed to explore modern AI application development patterns including:

* Resume Parsing
* ATS Analysis
* Semantic Search
* Vector Databases
* Embeddings
* Retrieval-Augmented Generation (RAG)
* Candidate Matching
* Job Matching
* AI-Powered Career Assistance

The project serves as a hands-on learning platform for AI Engineering and Backend Development.

---

## Key Features

### Resume Management

* Resume Upload
* PDF Text Extraction
* AWS S3 Storage
* Resume Version Management

### ATS Analysis

Generate:

* ATS Compatibility Score
* Resume Strengths
* Missing Keywords
* Improvement Recommendations

### Resume Summary

Generate AI-powered candidate summaries including:

* Experience Overview
* Technical Skills
* Key Achievements
* Career Highlights

### Semantic Job Matching

Find relevant jobs based on resume content using:

* OpenAI Embeddings
* Qdrant Vector Database
* Vector Similarity Search

Generate:

* Match Percentage
* Strengths
* Missing Skills
* Recommendations
* Match Category

Categories:

* Top Match
* Medium Match
* Low Match

### Candidate Discovery

Find the most relevant candidates for a job description using:

* Semantic Search
* Vector Similarity
* AI Ranking

Generate:

* Candidate Match Percentage
* Missing Skills
* Candidate Strengths
* Hiring Recommendations

---

## Architecture

### Resume to Job Matching

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
Qdrant Vector Search
      │
      ▼
Top Matching Jobs
      │
      ▼
LLM Analysis
      │
      ▼
Match Results Cache
```

### Job to Candidate Matching

```text
Job Description
      │
      ▼
Embedding Generation
      │
      ▼
Qdrant Vector Search
      │
      ▼
Top Matching Resumes
      │
      ▼
LLM Analysis
      │
      ▼
Match Results Cache
```

---

## Technology Stack

### Backend

* Node.js
* Express.js
* TypeScript
* TypeORM

### Database

* PostgreSQL

### AI & LLM

* OpenAI
* LangChain

### Vector Search

* OpenAI Embeddings
* Qdrant

### Cloud Storage

* AWS S3
* LocalStack

### DevOps

* Docker
* Docker Compose

---

## AI Concepts Implemented

### Prompt Engineering

Structured prompts for:

* ATS Analysis
* Resume Summary
* Resume-Job Matching

### Structured Outputs

Using:

* Zod
* LangChain Structured Output

### Embeddings

Generate vector representations for:

* Resumes
* Job Descriptions

### Vector Search

Perform nearest-neighbor search using Qdrant.

### Semantic Search

Match content based on meaning rather than exact keywords.

Examples:

* AWS ↔ Amazon Web Services
* Kafka ↔ Event Streaming
* Backend APIs ↔ REST Services

### Retrieval

Retrieve top relevant resumes or jobs before LLM analysis.

---

## Current Features

### Completed

* Express + TypeScript Setup
* PostgreSQL Integration
* LocalStack Integration
* AWS S3 Integration
* Resume Upload
* PDF Text Extraction
* ATS Analysis
* Resume Summary
* Job Description Management
* LangChain Integration
* OpenAI Embeddings
* Qdrant Integration
* Resume Embedding Storage
* Job Embedding Storage
* Resume → Job Matching
* Job → Resume Matching
* Match Result Caching
* Vector Search

---

## Upcoming Features

### Semantic Search Improvements

* Hybrid Search
* Keyword + Vector Search

### RAG

Implement:

```text
Question
      │
      ▼
Retriever
      │
      ▼
Relevant Resume Chunks
      │
      ▼
LLM
```

Features:

* Resume Chat
* Resume Q&A
* Candidate Insights

### Interview Coach

Generate:

* Interview Questions
* Technical Assessments
* Answer Evaluation
* Hiring Recommendations

### AI Workflows

Explore:

* LangGraph
* Agentic Workflows
* Tool Calling

---

## Learning Objectives

### Backend Engineering

* Node.js
* TypeScript
* REST APIs
* Database Design
* Clean Architecture

### AI Engineering

* OpenAI APIs
* LangChain
* Prompt Engineering
* Structured Outputs
* Retrieval Systems

### RAG Systems

* Embeddings
* Vector Databases
* Qdrant
* Semantic Search
* Retrieval-Augmented Generation

### Cloud & DevOps

* Docker
* AWS S3
* LocalStack

---

## Future Architecture

```text
Resume Upload
      │
      ▼
PDF Extraction
      │
      ▼
Chunking
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
      ├── ATS Analysis
      ├── Resume Summary
      ├── Job Matching
      ├── Candidate Matching
      ├── Resume Chat
      ├── Interview Coach
      ├── Skill Gap Analysis
      └── Career Guidance
```

---

## Project Status

Actively under development as a practical AI Engineering project focused on:

* LangChain
* OpenAI
* Vector Databases
* Semantic Search
* Retrieval Systems
* RAG Architectures
* Cloud-Native Backend Development
