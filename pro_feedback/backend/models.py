from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal
from datetime import datetime
import uuid

# --- Rubric Models ---

class RubricLevel(BaseModel):
    level_name: str  # e.g., "Excellent", "Fair"
    score: float
    description: str

class RubricCriterion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    max_points: float
    description: str
    levels: List[RubricLevel]

class Rubric(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    criteria: List[RubricCriterion]

# --- Submission & Reference Models ---

class Assignment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    rubric_id: str
    reference_material_ids: List[str] = []

class ReferenceMaterial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    content_type: str
    text_content: str # Extracted text

class StudentSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    assignment_id: str
    student_id: str
    filename: str
    text_content: str
    submission_date: datetime = Field(default_factory=datetime.now)

# --- Feedback Output Models ---

class Citation(BaseModel):
    text_snippet: str
    page_num: Optional[int] = None
    comment: Optional[str] = None

class CriterionFeedback(BaseModel):
    criterion_id: str
    name: str
    score: float
    max_points: float
    level_achieved: str
    reasoning: str
    evidence_quotes: List[str] = []

class FeedbackResponse(BaseModel):
    submission_id: str
    total_score: float
    max_score: float
    criteria_feedback: List[CriterionFeedback]
    general_summary: str
    strengths: List[str]
    weaknesses: List[str]
    improvement_plan: Optional[List[Dict[str, str]]] = None # Matches improvement prompt output
    status: Literal["draft", "approved", "published"] = "draft"
