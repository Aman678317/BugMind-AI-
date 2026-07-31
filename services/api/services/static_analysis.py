from pathlib import Path
import hashlib
from typing import Dict, List, Optional
import tree_sitter
import tree_sitter_python
import tree_sitter_typescript
import tree_sitter_javascript

class CIRSymbol:
    def __init__(self, name: str, type: str, start_line: int, end_line: int, body: str = ""):
        self.name = name
        self.type = type # "function", "class", "import", "call_site"
        self.start_line = start_line
        self.end_line = end_line
        self.body = body

    def to_dict(self):
        return {
            "name": self.name,
            "type": self.type,
            "start_line": self.start_line,
            "end_line": self.end_line,
            "body": self.body
        }

class StaticAnalyzer:
    def __init__(self):
        self.parsers = {}
        self._init_parsers()

    def _init_parsers(self):
        # Python Parser
        py_lang = tree_sitter.Language(tree_sitter_python.language(), "python")
        py_parser = tree_sitter.Parser()
        py_parser.set_language(py_lang)
        self.parsers[".py"] = py_parser

        # TS/JS Parser
        ts_lang = tree_sitter.Language(tree_sitter_typescript.language_typescript(), "typescript")
        ts_parser = tree_sitter.Parser()
        ts_parser.set_language(ts_lang)
        self.parsers[".ts"] = ts_parser
        self.parsers[".tsx"] = ts_parser

        js_lang = tree_sitter.Language(tree_sitter_javascript.language(), "javascript")
        js_parser = tree_sitter.Parser()
        js_parser.set_language(js_lang)
        self.parsers[".js"] = js_parser
        self.parsers[".jsx"] = js_parser

    def parse_file(self, filepath: Path) -> Dict:
        """
        Parses a file and returns its Code Intermediate Representation (CIR).
        """
        ext = filepath.suffix
        if ext not in self.parsers or not filepath.exists():
            return None

        content = filepath.read_bytes()
        parser = self.parsers[ext]
        tree = parser.parse(content)
        
        symbols = self._walk_ast(tree.root_node, content, ext)
        
        return {
            "file_path": str(filepath),
            "language": ext[1:],
            "symbols": [s.to_dict() for s in symbols]
        }

    def _walk_ast(self, root_node, source_bytes: bytes, ext: str) -> List[CIRSymbol]:
        """
        Stub: walk the AST and extract symbols using tree-sitter queries.
        In a full implementation, this uses specific tree-sitter S-expression queries.
        """
        symbols = []
        
        # We will stub the extraction logic to simulate CIR generation
        # Real implementation uses standard queries like: `(function_definition name: (identifier) @name)`
        
        def traverse(node):
            if ext == ".py":
                if node.type == "function_definition":
                    # very basic manual extraction for demo
                    name_node = next((n for n in node.children if n.type == "identifier"), None)
                    if name_node:
                        name = source_bytes[name_node.start_byte:name_node.end_byte].decode('utf-8')
                        body = source_bytes[node.start_byte:node.end_byte].decode('utf-8')
                        symbols.append(CIRSymbol(name, "function", node.start_point[0], node.end_point[0], body))
                elif node.type == "class_definition":
                    name_node = next((n for n in node.children if n.type == "identifier"), None)
                    if name_node:
                        name = source_bytes[name_node.start_byte:name_node.end_byte].decode('utf-8')
                        symbols.append(CIRSymbol(name, "class", node.start_point[0], node.end_point[0]))
            
            for child in node.children:
                traverse(child)
                
        traverse(root_node)
        return symbols

    def compute_cir_hash(self, cir_list: List[Dict]) -> str:
        """
        Computes a stable hash of the entire repository's CIR for staleness detection.
        """
        cir_json = json.dumps(cir_list, sort_keys=True)
        return hashlib.sha256(cir_json.encode('utf-8')).hexdigest()
