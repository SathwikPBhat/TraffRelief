from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="BERT Mental Health Classifier API",
    description="Predicts emotional/mental state (depression, anxiety, suicidal, lonely, etc.) from text.",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextRequest(BaseModel):
    text: str


MODEL_DIR = "model"  # path to your model folder

print("Loading BERT model from:", MODEL_DIR)

device = 0 if torch.cuda.is_available() else -1

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

classifier = pipeline(
    "text-classification",
    model=model,
    tokenizer=tokenizer,
    return_all_scores=True,
    device=device
)

print("Model loaded successfully (using GPU)" if device == 0 else "Model loaded successfully (CPU mode)")


@app.get("/")
def root():
    return {"message": "BERT Mental Health Classifier is running!"}

@app.post("/predict")
def predict(req: TextRequest):
  
    text = req.text.strip()
    if not text:
        return {"error": "Empty text provided"}

    preds = classifier(text, truncation=True, max_length=512)[0]

    scores = {p["label"]: round(p["score"], 4) for p in preds}
    label = max(preds, key=lambda x: x["score"])["label"]

    return {"label": label, "scores": scores}
