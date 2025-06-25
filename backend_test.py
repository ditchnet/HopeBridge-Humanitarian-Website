#!/usr/bin/env python3
import requests
import json
import unittest
import os
import time
from datetime import datetime

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://eefdb164-2940-437c-9296-925a57aa523c.preview.emergentagent.com"
API_BASE_URL = f"{BACKEND_URL}/api"

class TestHopeBridgeAPI(unittest.TestCase):
    """Test suite for HopeBridge API endpoints"""
    
    def setUp(self):
        """Setup for each test"""
        # Wait a moment to ensure the server is ready
        time.sleep(1)
        
        # Test data
        self.valid_donation = {
            "amount": 100.0,
            "donor_name": "John Doe",
            "donor_email": "john@example.com",
            "message": "For humanitarian aid"
        }
        
        self.valid_contact = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "message": "How can I volunteer?"
        }
    
    def test_health_endpoint(self):
        """Test the health check endpoint"""
        print("\n--- Testing Health Check Endpoint ---")
        response = requests.get(f"{API_BASE_URL}/health")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue("message" in data)
        print("✅ Health check endpoint test passed")
    
    def test_create_donation(self):
        """Test creating a donation"""
        print("\n--- Testing Create Donation Endpoint ---")
        response = requests.post(
            f"{API_BASE_URL}/donations",
            json=self.valid_donation
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["amount"], self.valid_donation["amount"])
        self.assertEqual(data["donor_name"], self.valid_donation["donor_name"])
        self.assertEqual(data["donor_email"], self.valid_donation["donor_email"])
        self.assertEqual(data["message"], self.valid_donation["message"])
        self.assertTrue("id" in data)
        self.assertTrue("created_at" in data)
        self.assertEqual(data["status"], "completed")
        print("✅ Create donation endpoint test passed")
        
        # Save donation ID for later tests
        self.donation_id = data["id"]
    
    def test_get_donations(self):
        """Test getting the list of donations"""
        print("\n--- Testing Get Donations Endpoint ---")
        response = requests.get(f"{API_BASE_URL}/donations")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text[:200]}...")  # Truncate for readability
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        
        # Check if our donation is in the list
        if len(data) > 0:
            # At least one donation should exist
            donation = data[0]  # Most recent donation
            self.assertTrue("id" in donation)
            self.assertTrue("amount" in donation)
            self.assertTrue("donor_name" in donation)
            self.assertTrue("donor_email" in donation)
            self.assertTrue("message" in donation)
            self.assertTrue("created_at" in donation)
            self.assertTrue("status" in donation)
        print("✅ Get donations endpoint test passed")
    
    def test_create_contact(self):
        """Test creating a contact message"""
        print("\n--- Testing Create Contact Endpoint ---")
        response = requests.post(
            f"{API_BASE_URL}/contacts",
            json=self.valid_contact
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["name"], self.valid_contact["name"])
        self.assertEqual(data["email"], self.valid_contact["email"])
        self.assertEqual(data["message"], self.valid_contact["message"])
        self.assertTrue("id" in data)
        self.assertTrue("created_at" in data)
        print("✅ Create contact endpoint test passed")
        
        # Save contact ID for later tests
        self.contact_id = data["id"]
    
    def test_get_contacts(self):
        """Test getting the list of contacts"""
        print("\n--- Testing Get Contacts Endpoint ---")
        response = requests.get(f"{API_BASE_URL}/contacts")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text[:200]}...")  # Truncate for readability
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        
        # Check if our contact is in the list
        if len(data) > 0:
            # At least one contact should exist
            contact = data[0]  # Most recent contact
            self.assertTrue("id" in contact)
            self.assertTrue("name" in contact)
            self.assertTrue("email" in contact)
            self.assertTrue("message" in contact)
            self.assertTrue("created_at" in contact)
        print("✅ Get contacts endpoint test passed")
    
    def test_get_stats(self):
        """Test getting statistics"""
        print("\n--- Testing Get Statistics Endpoint ---")
        response = requests.get(f"{API_BASE_URL}/stats")
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("total_donations" in data)
        self.assertTrue("total_amount" in data)
        self.assertTrue("total_contacts" in data)
        
        # Verify stats are numbers
        self.assertIsInstance(data["total_donations"], int)
        self.assertIsInstance(data["total_amount"], (int, float))
        self.assertIsInstance(data["total_contacts"], int)
        print("✅ Get statistics endpoint test passed")
    
    def test_validation_donation(self):
        """Test validation for donation endpoint"""
        print("\n--- Testing Donation Validation ---")
        
        # Test with missing required field
        invalid_donation = {
            "donor_name": "John Doe",
            "donor_email": "john@example.com",
            # Missing amount
        }
        
        response = requests.post(
            f"{API_BASE_URL}/donations",
            json=invalid_donation
        )
        print(f"Response status for invalid donation: {response.status_code}")
        self.assertNotEqual(response.status_code, 200)
        
        # Test with invalid email
        invalid_donation = {
            "amount": 100.0,
            "donor_name": "John Doe",
            "donor_email": "not-an-email",
            "message": "Test message"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/donations",
            json=invalid_donation
        )
        print(f"Response status for invalid email: {response.status_code}")
        self.assertNotEqual(response.status_code, 200)
        print("✅ Donation validation test passed")
    
    def test_validation_contact(self):
        """Test validation for contact endpoint"""
        print("\n--- Testing Contact Validation ---")
        
        # Test with missing required field
        invalid_contact = {
            "name": "Jane Smith",
            # Missing email
            "message": "Test message"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/contacts",
            json=invalid_contact
        )
        print(f"Response status for invalid contact: {response.status_code}")
        self.assertNotEqual(response.status_code, 200)
        
        # Test with invalid email
        invalid_contact = {
            "name": "Jane Smith",
            "email": "not-an-email",
            "message": "Test message"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/contacts",
            json=invalid_contact
        )
        print(f"Response status for invalid email: {response.status_code}")
        self.assertNotEqual(response.status_code, 200)
        print("✅ Contact validation test passed")

if __name__ == "__main__":
    print(f"Testing HopeBridge API at: {API_BASE_URL}")
    unittest.main(verbosity=2)