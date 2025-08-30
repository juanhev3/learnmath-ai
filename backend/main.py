from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Union
import sympy as sp

app = FastAPI(title="LearnMath-AI API")

# CORS – allow your site to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later if you want
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

x, y, z = sp.symbols('x y z')

class CalcBody(BaseModel):
    expr: str
    op: Optional[str] = None   # "solve", "integrate", or auto-detect
    var: Optional[str] = None  # variable name if needed, e.g. "x"

def _parse_var(name: Optional[str]) -> sp.Symbol:
    if name:
        return sp.Symbol(name)
    return x

def compute(expr: str, op: Optional[str] = None, var: Optional[str] = None):
    expr = expr.strip()
    sym = _parse_var(var)

    try:
        # Auto-detect op if not provided
        if not op:
            if expr.lower().startswith("solve("):
                op = "solve"
            elif expr.lower().startswith("integrate("):
                op = "integrate"
            else:
                op = "eval"

        if op == "solve":
            # Accept either solve(f(x), x) string or just a polynomial “x**2-4”
            if "solve(" in expr:
                out = sp.simplify(expr)  # best-effort parse
                # If user typed solve(...), evaluate it:
                sol = sp.sympify(expr).doit()
            else:
                sol = sp.solve(sp.sympify(expr), sym)
            if isinstance(sol, list):
                result_list = [sp.simplify(s) for s in sol]
                result = ", ".join(sp.srepr(r) if isinstance(r, list) else str(r) for r in result_list)
                latex = ", ".join(sp.latex(r) for r in result_list)
            else:
                result = str(sol)
                latex = sp.latex(sol)
                result_list = [sol]

            return {
                "ok": True,
                "op": "solve",
                "input": expr,
                "result": str(result),
                "result_list": [str(s) for s in result_list],
                "latex": latex,
                "error": None,
            }

        if op == "integrate":
            # Accept integrate(sin(x), x) or raw body “sin(x)”
            if expr.lower().startswith("integrate("):
                ans = sp.sympify(expr).doit()
            else:
                ans = sp.integrate(sp.sympify(expr), sym)
            return {
                "ok": True,
                "op": "integrate",
                "input": expr,
                "result": str(ans),
                "latex": sp.latex(ans),
                "error": None,
            }

        # Default: just evaluate/simplify
        ans = sp.simplify(sp.sympify(expr))
        return {
            "ok": True,
            "op": "eval",
            "input": expr,
            "result": str(ans),
            "latex": sp.latex(ans),
            "error": None,
        }

    except Exception as e:
        return {
            "ok": False,
            "op": op or "unknown",
            "input": expr,
            "result": None,
            "latex": None,
            "error": str(e),
        }

@app.get("/healthz")
def health():
    return {"ok": True}

# ---- API: /api/calc  (supports GET and POST) ----
@app.get("/api/calc")
def calc_get(expr: str = Query(..., description="Expression"),
             op: Optional[str] = Query(None),
             var: Optional[str] = Query(None)):
    return compute(expr, op, var)

@app.post("/api/calc")
def calc_post(body: CalcBody):
    return compute(body.expr, body.op, body.var)
