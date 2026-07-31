import uuid
from typing import List, Dict
import asyncio
from ..llm_provider import get_llm_provider, DataBoundaryEnum
from ..models.investigation import InvestigationSession, InvestigationStep, InvestigationStatusEnum

class InvestigationService:
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.llm = get_llm_provider(DataBoundaryEnum.hosted)

    async def run_investigation(self, bug_description: str) -> InvestigationSession:
        """
        Runs the autonomous AI loop to investigate a bug.
        """
        session_id = uuid.uuid4()
        
        # In a real system, we'd save this to DB immediately
        session = InvestigationSession(
            id=session_id,
            project_id=uuid.UUID(self.project_id),
            bug_description=bug_description,
            status=InvestigationStatusEnum.running
        )
        
        steps = []
        
        # Step 1: LLM decides to search
        steps.append(InvestigationStep(
            session_id=session_id,
            action_type="search",
            details={"query": "payment timeout retries"}
        ))
        await asyncio.sleep(1) # simulate work
        
        # Step 2: LLM decides to read a file based on search results
        steps.append(InvestigationStep(
            session_id=session_id,
            action_type="read_file",
            details={"file": "src/payments/retry.ts"}
        ))
        await asyncio.sleep(1)
        
        # Step 3: LLM analyzes the file
        steps.append(InvestigationStep(
            session_id=session_id,
            action_type="analyze",
            details={"findings": "The retry loop does not have exponential backoff."}
        ))
        await asyncio.sleep(1)
        
        # Step 4: Run V3 Investigation Pipeline
        from .agents.runtime_agent import RuntimeAgent
        from .graph import GraphService
        from .agents.specialists import SecurityAgent, DatabaseAgent, BackendAgent
        from .agents.root_cause import RootCauseAgent
        
        # 4a. Parse Runtime Error (Mocking the payload for now)
        runtime_agent = RuntimeAgent()
        parsed_trace = await runtime_agent.parse_trace(bug_description)
        
        # 4b. Correlate to Graph
        graph = GraphService()
        subgraph = graph.correlate_runtime_trace(str(self.job_id), parsed_trace)
        
        # 4c. Gather Specialist Evidence
        # In a real app we'd run these concurrently via asyncio.gather
        evidence = []
        backend_agent = BackendAgent()
        evidence.append(await backend_agent.investigate(subgraph))
        
        db_agent = DatabaseAgent()
        evidence.append(await db_agent.investigate(subgraph))
        
        # Format the mock evidence to match the UI's expected structure
        formatted_evidence = [
            {
                "agent": e["agent"],
                "type": "graph_relationship",
                "reference": {"snippet": e["findings"], "file": "src/payments/service.ts", "line": 42}
            } for e in evidence
        ]
        
        # 4d. Synthesize via Root Cause Agent
        rca = RootCauseAgent()
        final_report = await rca.synthesize(parsed_trace, formatted_evidence)
        
        session.status = InvestigationStatusEnum.completed
        session.severity = final_report.get("severity", "medium")
        session.problem_summary = final_report.get("problem_summary", "Unknown issue")
        session.root_cause_hypothesis = session.problem_summary # Fallback
        session.confidence_score = final_report.get("confidence_score", 0)
        session.affected_files = final_report.get("affected_files", [])
        session.alternative_hypotheses = final_report.get("alternative_hypotheses", [])
        session.recommended_fix = final_report.get("recommended_fix", "")
        
        setattr(session, 'rich_evidence', final_report.get("evidence", []))
        
        session.steps = steps
        
        return session
