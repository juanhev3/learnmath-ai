from fastapi import FastAPI
from pydantic import BaseModel
import sympy as sp

app = FastAPI(title="LearnMath-AI API")

class ComputeRequest(BaseModel):
    expr: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/compute")
def compute(req: ComputeRequest):
    # expose common symbols
    x, y, z, t = sp.symbols('x y z t')
    try:
        expr = sp.sympify(req.expr, convert_xor=True)
        # Try a few useful transforms
        simplified = sp.simplify(expr)
        return {
            "ok": True,
            "input": str(expr),
            "result": str(simplified),
            "latex": sp.latex(simplified)
        }
    except Exception as e:
        return {"ok": False, "error": str(e)}
