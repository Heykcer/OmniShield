from backend.schemas import Indicator


def risk_level(score: int) -> str:
    if score < 20:
        return "Safe"
    if score < 40:
        return "Low"
    if score < 60:
        return "Medium"
    if score < 80:
        return "High"
    return "Critical"


def aggregate_risk(indicators: list[Indicator], *, base_score: int = 0) -> tuple[int, str, str]:
    score = max(base_score, min(100, sum(item.contribution for item in indicators)))
    level = risk_level(score)
    if not indicators:
        explanation = "No configured risk indicators were triggered by this check."
    else:
        details = "; ".join(item.detail for item in indicators[:3])
        explanation = f"{level} risk based on heuristic signals: {details}."
    return score, level, explanation