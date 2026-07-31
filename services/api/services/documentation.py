import uuid
from typing import List
from ..llm_provider import get_llm_provider, DataBoundaryEnum
from ..models.system_documents import SystemDocument, DocTypeEnum, DocStatusEnum

class DocumentationService:
    def __init__(self, project_id: str):
        self.project_id = project_id
        # In a real setup, we would inject the LLM provider based on the project's organization tier
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)

    async def generate_drafts(self, ingestion_report: dict) -> List[SystemDocument]:
        """
        Generates the three core architectural documents based on the ingested context.
        """
        context_str = f"Detected Stack: {ingestion_report.get('detected_stack', {})}\n"
        context_str += f"Files Scanned: {ingestion_report.get('files_scanned', 0)}\n"

        # Prompts based on PRD requirements
        prompts = [
            (
                DocTypeEnum.summary,
                "Executive Summary",
                f"Based on the following repository context, write an Executive Summary for this software project. Explain what the project likely does, its tech stack, and its primary purpose. Context: {context_str}"
            ),
            (
                DocTypeEnum.structure,
                "Folder Structure",
                f"Based on the following repository context, provide a high-level Folder Structure breakdown. Describe where the frontend, backend, and infrastructure code likely live. Context: {context_str}"
            ),
            (
                DocTypeEnum.architecture,
                "Component Architecture",
                f"Based on the following repository context, write a Component Architecture document. Outline the main moving parts (e.g., API, UI, Database) and how they communicate. Context: {context_str}"
            )
        ]

        generated_docs = []
        for doc_type, title, prompt in prompts:
            # Call LLM
            response = await self.llm.generate(
                prompt=prompt,
                system_prompt="You are a Senior Staff Engineer drafting architectural documentation. Output cleanly formatted Markdown."
            )
            
            # Create DB Model
            doc = SystemDocument(
                project_id=uuid.UUID(self.project_id),
                title=title,
                content=response.content,
                doc_type=doc_type,
                status=DocStatusEnum.draft
            )
            generated_docs.append(doc)

        # In a real app: session.add_all(generated_docs); session.commit()
        return generated_docs
