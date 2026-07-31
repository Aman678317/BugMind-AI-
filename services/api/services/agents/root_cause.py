import json
from typing import Dict, Any, List
from ...llm_provider import get_llm_provider, DataBoundaryEnum

class RootCauseAgent:
    """
    Master synthesizer agent. Takes findings from all specialist agents,
    evaluates them, and produces a final, cohesive root cause report.
    """
    def __init__(self):
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)
        self.system_prompt = (
            "You are the Root Cause Agent. You receive evidence from multiple specialized agents. "
            "Your job is to synthesize this into a final report. "
            "Output ONLY valid JSON matching this schema: "
            "{'problem_summary': 'string', 'severity': 'high|medium|low|critical', "
            "'confidence_score': integer 0-100, 'affected_files': ['string'], "
            "'alternative_hypotheses': [{'summary': 'string', 'reason': 'string'}], "
            "'recommended_fix': 'string', 'fix_risk': 'string'}"
        )

    async def synthesize(self, raw_trace: Dict[str, Any], specialist_evidence: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Synthesizes the final report from gathered evidence.
        """
        print("RootCauseAgent: Synthesizing final report...")
        
        prompt = f"Original Trace: {json.dumps(raw_trace)}\n\nAgent Evidence:\n{json.dumps(specialist_evidence)}"
        
        response = await self.llm.generate(
            prompt=prompt,
            system_prompt=self.system_prompt
        )
        
        try:
            clean_json = response.content.replace("```json", "").replace("```", "").strip()
            parsed_data = json.loads(clean_json)
            # Attach the raw evidence back so the UI can display it
            parsed_data["evidence"] = specialist_evidence
            return parsed_data
        except json.JSONDecodeError:
            print("RootCauseAgent: Failed to parse LLM JSON. Returning fallback.")
            return {
                "problem_summary": "Failed to synthesize root cause from evidence.",
                "severity": "high",
                "confidence_score": 0,
                "affected_files": [],
                "alternative_hypotheses": [],
                "recommended_fix": "Manual investigation required.",
                "fix_risk": "unknown",
                "evidence": specialist_evidence
            }
