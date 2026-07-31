from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import uuid
from typing import List, Optional
from datetime import datetime
from ..llm_provider import get_llm_provider, DataBoundaryEnum
from ..models.chat import ChatRoleEnum

router = APIRouter(prefix="/projects/{project_id}/chat", tags=["chat"])

class ChatMessagePayload(BaseModel):
    role: ChatRoleEnum
    content: str
    
class ChatRequest(BaseModel):
    session_id: Optional[uuid.UUID] = None
    message: str

class ChatResponse(BaseModel):
    session_id: uuid.UUID
    message: ChatMessagePayload

@router.post("", response_model=ChatResponse)
async def send_chat_message(project_id: uuid.UUID, req: ChatRequest):
    """
    Receives a message, executes a RAG pipeline (embed -> search -> inject -> generate),
    and returns the LLM response.
    """
    session_id = req.session_id or uuid.uuid4()
    
    # 1. Save user message to DB (Stubbed)
    
    llm = get_llm_provider(DataBoundaryEnum.hosted)
    
    # 2. Embed the user's query
    query_vectors = await llm.embed([req.message])
    query_vector = query_vectors[0]
    
    # 3. Perform Semantic Search (Stubbed)
    # In reality: SELECT ... ORDER BY embedding <=> query_vector LIMIT 3
    mock_retrieved_code = \"\"\"
    // File: src/payments/retry.ts
    function retryPayment(transactionId: string, attempts: number = 3) {
        if (attempts <= 0) throw new Error("Payment failed after retries");
        return executePayment(transactionId).catch(() => retryPayment(transactionId, attempts - 1));
    }
    \"\"\"
    
    # 4. Construct Augmented Prompt
    system_prompt = (
        "You are BugMind AI, an expert senior software engineer. "
        "Answer the user's questions based ONLY on the following codebase context. "
        "Always cite the file path of the code you reference.\n\n"
        f"--- CODEBASE CONTEXT ---\n{mock_retrieved_code}\n------------------------"
    )
    
    # 5. Call LLM
    llm_response = await llm.generate(
        prompt=req.message,
        system_prompt=system_prompt
    )
    
    # 6. Save assistant response to DB (Stubbed)
    
    # Return response
    return ChatResponse(
        session_id=session_id,
        message=ChatMessagePayload(
            role=ChatRoleEnum.assistant,
            content=llm_response.content
        )
    )

@router.get("/sessions")
async def get_chat_sessions(project_id: uuid.UUID):
    """Returns a list of previous chat sessions for the project."""
    # Stub: Normally query DB
    return []
