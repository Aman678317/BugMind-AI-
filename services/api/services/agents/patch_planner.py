import json
from typing import Dict, Any, List
from ...llm_provider import get_llm_provider, DataBoundaryEnum

class PatchPlannerAgent:
    """
    Drafts a step-by-step strategy for fixing a bug based on the Root Cause Report
    and AST context, but does not write the actual code.
    """
    def __init__(self):
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)
        self.system_prompt = (
            "You are the Patch Planner Agent. You receive a Root Cause Report for a software bug. "
            "Your job is to draft a high-level, step-by-step strategy to fix it. "
            "Output ONLY valid JSON matching this schema: "
            "{'plan_strategy': 'string (markdown formatting allowed)', 'target_files': ['string']}"
        )

    async def draft_plan(self, root_cause_report: Dict[str, Any], ast_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Synthesizes the patch plan.
        """
        print("PatchPlannerAgent: Drafting fix strategy...")
        
        prompt = f"Root Cause Report: {json.dumps(root_cause_report)}\n\nAST Context: {json.dumps(ast_context or {})}"
        
        response = await self.llm.generate(
            prompt=prompt,
            system_prompt=self.system_prompt
        )
        
        try:
            clean_json = response.content.replace("```json", "").replace("```", "").strip()
            parsed_data = json.loads(clean_json)
            return parsed_data
        except json.JSONDecodeError:
            print("PatchPlannerAgent: Failed to parse LLM JSON. Returning fallback.")
            # Fallback mock for UI demonstration
            return {
                "plan_strategy": "### Step 1: Implement Retry Logic\nAdd a wrapper around the `processPayment` function in `src/payments/service.ts` to implement exponential backoff.\n\n### Step 2: Update Unit Tests\nUpdate `src/payments/retry.test.ts` to mock network failures and ensure the backoff is respected.",
                "target_files": [
                    "src/payments/service.ts",
                    "src/payments/retry.test.ts"
                ]
            }
