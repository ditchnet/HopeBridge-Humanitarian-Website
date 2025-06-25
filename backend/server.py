from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

# Initialize FastAPI app
app = FastAPI(title="HopeBridge API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.hopebridge

# Pydantic models
class DonationRequest(BaseModel):
    amount: float
    donor_name: str
    donor_email: EmailStr
    message: Optional[str] = ""

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str

class DonationResponse(BaseModel):
    id: str
    amount: float
    donor_name: str
    donor_email: str
    message: str
    created_at: datetime
    status: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    created_at: datetime

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "HopeBridge API is running"}

@app.post("/api/donations", response_model=DonationResponse)
async def create_donation(donation: DonationRequest):
    try:
        donation_doc = {
            "id": str(uuid.uuid4()),
            "amount": donation.amount,
            "donor_name": donation.donor_name,
            "donor_email": donation.donor_email,
            "message": donation.message,
            "created_at": datetime.utcnow(),
            "status": "completed"  # Mock completion since no real payment
        }
        
        await db.donations.insert_one(donation_doc)
        return DonationResponse(**donation_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating donation: {str(e)}")

@app.get("/api/donations", response_model=List[DonationResponse])
async def get_donations():
    try:
        donations = []
        async for doc in db.donations.find().sort("created_at", -1):
            donations.append(DonationResponse(**doc))
        return donations
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching donations: {str(e)}")

@app.post("/api/contacts", response_model=ContactResponse)
async def create_contact(contact: ContactRequest):
    try:
        contact_doc = {
            "id": str(uuid.uuid4()),
            "name": contact.name,
            "email": contact.email,
            "message": contact.message,
            "created_at": datetime.utcnow()
        }
        
        await db.contacts.insert_one(contact_doc)
        return ContactResponse(**contact_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating contact: {str(e)}")

@app.get("/api/contacts", response_model=List[ContactResponse])
async def get_contacts():
    try:
        contacts = []
        async for doc in db.contacts.find().sort("created_at", -1):
            contacts.append(ContactResponse(**doc))
        return contacts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contacts: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    try:
        # Get donation statistics
        total_donations = await db.donations.count_documents({})
        pipeline = [
            {"$group": {"_id": None, "total_amount": {"$sum": "$amount"}}}
        ]
        result = await db.donations.aggregate(pipeline).to_list(length=1)
        total_amount = result[0]["total_amount"] if result else 0
        
        return {
            "total_donations": total_donations,
            "total_amount": total_amount,
            "total_contacts": await db.contacts.count_documents({})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stats: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)