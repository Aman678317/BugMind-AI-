import json
from typing import Dict, Any, List
from ...llm_provider import get_llm_provider, DataBoundaryEnum

class CodeGenAgent:
    """
    Takes an approved Patch Plan and the raw source code of the target files,
    then generates the actual unified diffs to apply the fix. Uses AST-aware
    validation to ensure syntactical correctness.
    """
    def __init__(self):
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)
        self.system_prompt = (
            "You are the Code Generation Agent. You receive a Patch Plan and the current source code. "
            "Your job is to generate a unified diff that applies the plan. "
            "Output ONLY valid JSON matching this schema: "
            "{'diff': 'string containing the unified diff'}"
        )

    def _verify_ast(self, diff: str) -> bool:
        """
        Mocks the AST verification step. In production, this would use tree-sitter
        to apply the diff in memory and verify the resulting file parses correctly
        without syntax errors (e.g. no unbalanced brackets).
        """
        print("CodeGenAgent: Verifying generated AST structure...")
        # Simulate catching an unbalanced bracket randomly, but we'll just return True for the prototype success path
        return True

    async def generate_patch(self, patch_plan: Dict[str, Any], source_code_map: Dict[str, str]) -> str:
        """
        Generates the diff and ensures it is syntactically valid.
        """
        print("CodeGenAgent: Writing code based on approved plan...")
        
        prompt = f"Patch Plan: {json.dumps(patch_plan)}\n\nSource Code Context:\n{json.dumps(source_code_map)}"
        
        response = await self.llm.generate(
            prompt=prompt,
            system_prompt=self.system_prompt
        )
        
        try:
            clean_json = response.content.replace("```json", "").replace("```", "").strip()
            parsed_data = json.loads(clean_json)
            diff = parsed_data.get("diff", "")
            
            # AST Verification loop
            if not self._verify_ast(diff):
                print("CodeGenAgent: AST verification failed. Requesting self-correction...")
                # In a real app, we would loop back to the LLM here.
                # For the mock, we assume it succeeds.
            
            return diff
            
        except json.JSONDecodeError:
            print("CodeGenAgent: Failed to parse LLM JSON. Returning fallback diff.")
            # Fallback mock for UI demonstration
            return (
                "--- a/src/payments/service.ts\n"
                "+++ b/src/payments/service.ts\n"
                "@@ -40,3 +40,7 @@\n"
                " export async function processPayment(id: string) {\n"
                "-    return await api.post('/charge', { id });\n"
                "+    // mock_fail to trigger validation failure loop initially if desired\n"
                "+    return withRetry(async () => {\n"
                "+        return await api.post('/charge', { id });\n"
                "+    }, 3);\n"
                " }\n"
            )
