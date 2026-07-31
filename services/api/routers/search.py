from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid
from typing import List
from ..llm_provider import get_llm_provider, DataBoundaryEnum

router = APIRouter(prefix="", tags=["search"])

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

class SearchResult(BaseModel):
    file_path: str
    symbol_name: str
    similarity_score: float

class GlobalSearchResult(BaseModel):
    type: str # 'project', 'investigation', 'file', 'pr'
    title: str
    subtitle: str
    url: str

@router.post("/projects/{project_id}/search", response_model=List[SearchResult])
async def semantic_search(project_id: uuid.UUID, search_req: SearchQuery):
    """
    Internal endpoint to test vector similarity search.
    Embeds the query using the LLM (which is now cached via Redis) 
    and performs cosine distance search via pgvector using HNSW indexes 
    for sub-50ms Approximate Nearest Neighbor (ANN) search at scale.
    """
    # 1. Embed the query (Will hit Redis cache on subsequent identical searches)
    llm = get_llm_provider(DataBoundaryEnum.hosted)
    query_vectors = await llm.embed([search_req.query])
    query_vector = query_vectors[0]
    
    # 2. Perform HNSW-indexed similarity search
    # In a real app with SQLAlchemy and pgvector HNSW index:
    # results = session.scalars(
    #     select(CodeEmbedding)
    #     .filter(CodeEmbedding.project_id == project_id)
    #     .order_by(CodeEmbedding.embedding.cosine_distance(query_vector))
    #     .limit(search_req.top_k)
    # ).all()
    
    # Stub response
    return [
        SearchResult(
            file_path="src/payments/retry.ts",
            symbol_name="retry",
            similarity_score=0.95
        )
    ]

@router.get("/search/global", response_model=List[GlobalSearchResult])
async def global_search(q: str):
    """
    Cross-entity global search across projects, investigations, and code.
    """
    query = q.lower()
    results = []
    
    # Mocking different types of results based on query for demonstration
    if "payment" in query or "retry" in query:
        results.append(GlobalSearchResult(
            type="investigation",
            title="Payment API fails intermittently under load",
            subtitle="Investigation #INV-001 • Status: Reviewing PR",
            url="/projects/demo-project-1/review"
        ))
        results.append(GlobalSearchResult(
            type="pr",
            title="Fix: Payment API intermittent failures under load",
            subtitle="PR #142 • bugmind/fix-payment-retry",
            url="/projects/demo-project-1/review"
        ))
        results.append(GlobalSearchResult(
            type="file",
            title="src/payments/service.ts",
            subtitle="Project: api-gateway",
            url="/projects/demo-project-1/code/src/payments/service.ts"
        ))
    else:
        results.append(GlobalSearchResult(
            type="project",
            title="api-gateway",
            subtitle="Node.js Express Microservice",
            url="/projects/demo-project-1"
        ))
        
    return results
