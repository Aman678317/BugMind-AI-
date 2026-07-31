import json
from typing import Dict, Any
from ...llm_provider import get_llm_provider, DataBoundaryEnum

class RuntimeAgent:
    """
    Specialized agent responsible for parsing messy runtime logs/traces into
    structured actionable hints (symbols, files, timestamps) to feed the orchestrator.
    """
    def __init__(self):
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)
        self.system_prompt = (
            "You are a telemetry parsing agent. Your job is to extract structured data from raw error logs and stack traces. "
            "Output ONLY valid JSON matching this schema: "
            "{'error_message': 'string', 'files': ['string'], 'functions': ['string'], 'timestamp': 'string'}"
        )

    async def parse_trace(self, raw_trace: str) -> Dict[str, Any]:
        """
        Parses a raw stack trace string into structured data.
        """
        print("RuntimeAgent: Parsing raw trace...")
        
        prompt = f"Extract the relevant files and functions from this trace:\n\n{raw_trace}"
        
        response = await self.llm.generate(
            prompt=prompt,
            system_prompt=self.system_prompt
        )
        
        try:
            # We assume the LLM provider (or our wrapper) strips markdown formatting 
            # and returns clean JSON based on the system prompt.
            # For robustness we clean it up
            clean_json = response.content.replace("```json", "").replace("```", "").strip()
            parsed_data = json.loads(clean_json)
            return parsed_data
        except json.JSONDecodeError:
            print("RuntimeAgent: Failed to parse LLM JSON. Returning raw content.")
            return {
                "error_message": "Failed to parse JSON",
                "files": [],
                "functions": [],
                "raw": response.content
            }
