from typing import List, Dict, Any

class StaticBugDetector:
    """
    Scans Code Intermediate Representation (CIR) and AST for static logic bugs,
    secrets, and syntax errors.
    """
    def __init__(self):
        # In a real implementation, this would load rulesets for various languages
        pass

    def scan_cir(self, cir_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Simulates scanning the codebase for static bugs.
        """
        print("Mock: Running StaticBugDetector...")
        
        # We'll return a mock finding for the UI
        findings = [
            {
                "category": "security_vulnerability",
                "severity": "critical",
                "priority": "P0",
                "problem_summary": "Hardcoded AWS Secret Access Key found in payment service configuration.",
                "confidence_score": 98,
                "evidence": [
                    {
                        "agent": "Security Agent",
                        "type": "file_reference",
                        "reference": {
                            "file": "src/payments/config.ts",
                            "line": 14,
                            "snippet": "const AWS_SECRET = 'AKIAIOSFODNN7EXAMPLE';"
                        }
                    }
                ],
                "affected_files": ["src/payments/config.ts"],
                "alternative_hypotheses": [],
                "recommended_fix": "Remove the hardcoded secret and load it from environment variables using `process.env.AWS_SECRET_ACCESS_KEY`."
            }
        ]
        
        return findings
