from fastapi import FastAPI, UploadFile, File, HTTPException
from typing import List
from models import Assignment, Rubric, StudentSubmission, FeedbackResponse, ReferenceMaterial
from feedback_service import FeedbackService
from rag_service import RAGService
from utils import extract_text_from_file
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Smart Feedback Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

feedback_service = FeedbackService()
rag_service = RAGService()

# In-memory storage for prototype
assignments_db = {}
rubrics_db = {}
submissions_db = {}

@app.post("/assignments/", response_model=Assignment)
async def create_assignment(assignment: Assignment):
    assignments_db[assignment.id] = assignment
    return assignment

@app.post("/rubrics/", response_model=Rubric)
async def upload_rubric(rubric: Rubric):
    rubrics_db[rubric.id] = rubric
    return rubric

@app.post("/reference-materials/{assignment_id}")
async def upload_reference(assignment_id: str, file: UploadFile = File(...)):
    if assignment_id not in assignments_db:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    content = await file.read()
    text = extract_text_from_file(content, file.filename)
    
    ref_mat = ReferenceMaterial(
        filename=file.filename,
        content_type=file.content_type,
        text_content=text
    )
    
    # Ingest into RAG
    rag_service.ingest_reference_material(ref_mat)
    
    # Link to assignment (mock)
    assignments_db[assignment_id].reference_material_ids.append(ref_mat.id)
    
    return {"message": "Reference material ingested", "id": ref_mat.id}

@app.post("/submissions/{assignment_id}", response_model=FeedbackResponse)
async def submit_and_grade(assignment_id: str, student_id: str, file: UploadFile = File(...)):
    if assignment_id not in assignments_db:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    assignment = assignments_db[assignment_id]
    if assignment.rubric_id not in rubrics_db:
         raise HTTPException(status_code=404, detail="Rubric not found")
    
    rubric = rubrics_db[assignment.rubric_id]
    
    # Process File
    content = await file.read()
    text = extract_text_from_file(content, file.filename)
    
    submission = StudentSubmission(
        assignment_id=assignment_id,
        student_id=student_id,
        filename=file.filename,
        text_content=text
    )
    
    submissions_db[submission.id] = submission
    
    # Trigger Feedback Generation
    feedback = feedback_service.generate_feedback(submission, rubric)
    
    return feedback

@app.get("/")
async def root():
    return {"message": "Smart Feedback Generator API is running"}
