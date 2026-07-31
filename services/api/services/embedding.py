from typing import List, Dict
import uuid
from ..llm_provider import BaseLLMProvider
from ..models.code_embeddings import CodeEmbedding

class EmbeddingService:
    def __init__(self, llm_provider: BaseLLMProvider):
        self.llm_provider = llm_provider

    async def embed_and_store_cir(self, project_id: str, cir_data: List[Dict], cir_hash: str) -> List[CodeEmbedding]:
        """
        Takes the CIR output from the static analyzer, extracts the text to embed (e.g. function body),
        calls the LLM to embed it, and creates DB models.
        """
        # Collect texts to embed
        items_to_embed = []
        for file_data in cir_data:
            file_path = file_data["file_path"]
            for symbol in file_data["symbols"]:
                if symbol.get("body"):
                    text_to_embed = f"File: {file_path}\n{symbol['type']} {symbol['name']}\n{symbol['body']}"
                    items_to_embed.append({
                        "file_path": file_path,
                        "symbol_name": symbol["name"],
                        "symbol_type": symbol["type"],
                        "text": text_to_embed
                    })

        if not items_to_embed:
            return []

        # Generate embeddings in batches (simulated as a single call here for the stub)
        texts = [item["text"] for item in items_to_embed]
        vectors = await self.llm_provider.embed(texts)

        # Create SQLAlchemy models
        embeddings = []
        for item, vector in zip(items_to_embed, vectors):
            emb_model = CodeEmbedding(
                project_id=uuid.UUID(project_id),
                file_path=item["file_path"],
                symbol_name=item["symbol_name"],
                symbol_type=item["symbol_type"],
                cir_hash=cir_hash,
                embedding=vector
            )
            embeddings.append(emb_model)
        
        # In a real app, we would add these to the SQLAlchemy session and commit
        # session.add_all(embeddings)
        # await session.commit()
        
        return embeddings
