from abc import ABC, abstractmethod
from pydantic import BaseModel
import os
import hashlib
from typing import List
from .models.organizations import DataBoundaryEnum
from .services.cache import CacheService

class LLMResponse(BaseModel):
    content: str
    prompt_tokens: int
    completion_tokens: int

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(self, prompt: str, system_prompt: str = "") -> LLMResponse:
        pass

    @abstractmethod
    async def embed(self, texts: List[str]) -> List[List[float]]:
        """Generates vector embeddings for a list of strings."""
        pass

class GeminiProvider(BaseLLMProvider):
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")

    async def generate(self, prompt: str, system_prompt: str = "") -> LLMResponse:
        # TODO (Production): Replace this stub with the actual call to the Gemini API using `google-genai`
        return LLMResponse(
            content=f"Stub response from Gemini for prompt: {prompt[:20]}...",
            prompt_tokens=10,
            completion_tokens=20
        )

    async def embed(self, texts: List[str]) -> List[List[float]]:
        results = []
        for text in texts:
            # Create a cache key hash
            text_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
            cache_key = f"embed:gemini:{text_hash}"
            
            cached_vector = await CacheService.get(cache_key)
            if cached_vector:
                print(f"Cache Hit: {cache_key}")
                results.append(cached_vector)
            else:
                print(f"Cache Miss: {cache_key} - Fetching from LLM...")
                # Mock LLM fetch delay/response
                vector = [0.1] * 768
                await CacheService.set(cache_key, vector)
                results.append(vector)
                
        return results

class SelfHostedProvider(BaseLLMProvider):
    def __init__(self):
        # Configuration for self-hosted LLM (e.g., vLLM endpoint)
        pass
    
    async def generate(self, prompt: str, system_prompt: str = "") -> LLMResponse:
        return LLMResponse(
            content="Stub response from Self-Hosted LLM",
            prompt_tokens=10,
            completion_tokens=20
        )

    async def embed(self, texts: List[str]) -> List[List[float]]:
        results = []
        for text in texts:
            text_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
            cache_key = f"embed:selfhosted:{text_hash}"
            
            cached_vector = await CacheService.get(cache_key)
            if cached_vector:
                print(f"Cache Hit: {cache_key}")
                results.append(cached_vector)
            else:
                print(f"Cache Miss: {cache_key} - Fetching from LLM...")
                vector = [0.2] * 768
                await CacheService.set(cache_key, vector)
                results.append(vector)
                
        return results

def get_llm_provider(data_boundary: DataBoundaryEnum) -> BaseLLMProvider:
    """
    Factory function to return the correct LLM provider based on the organization's data boundary.
    """
    if data_boundary == DataBoundaryEnum.self_hosted:
        return SelfHostedProvider()
    return GeminiProvider()
