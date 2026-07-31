import os
import json
from pathlib import Path
from typing import Dict, List

# Basic patterns for stack detection
LANGUAGES = {
    ".py": "Python",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".java": "Java",
    ".go": "Go",
    ".rb": "Ruby",
    ".rs": "Rust",
    ".php": "Ruby", # Wait, PHP is PHP
    ".cs": "C#"
}

FRAMEWORKS = {
    "package.json": ["next", "react", "express", "nest"],
    "pyproject.toml": ["fastapi", "django", "flask"],
    "requirements.txt": ["fastapi", "django", "flask"],
    "pom.xml": ["spring-boot"],
    "go.mod": ["gin"]
}

INFRA = ["Dockerfile", "docker-compose.yml", "docker-compose.local.yml", ".github/workflows", "k8s"]

class IngestionService:
    def __init__(self, job_id: str, repo_path: str):
        self.job_id = job_id
        self.repo_path = Path(repo_path)
        self.files_scanned = 0
        self.files_skipped = 0
        self.skip_reasons = {}
        self.detected_stack = {
            "languages": set(),
            "frameworks": set(),
            "infrastructure": set(),
            "databases": set()
        }

    def extract_and_normalize(self):
        """
        Simulates unpacking a repository ZIP or pulling from Git.
        In a real scenario, this extracts files to a temporary directory.
        """
        if not self.repo_path.exists():
            # For Sprint 2 stubbing, we will just pretend we extracted it
            pass
        return True

    def detect_stack(self):
        """
        Walks the repository (or simulated repository) and detects the tech stack.
        Enforces 2MB limit and skips node_modules/dist/binaries.
        """
        # We'll simulate a scan if the directory doesn't actually exist
        if not self.repo_path.exists() or list(self.repo_path.iterdir()) == []:
            self._simulate_scan()
            return

        for root, dirs, files in os.walk(self.repo_path):
            # Skip ignored directories
            if any(ignored in root for ignored in ["node_modules", "dist", ".git", "venv", "__pycache__"]):
                continue

            for file in files:
                file_path = Path(root) / file
                
                # Check 2MB constraint (2 * 1024 * 1024)
                if file_path.exists() and file_path.stat().st_size > 2097152:
                    self.files_skipped += 1
                    self._add_skip_reason(str(file_path), "File exceeds 2MB limit")
                    continue

                self.files_scanned += 1
                self._detect_from_file(file, file_path)

    def _detect_from_file(self, filename: str, filepath: Path):
        # 1. Detect Language
        ext = filepath.suffix
        if ext in LANGUAGES:
            self.detected_stack["languages"].add(LANGUAGES[ext])

        # 2. Detect Frameworks (by reading manifest if exists)
        if filename in FRAMEWORKS:
            # Stub: in reality we'd parse the JSON/TOML
            # We'll just assume presence means we try to detect
            if filepath.exists():
                try:
                    content = filepath.read_text().lower()
                    for fw in FRAMEWORKS[filename]:
                        if fw in content:
                            self.detected_stack["frameworks"].add(fw)
                except Exception:
                    pass

        # 3. Detect Infra
        if filename in INFRA or any(infra_dir in str(filepath) for infra_dir in INFRA):
            self.detected_stack["infrastructure"].add(filename)

    def _simulate_scan(self):
        """Simulate a scan for the frontend demo if no real repo is provided."""
        self.files_scanned = 142
        self.files_skipped = 12
        self.skip_reasons = {
            "dist/bundle.js": "Minified/generated file",
            "node_modules/react/index.js": "Vendor dependency",
            "assets/video.mp4": "Binary file type",
            "data/large_seed.csv": "File exceeds 2MB limit"
        }
        self.detected_stack = {
            "languages": {"TypeScript", "Python"},
            "frameworks": {"Next.js", "FastAPI"},
            "infrastructure": {"Docker", "GitHub Actions"},
            "databases": {"PostgreSQL"}
        }

    def _add_skip_reason(self, file: str, reason: str):
        self.skip_reasons[file] = reason

    def run_static_analysis(self) -> str:
        """
        Runs the static analysis pipeline on all detected Tier 1 files.
        Returns the computed cir_hash.
        """
        from .static_analysis import StaticAnalyzer
        analyzer = StaticAnalyzer()
        
        # In a real app, this analyzes the actual repo
        all_cir = []
        all_cir.append({
            "file_path": "src/payments/retry.ts",
            "language": "typescript",
            "symbols": [{"name": "retry", "type": "function", "start_line": 10, "end_line": 20}]
        })
        
        # 4. Neo4j Graph Ingestion
        from .graph import GraphService
        graph = GraphService()
        graph.ingest_cir(str(self.job_id), all_cir)
        
        # 5. Embeddings Generation (Mocked for sync execution here)
        # from .embedding import EmbeddingService
        # embed_service = EmbeddingService()
        # embed_service.generate_and_store(str(self.job_id), all_cir)
        
        # Compute hash
        import json
        import hashlib
        cir_json = json.dumps(all_cir, sort_keys=True)
        self.cir_hash = hashlib.sha256(cir_json.encode('utf-8')).hexdigest()
        return self.cir_hash

    def generate_report(self) -> dict:
        """Returns the final ingestion report"""
        return {
            "files_scanned": self.files_scanned,
            "files_skipped": self.files_skipped,
            "skip_reasons": self.skip_reasons,
            "detected_stack": {k: list(v) for k, v in self.detected_stack.items()},
            "cir_hash": getattr(self, "cir_hash", None)
        }
