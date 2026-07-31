from typing import Dict, Any, List

class BaseSpecialistAgent:
    def __init__(self, name: str, role_description: str):
        self.name = name
        self.role_description = role_description

    async def investigate(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Base investigation method. In a real application, this would invoke
        the LLM with specific prompt templates and tools tailored to the agent's role.
        """
        print(f"{self.name} analyzing context...")
        return {
            "agent": self.name,
            "findings": "Mock findings based on static/runtime context",
            "confidence": 85
        }

class SecurityAgent(BaseSpecialistAgent):
    def __init__(self):
        super().__init__(
            name="Security Agent",
            role_description="Flags vulnerabilities, secrets, and unsafe patterns."
        )

class PerformanceAgent(BaseSpecialistAgent):
    def __init__(self):
        super().__init__(
            name="Performance Agent",
            role_description="Flags bottlenecks, N+1 queries, and memory/CPU hot spots."
        )

class DatabaseAgent(BaseSpecialistAgent):
    def __init__(self):
        super().__init__(
            name="Database Agent",
            role_description="Analyzes schema, queries, and connection pools."
        )

class FrontendAgent(BaseSpecialistAgent):
    def __init__(self):
        super().__init__(
            name="Frontend Agent",
            role_description="Traces component-to-API-to-data flow."
        )

class BackendAgent(BaseSpecialistAgent):
    def __init__(self):
        super().__init__(
            name="Backend Agent",
            role_description="Traces service-to-controller-to-repository flows."
        )
