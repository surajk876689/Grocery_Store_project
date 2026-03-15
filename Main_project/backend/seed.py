"""
Seed script: populates the database with 100 grocery items if it is empty.
Run with:  python seed.py
"""
import sys
import os

# Allow running from any directory
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models import Item

Base.metadata.create_all(bind=engine)

SEED_ITEMS = [
    # Fruits
    {"name": "Apple",           "price": 30,  "stock": 200},
    {"name": "Banana",          "price": 10,  "stock": 300},
    {"name": "Mango",           "price": 60,  "stock": 150},
    {"name": "Orange",          "price": 40,  "stock": 180},
    {"name": "Grapes",          "price": 80,  "stock": 120},
    {"name": "Watermelon",      "price": 25,  "stock": 50},
    {"name": "Papaya",          "price": 35,  "stock": 90},
    {"name": "Pineapple",       "price": 55,  "stock": 70},
    {"name": "Strawberry",      "price": 120, "stock": 60},
    {"name": "Pomegranate",     "price": 90,  "stock": 80},
    {"name": "Guava",           "price": 25,  "stock": 130},
    {"name": "Kiwi",            "price": 150, "stock": 40},
    {"name": "Lychee",          "price": 100, "stock": 55},
    {"name": "Pear",            "price": 70,  "stock": 75},
    {"name": "Plum",            "price": 85,  "stock": 65},
    # Vegetables
    {"name": "Tomato",          "price": 20,  "stock": 250},
    {"name": "Potato",          "price": 15,  "stock": 300},
    {"name": "Onion",           "price": 18,  "stock": 280},
    {"name": "Carrot",          "price": 30,  "stock": 200},
    {"name": "Spinach",         "price": 15,  "stock": 150},
    {"name": "Cauliflower",     "price": 35,  "stock": 100},
    {"name": "Broccoli",        "price": 60,  "stock": 80},
    {"name": "Capsicum",        "price": 45,  "stock": 120},
    {"name": "Cucumber",        "price": 20,  "stock": 180},
    {"name": "Eggplant",        "price": 25,  "stock": 140},
    {"name": "Peas",            "price": 40,  "stock": 160},
    {"name": "Beans",           "price": 35,  "stock": 130},
    {"name": "Cabbage",         "price": 20,  "stock": 110},
    {"name": "Bitter Gourd",    "price": 30,  "stock": 90},
    {"name": "Bottle Gourd",    "price": 22,  "stock": 95},
    {"name": "Pumpkin",         "price": 18,  "stock": 120},
    {"name": "Radish",          "price": 15,  "stock": 100},
    {"name": "Beetroot",        "price": 28,  "stock": 85},
    {"name": "Sweet Corn",      "price": 25,  "stock": 110},
    {"name": "Garlic",          "price": 50,  "stock": 200},
    {"name": "Ginger",          "price": 60,  "stock": 150},
    {"name": "Green Chilli",    "price": 20,  "stock": 180},
    {"name": "Coriander",       "price": 10,  "stock": 200},
    {"name": "Mint",            "price": 10,  "stock": 180},
    {"name": "Curry Leaves",    "price": 5,   "stock": 250},
    # Dairy
    {"name": "Milk (1L)",       "price": 55,  "stock": 200},
    {"name": "Butter (100g)",   "price": 55,  "stock": 150},
    {"name": "Paneer (200g)",   "price": 80,  "stock": 100},
    {"name": "Curd (500g)",     "price": 40,  "stock": 120},
    {"name": "Cheese (200g)",   "price": 120, "stock": 80},
    {"name": "Ghee (500ml)",    "price": 280, "stock": 60},
    {"name": "Cream (200ml)",   "price": 70,  "stock": 90},
    {"name": "Buttermilk (1L)", "price": 30,  "stock": 110},
    {"name": "Condensed Milk",  "price": 95,  "stock": 70},
    {"name": "Skimmed Milk Powder", "price": 180, "stock": 50},
    # Grains & Pulses
    {"name": "Basmati Rice (1kg)",  "price": 90,  "stock": 150},
    {"name": "Wheat Flour (1kg)",   "price": 40,  "stock": 200},
    {"name": "Toor Dal (500g)",     "price": 65,  "stock": 130},
    {"name": "Moong Dal (500g)",    "price": 70,  "stock": 120},
    {"name": "Chana Dal (500g)",    "price": 60,  "stock": 110},
    {"name": "Urad Dal (500g)",     "price": 75,  "stock": 100},
    {"name": "Rajma (500g)",        "price": 80,  "stock": 90},
    {"name": "Chickpeas (500g)",    "price": 70,  "stock": 95},
    {"name": "Oats (500g)",         "price": 110, "stock": 80},
    {"name": "Semolina (500g)",     "price": 35,  "stock": 140},
    {"name": "Poha (500g)",         "price": 30,  "stock": 130},
    {"name": "Vermicelli (200g)",   "price": 25,  "stock": 120},
    {"name": "Sago (500g)",         "price": 45,  "stock": 100},
    {"name": "Cornflour (200g)",    "price": 30,  "stock": 110},
    {"name": "Barley (500g)",       "price": 55,  "stock": 85},
    # Spices & Condiments
    {"name": "Turmeric Powder (100g)",  "price": 30,  "stock": 200},
    {"name": "Red Chilli Powder (100g)","price": 35,  "stock": 180},
    {"name": "Coriander Powder (100g)", "price": 28,  "stock": 190},
    {"name": "Cumin Seeds (100g)",      "price": 40,  "stock": 160},
    {"name": "Mustard Seeds (100g)",    "price": 25,  "stock": 170},
    {"name": "Garam Masala (50g)",      "price": 45,  "stock": 150},
    {"name": "Black Pepper (50g)",      "price": 60,  "stock": 130},
    {"name": "Cardamom (50g)",          "price": 120, "stock": 80},
    {"name": "Cloves (50g)",            "price": 90,  "stock": 90},
    {"name": "Cinnamon (50g)",          "price": 70,  "stock": 100},
    {"name": "Bay Leaves (20g)",        "price": 20,  "stock": 200},
    {"name": "Fenugreek Seeds (100g)",  "price": 30,  "stock": 150},
    {"name": "Asafoetida (10g)",        "price": 25,  "stock": 180},
    {"name": "Salt (1kg)",              "price": 20,  "stock": 300},
    {"name": "Sugar (1kg)",             "price": 45,  "stock": 250},
    # Oils & Beverages
    {"name": "Sunflower Oil (1L)",  "price": 130, "stock": 100},
    {"name": "Coconut Oil (500ml)", "price": 120, "stock": 90},
    {"name": "Mustard Oil (1L)",    "price": 140, "stock": 85},
    {"name": "Olive Oil (500ml)",   "price": 350, "stock": 50},
    {"name": "Tea Powder (250g)",   "price": 80,  "stock": 120},
    {"name": "Coffee Powder (100g)","price": 90,  "stock": 100},
    {"name": "Green Tea (25 bags)", "price": 120, "stock": 80},
    {"name": "Honey (500g)",        "price": 200, "stock": 60},
    # Snacks & Bakery
    {"name": "Bread (400g)",        "price": 40,  "stock": 100},
    {"name": "Biscuits (200g)",     "price": 30,  "stock": 150},
    {"name": "Namkeen (200g)",      "price": 35,  "stock": 130},
    {"name": "Popcorn (100g)",      "price": 25,  "stock": 120},
    {"name": "Chips (100g)",        "price": 20,  "stock": 200},
    {"name": "Noodles (70g)",       "price": 15,  "stock": 250},
    {"name": "Pasta (500g)",        "price": 60,  "stock": 90},
    {"name": "Jam (500g)",          "price": 85,  "stock": 70},
    {"name": "Peanut Butter (400g)","price": 180, "stock": 55},
    {"name": "Chocolate (50g)",     "price": 40,  "stock": 180},
]

assert len(SEED_ITEMS) == 100, f"Expected 100 seed items, got {len(SEED_ITEMS)}"


def seed():
    db = SessionLocal()
    try:
        if db.query(Item).count() > 0:
            print("Database already has items — skipping seed.")
            return
        for data in SEED_ITEMS:
            db.add(Item(**data))
        db.commit()
        print(f"Seeded {len(SEED_ITEMS)} grocery items successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
