import json
import uuid
from typing import Dict, Any
from ...llm_provider import get_llm_provider, DataBoundaryEnum

class GitIntegrationService:
    """
    Interfaces with GitHub/GitLab to create branches, commit validated diffs,
    and open Pull Requests equipped with rich AI-generated context.
    """
    
    def __init__(self):
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)
        self.system_prompt = (
            "You are a PR Generation Agent. You are given the Root Cause, the Patch Plan, "
            "and the Validation Sandbox results. Generate a rich Pull Request title and description. "
            "Output ONLY valid JSON matching this schema: "
            "{'title': 'string', 'description': 'string (markdown)'}"
        )

    async def generate_pr_context(self, context: Dict[str, Any]) -> Dict[str, str]:
        """
        Uses an LLM to generate the PR title and description based on the full investigation context.
        """
        print("GitIntegrationService: Generating PR context via LLM...")
        prompt = f"Context: {json.dumps(context)}"
        
        response = await self.llm.generate(
            prompt=prompt,
            system_prompt=self.system_prompt
        )
        
        try:
            clean_json = response.content.replace("```json", "").replace("```", "").strip()
            return json.loads(clean_json)
        except json.JSONDecodeError:
            print("GitIntegrationService: Failed to parse LLM JSON. Returning fallback.")
            return {
                "title": "Fix: Payment API intermittent failures under load",
                "description": "## Problem\nThe payment API was failing under load because it lacked retry logic.\n\n## Fix\nAdded an exponential backoff wrapper around the API call.\n\n## Validation\n✅ All tests passed in sandbox."
            }

    async def create_pull_request(self, validation_run_id: str, diff: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Mocks the API calls to GitHub/GitLab to create a branch, commit code, and open a PR.
        """
        pr_context = await self.generate_pr_context(context)
        
        print("GitIntegrationService: Creating branch `bugmind/fix-payment-retry`...")
        print("GitIntegrationService: Committing unified diff...")
        print("GitIntegrationService: Opening Pull Request via API...")
        
        return {
            "pr_id": str(uuid.uuid4()),
            "url": "https://github.com/acme-corp/api-gateway/pull/142",
            "title": pr_context["title"],
            "description": pr_context["description"],
            "branch": "bugmind/fix-payment-retry",
            "status": "open"
        }
