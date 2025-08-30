from fastapi import FastAPI
from pydantic import BaseModel
from sympy import symbols, sympify, integrate, solve, latex

app = FastAPI()

class CalcIn(BaseModel):
    expr: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/calc")
def calc(inp: CalcIn):
    x = symbols('x')  # allow users to type expressions in x
    try:
        e = sympify(inp.expr)
        # A couple quick “auto” ops for demo:
        result = e
        if e.func.__name__ == 'Integral':
            result = integrate(e)
        elif e.func.__name__ == 'Eq':
            result = solve(e)
        return {
            "ok": True,
            "op": "auto",
            "input": inp.expr,
            "result": str(result),
            "latex": latex(result),
            "error": None
        }
    except Exception as exc:
        return {"ok": False, "error": str(exc)}
