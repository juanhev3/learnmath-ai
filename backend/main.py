from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Tuple

from sympy import (
    symbols, Symbol, Eq,
    sin, cos, tan, asin, acos, atan,
    exp, log, sqrt, Abs, pi, E,
    simplify, diff, integrate, solve, sympify
)
from sympy.printing.latex import latex
from sympy.core.sympify import SympifyError

app = FastAPI(title="LearnMath-AI API", version="1.1.0")

# ---------- Request / Response models ----------

class ComputeIn(BaseModel):
    # e.g. "integrate(sin(x), x)"  |  "diff(x^2, x)"  |  "solve(x**3-5, x)" | "simplify((x^2 - 1)/(x - 1))" | "eval(sin(x)+x, x=1.2)"
    expr: str

class ComputeOut(BaseModel):
    ok: bool
    op: Optional[str] = None
    input: Optional[str] = None
    result: Optional[str] = None          # joined text for lists
    result_list: Optional[List[str]] = None
    latex: Optional[str] = None           # joined LaTeX for lists
    error: Optional[str] = None

# ---------- Helpers ----------

# Allowed names for sympify to avoid unsafe evaluation
x, y, z, t = symbols("x y z t")
SAFE_LOCALS = {
    "x": x, "y": y, "z": z, "t": t,
    "sin": sin, "cos": cos, "tan": tan,
    "asin": asin, "acos": acos, "atan": atan,
    "exp": exp, "log": log, "sqrt": sqrt, "abs": Abs,
    "pi": pi, "E": E,
    "simplify": simplify, "diff": diff, "integrate": integrate, "solve": solve,
}

def split_top_level_args(s: str) -> List[str]:
    """Split by commas but ignore commas inside parentheses."""
    parts, level, cur = [], 0, []
    for ch in s:
        if ch == "(":
            level += 1
            cur.append(ch)
        elif ch == ")":
            level -= 1
            cur.append(ch)
        elif ch == "," and level == 0:
            parts.append("".join(cur).strip())
            cur = []
        else:
            cur.append(ch)
    if cur:
        parts.append("".join(cur).strip())
    return parts

def parse_call(expr: str) -> Tuple[str, List[str]]:
    """Return ('op', [arg1, arg2,...]) or ('raw', [expr]) if no call detected."""
    s = expr.strip()
    if "(" in s and s.endswith(")"):
        op = s[: s.index("(")].strip().lower()
        inside = s[s.index("(") + 1 : -1]
        return op, split_top_level_args(inside)
    return "raw", [s]

def latex_join(objs) -> str:
    """LaTeX for single or list, joined by commas."""
    try:
        if isinstance(objs, (list, tuple)):
            return ", ".join(latex(o) for o in objs)
        return latex(objs)
    except Exception:
        # fallback plain string
        if isinstance(objs, (list, tuple)):
            return ", ".join(str(o) for o in objs)
        return str(objs)

# ---------- API ----------

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/compute", response_model=ComputeOut)
def compute(payload: ComputeIn):
    s = payload.expr.strip()

    try:
        op, args = parse_call(s)

        # ----- integrate(f, x) -----
        if op == "integrate":
            if not (1 <= len(args) <= 2):
                return ComputeOut(ok=False, error="integrate expects: integrate(f, x)")
            f = sympify(args[0], locals=SAFE_LOCALS, evaluate=True)
            var = sympify(args[1], locals=SAFE_LOCALS) if len(args) == 2 else x
            res = integrate(f, var)
            return ComputeOut(
                ok=True, op="integrate", input=s,
                result=str(res), latex=latex(res)
            )

        # ----- diff(f, x) -----
        if op == "diff":
            if not (1 <= len(args) <= 2):
                return ComputeOut(ok=False, error="diff expects: diff(f, x)")
            f = sympify(args[0], locals=SAFE_LOCALS, evaluate=True)
            var = sympify(args[1], locals=SAFE_LOCALS) if len(args) == 2 else x
            res = diff(f, var)
            return ComputeOut(
                ok=True, op="diff", input=s,
                result=str(res), latex=latex(res)
            )

        # ----- simplify(expr) -----
        if op == "simplify":
            if len(args) != 1:
                return ComputeOut(ok=False, error="simplify expects: simplify(expr)")
            f = sympify(args[0], locals=SAFE_LOCALS, evaluate=True)
            res = simplify(f)
            return ComputeOut(ok=True, op="simplify", input=s, result=str(res), latex=latex(res))

        # ----- solve(g, x) — solve g=0 for x -----
        if op == "solve":
            if not (1 <= len(args) <= 2):
                return ComputeOut(ok=False, error="solve expects: solve(expr, x)")
            g = sympify(args[0], locals=SAFE_LOCALS, evaluate=True)
            var = sympify(args[1], locals=SAFE_LOCALS) if len(args) == 2 else x
            sols = solve(Eq(g, 0), var)       # a list (possibly empty)
            sols_str = [str(sv) for sv in sols]
            sols_ltx = [latex(sv) for sv in sols]
            return ComputeOut(
                ok=True, op="solve", input=s,
                result=", ".join(sols_str),
                result_list=sols_str,
                latex=", ".join(sols_ltx)
            )

        # ----- eval(expr, x=1.2, y=..) -----
        if op == "eval":
            if len(args) < 1:
                return ComputeOut(ok=False, error="eval expects: eval(expr, x=..., y=...)")
            f = sympify(args[0], locals=SAFE_LOCALS, evaluate=True)
            subs = {}
            for a in args[1:]:
                if "=" in a:
                    name, val = a.split("=", 1)
                    name = name.strip()
                    val = float(val.strip())
                    subs[Symbol(name)] = val
            res = f.subs(subs)
            # If numeric, try evalf
            try:
                res_eval = res.evalf()
            except Exception:
                res_eval = res
            return ComputeOut(ok=True, op="eval", input=s, result=str(res_eval), latex=latex(res_eval))

        # ----- raw expression: return simplified string -----
        if op == "raw":
            f = sympify(args[0], locals=SAFE_LOCALS, evaluate=True)
            return ComputeOut(ok=True, op="expr", input=s, result=str(f), latex=latex(f))

        # unknown op
        return ComputeOut(ok=False, error=f"Unknown operation '{op}'")

    except SympifyError:
        return ComputeOut(ok=False, error="Invalid expression")
    except Exception as e:
        return ComputeOut(ok=False, error=str(e))
