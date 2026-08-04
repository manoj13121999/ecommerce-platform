#!/usr/bin/env python3
"""Generate scripts/seed-catalog.sql with category-matched images and descriptions."""

import random
from pathlib import Path

random.seed(42)

IMG_SUFFIX = "?w=600&auto=format&fit=crop&q=80"

# Verified Unsplash photo IDs (HTTP 200) grouped by catalog theme
VERIFIED_BY_THEME = {
    "electronics": [
        "1517336714731-489689fd1ca8", "1590658268037-6bf12165a8df",
        "1608043152269-423dbba4e7e1", "1523275335684-37898b6baf30",
        "1587829741301-dc798b83add3", "1527864550417-7fd91fc51a46",
    ],
    "phones": [
        "1511707171634-5f897ff02aa9", "1601784551446-20c9e07cdbdb",
        "1511707171634-5f897ff02aa9", "1523275335684-37898b6baf30",
    ],
    "computers": [
        "1496181133206-80ce9b88a853", "1527814050087-3793815479db",
        "1527864550417-7fd91fc51a46", "1496181133206-80ce9b88a853",
    ],
    "audio": [
        "1505740420928-5e560c06d30e", "1572569511254-d8f925fe2cbb",
        "1608043152269-423dbba4e7e1", "1590658268037-6bf12165a8df",
    ],
    "cameras": [
        "1516035069371-29a1b244cc32", "1502920917128-1aa500764cbd",
        "1516035069371-29a1b244cc32", "1502920917128-1aa500764cbd",
    ],
    "smarthome": [
        "1558618666-fcd25c85cd64", "1558002038-1055907df827",
        "1558618666-fcd25c85cd64", "1523275335684-37898b6baf30",
    ],
    "wearables": [
        "1575311373937-040b8e1fd5b6", "1523275335684-37898b6baf30",
        "1575311373937-040b8e1fd5b6", "1524592094714-0f0654e20314",
    ],
    "gaming": [
        "1606144042614-b2417e99c4e3", "1606144042614-b2417e99c4e3",
        "1587829741301-dc798b83add3", "1527814050087-3793815479db",
    ],
    "fashion": [
        "1521572163474-6864f9cf17ab", "1542272604-787c3835535d",
        "1551028719-00167b16eac5", "1515372039744-b8f02a3ae446",
    ],
    "kids": [
        "1521572163474-6864f9cf17ab", "1553062407-98eeb64c6a62",
        "1545249390-6bdfa286032f", "1521572163474-6864f9cf17ab",
    ],
    "footwear": [
        "1542291026-7eec264c27ff", "1549298916-b41d501d3772",
        "1542291026-7eec264c27ff", "1549298916-b41d501d3772",
    ],
    "bags": [
        "1553062407-98eeb64c6a62", "1548036328-c9fa89d128fa",
        "1553062407-98eeb64c6a62", "1548036328-c9fa89d128fa",
    ],
    "watches": [
        "1524592094714-0f0654e20314", "1523275335684-37898b6baf30",
        "1524592094714-0f0654e20314", "1575311373937-040b8e1fd5b6",
    ],
    "jewellery": [
        "1515562141207-7a88fb7ce338", "1535632066927-ab7c9ab60908",
        "1515562141207-7a88fb7ce338", "1535632066927-ab7c9ab60908",
    ],
    "eyewear": [
        "1549298916-b41d501d3772", "1517336714731-489689fd1ca8",
        "1549298916-b41d501d3772", "1517336714731-489689fd1ca8",
    ],
    "beauty": [
        "1556228720-195a672e8a03", "1512496015851-a90fb38ba796",
        "1556228720-195a672e8a03", "1512496015851-a90fb38ba796",
    ],
    "makeup": [
        "1512496015851-a90fb38ba796", "1556228720-195a672e8a03",
        "1512496015851-a90fb38ba796", "1556228720-195a672e8a03",
    ],
    "fragrance": [
        "1541643600914-78b084683601", "1592945403244-b3fbafd7f539",
        "1541643600914-78b084683601", "1592945403244-b3fbafd7f539",
    ],
    "home": [
        "1586023492125-27b2c045efd7", "1631049307264-da0ec9d70304",
        "1586023492125-27b2c045efd7", "1631049307264-da0ec9d70304",
    ],
    "furniture": [
        "1586023492125-27b2c045efd7", "1631049307264-da0ec9d70304",
        "1586023492125-27b2c045efd7", "1532372320572-cda25653a26d",
    ],
    "kitchen": [
        "1556911220-e15b29be8c8f", "1578662996442-48f60103fc96",
        "1556911220-e15b29be8c8f", "1578662996442-48f60103fc96",
    ],
    "decor": [
        "1586023492125-27b2c045efd7", "1416879595882-3373a0480b5b",
        "1586023492125-27b2c045efd7", "1416879595882-3373a0480b5b",
    ],
    "bedding": [
        "1631049307264-da0ec9d70304", "1631049307264-da0ec9d70304",
        "1586023492125-27b2c045efd7", "1631049307264-da0ec9d70304",
    ],
    "lighting": [
        "1558618666-fcd25c85cd64", "1586023492125-27b2c045efd7",
        "1558618666-fcd25c85cd64", "1586023492125-27b2c045efd7",
    ],
    "storage": [
        "1586023492125-27b2c045efd7", "1586023492125-27b2c045efd7",
        "1631049307264-da0ec9d70304", "1586023492125-27b2c045efd7",
    ],
    "garden": [
        "1416879595882-3373a0480b5b", "1586023492125-27b2c045efd7",
        "1416879595882-3373a0480b5b", "1586023492125-27b2c045efd7",
    ],
    "sports": [
        "1517836357463-d25dfeac3438", "1602143407151-7111542de6e8",
        "1517836357463-d25dfeac3438", "1571019614242-c5c5dee9f50b",
    ],
    "cricket": [
        "1517836357463-d25dfeac3438", "1517836357463-d25dfeac3438",
        "1602143407151-7111542de6e8", "1517836357463-d25dfeac3438",
    ],
    "football": [
        "1431324155629-1a6deb1dec8d", "1542291026-7eec264c27ff",
        "1431324155629-1a6deb1dec8d", "1542291026-7eec264c27ff",
    ],
    "cycling": [
        "1558618666-fcd25c85cd64", "1492144534655-ae79c964c9d7",
        "1558618666-fcd25c85cd64", "1492144534655-ae79c964c9d7",
    ],
    "camping": [
        "1517836357463-d25dfeac3438", "1553062407-98eeb64c6a62",
        "1517836357463-d25dfeac3438", "1553062407-98eeb64c6a62",
    ],
    "books": [
        "1544947950-fa07a98d237f", "1512820790803-83ca734da794",
        "1544947950-fa07a98d237f", "1512820790803-83ca734da794",
    ],
    "stationery": [
        "1583485088034-697b5bc54ccd", "1544947950-fa07a98d237f",
        "1583485088034-697b5bc54ccd", "1544947950-fa07a98d237f",
    ],
    "toys": [
        "1545249390-6bdfa286032f", "1545249390-6bdfa286032f",
        "1581833971358-2c8b550f87b3", "1545249390-6bdfa286032f",
    ],
    "baby": [
        "1545249390-6bdfa286032f", "1545249390-6bdfa286032f",
        "1556228720-195a672e8a03", "1545249390-6bdfa286032f",
    ],
    "boardgames": [
        "1606144042614-b2417e99c4e3", "1544947950-fa07a98d237f",
        "1606144042614-b2417e99c4e3", "1544947950-fa07a98d237f",
    ],
    "edutoys": [
        "1581833971358-2c8b550f87b3", "1545249390-6bdfa286032f",
        "1581833971358-2c8b550f87b3", "1545249390-6bdfa286032f",
    ],
    "automotive": [
        "1492144534655-ae79c964c9d7", "1492144534655-ae79c964c9d7",
        "1492144534655-ae79c964c9d7", "1492144534655-ae79c964c9d7",
    ],
    "bike": [
        "1492144534655-ae79c964c9d7", "1558618666-fcd25c85cd64",
        "1492144534655-ae79c964c9d7", "1558618666-fcd25c85cd64",
    ],
    "grocery": [
        "1542838132-92c53300491e", "1542838132-92c53300491e",
        "1549007994-cb92caebd54b", "1542838132-92c53300491e",
    ],
    "snacks": [
        "1542838132-92c53300491e", "1549007994-cb92caebd54b",
        "1542838132-92c53300491e", "1549007994-cb92caebd54b",
    ],
    "health": [
        "1584308666744-24d5c474f2ae", "1571019614242-c5c5dee9f50b",
        "1584308666744-24d5c474f2ae", "1571019614242-c5c5dee9f50b",
    ],
    "pets": [
        "1601758228041-f3b2795255f1", "1587300003388-59208cc962cb",
        "1514888286974-6c03e2ca1dba", "1545249390-6bdfa286032f",
        "1450778869180-41d0601e046e",
    ],
    "tools": [
        "1581094794329-c8112a89af12", "1581094794329-c8112a89af12",
        "1581094794329-c8112a89af12", "1581094794329-c8112a89af12",
    ],
    "default": ["1560472354-b33ff0c44a43"],
}


def theme_image(theme: str, index: int) -> str:
    pool = VERIFIED_BY_THEME.get(theme, VERIFIED_BY_THEME["default"])
    photo_id = pool[index % len(pool)]
    return f"https://images.unsplash.com/photo-{photo_id}{IMG_SUFFIX}"

PREFIXES = [
    "Essential", "Classic", "Premium", "Urban", "Comfort", "Daily", "Active",
    "Modern", "Pure", "Royal", "Eco", "Bold", "Fresh", "Studio", "Elite",
]

CATEGORIES = [
    (1, "Electronics", "electronics", "Phones, laptops, audio, and smart gadgets"),
    (2, "Mobile Phones", "mobile-phones", "Smartphones and feature phones"),
    (3, "Laptops & Computers", "laptops-computers", "Notebooks, desktops, and accessories"),
    (4, "Audio & Headphones", "audio-headphones", "Earbuds, headphones, and speakers"),
    (5, "Cameras & Photography", "cameras-photography", "DSLR, mirrorless, lenses, and tripods"),
    (6, "Smart Home", "smart-home", "Connected devices for modern homes"),
    (7, "Wearables", "wearables", "Smartwatches and fitness bands"),
    (8, "Gaming", "gaming", "Consoles, games, and gaming gear"),
    (9, "Fashion", "fashion", "Clothing and style essentials"),
    (10, "Men's Clothing", "men-s-clothing", "Shirts, jeans, jackets, and more"),
    (11, "Women's Clothing", "women-s-clothing", "Dresses, tops, ethnic, and western wear"),
    (12, "Kids' Fashion", "kids-fashion", "Clothing and footwear for children"),
    (13, "Footwear", "footwear", "Sneakers, sandals, and formal shoes"),
    (14, "Bags & Luggage", "bags-luggage", "Backpacks, handbags, and travel bags"),
    (15, "Watches", "watches", "Analog, digital, and luxury watches"),
    (16, "Jewellery", "jewellery", "Gold, silver, and fashion jewellery"),
    (17, "Eyewear", "eyewear", "Sunglasses and prescription frames"),
    (18, "Beauty & Personal Care", "beauty-personal-care", "Skincare, haircare, and grooming"),
    (19, "Makeup", "makeup", "Cosmetics and beauty tools"),
    (20, "Fragrances", "fragrances", "Perfumes and body mists"),
    (21, "Home & Living", "home-living", "Furniture, decor, and essentials"),
    (22, "Furniture", "furniture", "Sofas, beds, tables, and chairs"),
    (23, "Kitchen & Dining", "kitchen-dining", "Cookware, utensils, and appliances"),
    (24, "Home Decor", "home-decor", "Wall art, vases, and decorative items"),
    (25, "Bedding & Bath", "bedding-bath", "Sheets, towels, and mattresses"),
    (26, "Lighting", "lighting", "Lamps, bulbs, and fixtures"),
    (27, "Storage & Organization", "storage-organization", "Organizers, racks, and boxes"),
    (28, "Garden & Outdoor", "garden-outdoor", "Plants, pots, and outdoor furniture"),
    (29, "Sports & Fitness", "sports-fitness", "Gear for active lifestyles"),
    (30, "Exercise & Fitness", "exercise-fitness", "Gym equipment and yoga essentials"),
    (31, "Cricket", "cricket", "Bats, balls, pads, and kits"),
    (32, "Football", "football", "Boots, balls, and jerseys"),
    (33, "Cycling", "cycling", "Bikes, helmets, and accessories"),
    (34, "Camping & Hiking", "camping-hiking", "Tents, backpacks, and outdoor tools"),
    (35, "Books & Stationery", "books-stationery", "Books, notebooks, and office supplies"),
    (36, "Fiction Books", "fiction-books", "Novels and literary fiction"),
    (37, "Non-Fiction Books", "non-fiction-books", "Biographies, business, and self-help"),
    (38, "Office Supplies", "office-supplies", "Pens, files, and desk accessories"),
    (39, "Toys & Baby", "toys-baby", "Toys, games, and baby care"),
    (40, "Baby Care", "baby-care", "Diapers, feeders, and nursery items"),
    (41, "Board Games", "board-games", "Family and strategy games"),
    (42, "Educational Toys", "educational-toys", "STEM and learning toys"),
    (43, "Automotive", "automotive", "Car and bike accessories"),
    (44, "Car Accessories", "car-accessories", "Seat covers, chargers, and holders"),
    (45, "Bike Accessories", "bike-accessories", "Helmets, locks, and riding gear"),
    (46, "Groceries & Gourmet", "groceries-gourmet", "Food, snacks, and beverages"),
    (47, "Snacks & Beverages", "snacks-beverages", "Chips, cookies, tea, and coffee"),
    (48, "Health & Wellness", "health-wellness", "Supplements and medical essentials"),
    (49, "Pet Supplies", "pet-supplies", "Food, toys, and grooming for pets"),
    (50, "Industrial & Tools", "industrial-tools", "Power tools and hardware"),
]

# theme -> product types with matched images and realistic copy
THEME_TYPES = {
    "electronics": [
        ("Wireless Earbuds", (999, 8999),
         "In-ear buds with balanced sound and a compact charging case.",
         "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600"),
        ("Bluetooth Speaker", (1499, 12999),
         "Portable speaker with deep bass and 12-hour battery life.",
         "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"),
        ("USB-C Hub", (799, 4999),
         "Multi-port hub for laptops with HDMI and fast data transfer.",
         "https://images.unsplash.com/photo-1625729148770-aaacea170bd4?w=600"),
        ("Power Bank", (599, 3999),
         "Slim 10000mAh power bank with dual USB output.",
         "https://images.unsplash.com/photo-1609091839311-9f105136d7d2?w=600"),
        ("Smart Watch", (2999, 24999),
         "Track steps, heart rate, and notifications from your wrist.",
         "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),
        ("Mechanical Keyboard", (2499, 14999),
         "Tactile keys with RGB backlight for work and gaming.",
         "https://images.unsplash.com/photo-1511464785779-3b9a88e0b171?w=600"),
    ],
    "phones": [
        ("Android Smartphone", (8999, 64999),
         "Bright AMOLED display, fast processor, and all-day battery.",
         "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"),
        ("Phone Case", (199, 1499),
         "Shock-absorbing case with raised edges for screen protection.",
         "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"),
        ("Screen Protector", (99, 699),
         "Tempered glass with oleophobic coating and easy install kit.",
         "https://images.unsplash.com/photo-1585060544812-6b45742d7623?w=600"),
        ("Fast Charger", (499, 2499),
         "18W USB-C charger compatible with most modern phones.",
         "https://images.unsplash.com/photo-1591290619762-d2d4a2d3a0a0?w=600"),
    ],
    "computers": [
        ("Ultrabook Laptop", (34999, 129999),
         "Lightweight laptop with SSD storage and full-day productivity.",
         "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"),
        ("Wireless Mouse", (399, 2999),
         "Ergonomic mouse with silent clicks and long battery life.",
         "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600"),
        ("Laptop Stand", (699, 3999),
         "Aluminium stand improves posture and airflow under your laptop.",
         "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600"),
        ("External SSD 1TB", (4999, 14999),
         "Pocket-sized drive for backups, photos, and video projects.",
         "https://images.unsplash.com/photo-1531492746076-161aaae7d792?w=600"),
    ],
    "audio": [
        ("Over-Ear Headphones", (1999, 18999),
         "Soft ear cushions with noise isolation for music and calls.",
         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"),
        ("True Wireless Earbuds", (999, 7999),
         "Secure fit with touch controls and clear microphone pickup.",
         "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600"),
        ("Bookshelf Speaker", (3499, 24999),
         "Room-filling sound for living rooms and home offices.",
         "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"),
    ],
    "cameras": [
        ("Mirrorless Camera", (29999, 149999),
         "Interchangeable lens camera for photos and 4K video.",
         "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"),
        ("Camera Tripod", (999, 8999),
         "Stable aluminium tripod with quick-release plate.",
         "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"),
        ("Prime Lens 50mm", (7999, 49999),
         "Sharp portrait lens with beautiful background blur.",
         "https://images.unsplash.com/photo-1606983340126-99ab4fe28264?w=600"),
    ],
    "smarthome": [
        ("Smart Bulb", (399, 1999),
         "App-controlled LED bulb with warm and cool white tones.",
         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"),
        ("Wi-Fi Plug", (499, 2499),
         "Schedule appliances and monitor energy from your phone.",
         "https://images.unsplash.com/photo-1558002038-1055907df827?w=600"),
        ("Video Doorbell", (2999, 12999),
         "See visitors at your door with motion alerts and night vision.",
         "https://images.unsplash.com/photo-1558008901-1ef214423565?w=600"),
    ],
    "wearables": [
        ("Fitness Band", (999, 4999),
         "Track steps, sleep, and workouts with a lightweight strap.",
         "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600"),
        ("Smartwatch", (3999, 29999),
         "Notifications, GPS, and health metrics in a sleek design.",
         "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),
    ],
    "gaming": [
        ("Gaming Headset", (1499, 9999),
         "Surround sound and noise-cancelling mic for long sessions.",
         "https://images.unsplash.com/photo-1599669454699-2483098677a1?w=600"),
        ("RGB Gaming Mouse", (699, 5999),
         "High DPI sensor with programmable buttons and RGB zones.",
         "https://images.unsplash.com/photo-1615663245857-ac411f9f6226?w=600"),
        ("Controller", (1999, 6999),
         "Wireless controller with responsive triggers and textured grip.",
         "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600"),
    ],
    "fashion": [
        ("Cotton T-Shirt", (399, 1999),
         "Breathable everyday tee with a relaxed, modern fit.",
         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"),
        ("Slim Fit Jeans", (999, 3999),
         "Stretch denim with classic five-pocket styling.",
         "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"),
        ("Leather Jacket", (3999, 18999),
         "Genuine leather jacket with quilted lining for cooler days.",
         "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"),
        ("Summer Dress", (799, 4999),
         "Lightweight dress with a flattering A-line silhouette.",
         "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600"),
    ],
    "kids": [
        ("Kids Hoodie", (499, 2499),
         "Soft fleece hoodie with durable stitching for active kids.",
         "https://images.unsplash.com/photo-1519238263530-99bdd884e0f7?w=600"),
        ("School Backpack", (699, 2999),
         "Padded straps and multiple compartments for books and lunch.",
         "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"),
    ],
    "footwear": [
        ("Running Sneakers", (1499, 8999),
         "Cushioned sole and breathable mesh upper for daily runs.",
         "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"),
        ("Leather Loafers", (1999, 9999),
         "Classic slip-on loafers for office and casual occasions.",
         "https://images.unsplash.com/photo-1533867617858-7a97e83dd1a9?w=600"),
        ("Sandals", (399, 2499),
         "Comfort footbed with adjustable straps for warm weather.",
         "https://images.unsplash.com/photo-1603487742131-416a7f3e3c51?w=600"),
    ],
    "bags": [
        ("Travel Backpack", (999, 5999),
         "Water-resistant backpack with laptop sleeve and luggage pass-through.",
         "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"),
        ("Crossbody Bag", (799, 4999),
         "Compact bag with adjustable strap and secure zip pockets.",
         "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"),
        ("Hard Shell Suitcase", (2999, 14999),
         "360° spinner wheels and TSA-friendly combination lock.",
         "https://images.unsplash.com/photo-1565026055877-a86954716816?w=600"),
    ],
    "watches": [
        ("Analog Watch", (999, 9999),
         "Stainless steel case with scratch-resistant mineral glass.",
         "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"),
        ("Chronograph Watch", (2499, 24999),
         "Bold dial with stopwatch function and luminous hands.",
         "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"),
    ],
    "jewellery": [
        ("Silver Pendant", (499, 4999),
         "Minimal pendant necklace on a hypoallergenic chain.",
         "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"),
        ("Gold-Plated Earrings", (699, 6999),
         "Lightweight hoops finished for everyday wear.",
         "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"),
    ],
    "eyewear": [
        ("Polarized Sunglasses", (499, 4999),
         "UV400 lenses reduce glare for driving and outdoor use.",
         "https://images.unsplash.com/photo-1572635196233-1594d4752b45?w=600"),
        ("Blue Light Glasses", (399, 2499),
         "Lightweight frames for screen time and reduced eye strain.",
         "https://images.unsplash.com/photo-1574258495973-f010dfbb5311?w=600"),
    ],
    "beauty": [
        ("Face Moisturizer", (299, 2499),
         "Lightweight daily moisturizer for soft, hydrated skin.",
         "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"),
        ("Shampoo & Conditioner Set", (349, 1999),
         "Sulfate-free duo for smooth, manageable hair.",
         "https://images.unsplash.com/photo-1527798200023-adbf0721a4d6?w=600"),
        ("Beard Trimmer", (799, 3999),
         "Adjustable length settings with self-sharpening blades.",
         "https://images.unsplash.com/photo-1621607508249-5f8b8e3a7a1b?w=600"),
    ],
    "makeup": [
        ("Matte Lipstick", (199, 1499),
         "Long-wear lipstick with rich pigment and comfortable finish.",
         "https://images.unsplash.com/photo-1586495777744-4413d210d7b8?w=600"),
        ("Makeup Brush Set", (499, 2999),
         "Soft synthetic bristles for blending foundation and eyeshadow.",
         "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600"),
    ],
    "fragrance": [
        ("Eau de Parfum", (699, 6999),
         "Balanced scent with citrus top notes and warm base.",
         "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"),
        ("Body Mist", (199, 999),
         "Fresh everyday fragrance in a travel-friendly spray.",
         "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600"),
    ],
    "home": [
        ("Table Lamp", (499, 4999),
         "Warm ambient light for bedside tables and reading nooks.",
         "https://images.unsplash.com/photo-1507473885765-e6ed923f425e?w=600"),
        ("Throw Pillow", (299, 1999),
         "Soft cover with plush insert for sofas and beds.",
         "https://images.unsplash.com/photo-1584100936595-c0654b55a2b2?w=600"),
        ("Scented Candle", (249, 1499),
         "Clean-burning soy candle with 40+ hour burn time.",
         "https://images.unsplash.com/photo-1602600310017-254a9148244f?w=600"),
    ],
    "furniture": [
        ("Office Chair", (3999, 24999),
         "Adjustable lumbar support and breathable mesh back.",
         "https://images.unsplash.com/photo-1580480051063-87a3a8a4a6f5?w=600"),
        ("Coffee Table", (2999, 14999),
         "Solid wood top with storage shelf underneath.",
         "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600"),
    ],
    "kitchen": [
        ("Non-Stick Pan Set", (999, 6999),
         "Three-piece set with even heat distribution and easy cleanup.",
         "https://images.unsplash.com/photo-1556909114-f6e7ad7d4046?w=600"),
        ("Ceramic Dinner Set", (799, 4999),
         "Service for four with chip-resistant glaze.",
         "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600"),
        ("Electric Kettle", (699, 3999),
         "Boils water quickly with auto shut-off safety.",
         "https://images.unsplash.com/photo-1563566220-4a8a2996b9c0?w=600"),
    ],
    "decor": [
        ("Wall Art Print", (399, 2999),
         "Framed print to add colour and personality to any room.",
         "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600"),
        ("Indoor Plant Pot", (199, 1499),
         "Minimal ceramic pot with drainage tray included.",
         "https://images.unsplash.com/photo-1485955900006-10f4d324d421?w=600"),
    ],
    "bedding": [
        ("Cotton Bed Sheet Set", (699, 3999),
         "Breathable 300-thread-count sheets for all-season comfort.",
         "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600"),
        ("Bath Towel Set", (499, 2999),
         "Absorbent towels with quick-dry loops for bathrooms.",
         "https://images.unsplash.com/photo-1616627548426-5fb9c4d4c8b1?w=600"),
    ],
    "lighting": [
        ("LED Floor Lamp", (999, 6999),
         "Adjustable brightness for living rooms and home offices.",
         "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"),
        ("String Lights", (199, 999),
         "Warm fairy lights for balconies, bedrooms, and parties.",
         "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"),
    ],
    "storage": [
        ("Storage Basket Set", (299, 1999),
         "Woven baskets for closets, shelves, and toy organization.",
         "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"),
        ("Shoe Rack", (499, 2999),
         "Tiered rack keeps entryways tidy and shoes accessible.",
         "https://images.unsplash.com/photo-1503602642458-2320274450d6?w=600"),
    ],
    "garden": [
        ("Garden Tool Set", (499, 2999),
         "Essential trowel, pruner, and gloves for home gardening.",
         "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"),
        ("Outdoor Chair", (999, 6999),
         "Weather-resistant chair for patios and balconies.",
         "https://images.unsplash.com/photo-1506439773649-3e9eb685ec15?w=600"),
    ],
    "sports": [
        ("Yoga Mat", (399, 2499),
         "Non-slip surface with cushioning for floor workouts.",
         "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b44?w=600"),
        ("Adjustable Dumbbells", (1499, 9999),
         "Quick weight changes for strength training at home.",
         "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600"),
        ("Sports Water Bottle", (199, 999),
         "BPA-free bottle with leak-proof lid for gym and travel.",
         "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"),
    ],
    "cricket": [
        ("Cricket Bat", (999, 8999),
         "Kashmir willow bat with comfortable short handle grip.",
         "https://images.unsplash.com/photo-1531418845077-37066de42566?w=600"),
        ("Cricket Ball Pack", (199, 999),
         "Durable seam ball suitable for practice sessions.",
         "https://images.unsplash.com/photo-1593341646782-01d164c11e03?w=600"),
    ],
    "football": [
        ("Football Boots", (1499, 9999),
         "Studded outsole for grip on turf and grass pitches.",
         "https://images.unsplash.com/photo-1511886929833-364d11897145?w=600"),
        ("Match Football", (399, 2499),
         "FIFA-quality ball with consistent flight and touch.",
         "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600"),
    ],
    "cycling": [
        ("Cycling Helmet", (999, 5999),
         "Ventilated helmet with adjustable fit dial system.",
         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"),
        ("Bike Light Set", (399, 1999),
         "Front and rear LED lights for safer night rides.",
         "https://images.unsplash.com/photo-1485965120188-1266103779e8?w=600"),
    ],
    "camping": [
        ("Camping Tent", (1999, 14999),
         "Two-person tent with waterproof flysheet and easy setup.",
         "https://images.unsplash.com/photo-1478131143081-80f7f84b84e7?w=600"),
        ("Hiking Backpack 40L", (1499, 9999),
         "Supportive straps and rain cover for weekend treks.",
         "https://images.unsplash.com/photo-1478131143081-80f7f84b84e7?w=600"),
    ],
    "books": [
        ("Bestseller Novel", (199, 899),
         "Paperback fiction pick for relaxed weekend reading.",
         "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600"),
        ("Business Book", (299, 1299),
         "Practical insights on leadership, habits, and growth.",
         "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600"),
    ],
    "stationery": [
        ("Notebook Pack", (99, 499),
         "Ruled pages with sturdy covers for notes and journaling.",
         "https://images.unsplash.com/photo-1455390582260-704604f63897?w=600"),
        ("Gel Pen Set", (99, 599),
         "Smooth-writing pens in assorted colours for office use.",
         "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600"),
    ],
    "toys": [
        ("Building Blocks Set", (399, 2999),
         "Colourful blocks that encourage creativity and motor skills.",
         "https://images.unsplash.com/photo-1587658112046-1c2283076623?w=600"),
        ("Plush Toy", (199, 1499),
         "Soft stuffed toy safe for toddlers and young children.",
         "https://images.unsplash.com/photo-1551969014-7e2b4d8a6ffb?w=600"),
    ],
    "baby": [
        ("Baby Feeding Bottle", (199, 999),
         "BPA-free bottle with anti-colic vent and easy grip.",
         "https://images.unsplash.com/photo-1515488042361-ee00e675e1be?w=600"),
        ("Organic Diapers Pack", (499, 1999),
         "Soft, absorbent diapers for sensitive baby skin.",
         "https://images.unsplash.com/photo-1515488042361-ee00e675e1be?w=600"),
    ],
    "boardgames": [
        ("Strategy Board Game", (499, 3999),
         "Family-friendly game night pick for 2–6 players.",
         "https://images.unsplash.com/photo-1611191670208-0946088753ff?w=600"),
        ("Card Game Pack", (199, 999),
         "Compact card game for travel and quick sessions.",
         "https://images.unsplash.com/photo-1611191670208-0946088753ff?w=600"),
    ],
    "edutoys": [
        ("STEM Robotics Kit", (999, 6999),
         "Build-and-code kit that introduces kids to basic robotics.",
         "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600"),
        ("Learning Puzzle", (199, 1499),
         "Age-appropriate puzzle for problem solving and focus.",
         "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600"),
    ],
    "automotive": [
        ("Car Phone Mount", (199, 1499),
         "Vent or dashboard mount with one-hand phone release.",
         "https://images.unsplash.com/photo-1449965404609-a9767084a0a0?w=600"),
        ("Car Vacuum Cleaner", (999, 4999),
         "Compact 12V vacuum for seats, mats, and tight corners.",
         "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600"),
    ],
    "bike": [
        ("Bike U-Lock", (699, 3999),
         "Hardened steel lock resists cutting and prying.",
         "https://images.unsplash.com/photo-1485965120188-1266103779e8?w=600"),
        ("Cycling Gloves", (299, 1999),
         "Padded palms improve grip and reduce road vibration.",
         "https://images.unsplash.com/photo-1485965120188-1266103779e8?w=600"),
    ],
    "grocery": [
        ("Arabica Coffee Beans", (299, 1499),
         "Medium roast whole beans with chocolate and nut notes.",
         "https://images.unsplash.com/photo-1559056199-641a0ac8b55c?w=600"),
        ("Green Tea Box", (149, 799),
         "100 tea bags with a light, refreshing flavour.",
         "https://images.unsplash.com/photo-156489036947-001f64a374be?w=600"),
        ("Extra Virgin Olive Oil", (399, 1999),
         "Cold-pressed oil ideal for salads and everyday cooking.",
         "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600"),
    ],
    "snacks": [
        ("Mixed Nuts Jar", (199, 999),
         "Lightly salted blend of almonds, cashews, and walnuts.",
         "https://images.unsplash.com/photo-1599599810692-68a2c86f6f86?w=600"),
        ("Dark Chocolate Bar", (99, 499),
         "70% cocoa bar with a smooth, rich finish.",
         "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600"),
    ],
    "health": [
        ("Vitamin C Tablets", (199, 999),
         "Daily immune support in easy-to-swallow tablets.",
         "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"),
        ("Digital Thermometer", (199, 899),
         "Fast-reading thermometer with fever alert indicator.",
         "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"),
        ("Yoga Resistance Bands", (299, 1499),
         "Set of five bands for stretching and physiotherapy.",
         "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600"),
    ],
    "pets": [
        ("Pet Grooming Brush", (199, 899),
         "Soft bristles remove loose fur and keep coats shiny.",
         ""),
        ("Dry Dog Food 3kg", (499, 2499),
         "Balanced nutrition with real chicken as the first ingredient.",
         ""),
        ("Cat Teaser Toy", (99, 499),
         "Feather wand toy for active play and bonding.",
         ""),
        ("Pet Bed", (699, 3999),
         "Plush bed with washable cover for cats and small dogs.",
         ""),
        ("Pet Shampoo", (149, 699),
         "Gentle formula suitable for sensitive skin and coats.",
         ""),
    ],
    "tools": [
        ("Cordless Drill", (2499, 12999),
         "Variable speed drill with lithium battery and charger.",
         "https://images.unsplash.com/photo-1504148455328-c376922d50ac?w=600"),
        ("Hammer Tool Set", (499, 2999),
         "Essential hammer, screwdrivers, and measuring tape kit.",
         "https://images.unsplash.com/photo-1504148455328-c376922d50ac?w=600"),
        ("Safety Work Gloves", (99, 599),
         "Cut-resistant gloves for DIY and workshop tasks.",
         "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600"),
    ],
}

CATEGORY_THEME = {
    1: "electronics", 2: "phones", 3: "computers", 4: "audio", 5: "cameras",
    6: "smarthome", 7: "wearables", 8: "gaming", 9: "fashion", 10: "fashion",
    11: "fashion", 12: "kids", 13: "footwear", 14: "bags", 15: "watches",
    16: "jewellery", 17: "eyewear", 18: "beauty", 19: "makeup", 20: "fragrance",
    21: "home", 22: "furniture", 23: "kitchen", 24: "decor", 25: "bedding",
    26: "lighting", 27: "storage", 28: "garden", 29: "sports", 30: "sports",
    31: "cricket", 32: "football", 33: "cycling", 34: "camping", 35: "books",
    36: "books", 37: "books", 38: "stationery", 39: "toys", 40: "baby",
    41: "boardgames", 42: "edutoys", 43: "automotive", 44: "automotive",
    45: "bike", 46: "grocery", 47: "snacks", 48: "health", 49: "pets", 50: "tools",
}


def slugify(text: str) -> str:
    return text.lower().replace("&", "and").replace("'", "").replace(" ", "-")


def sql_str(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def main() -> None:
    lines = [
        "-- Seed catalog data for local/dev. NOT Flyway. Run: ./scripts/seed-catalog.sh",
        "-- Regenerate: python3 scripts/generate-catalog-seed.py > scripts/seed-catalog.sql",
        "-- 50 categories, 5000 products",
        "",
        "DELETE FROM products;",
        "DELETE FROM categories;",
        "",
    ]

    for cat_id, name, slug, desc in CATEGORIES:
        lines.append(
            f"INSERT INTO categories (id, name, slug, description) VALUES "
            f"({cat_id}, {sql_str(name)}, {sql_str(slug)}, {sql_str(desc)});"
        )

    lines.append("")

    product_id = 1
    for cat_id, name, slug, _desc in CATEGORIES:
        theme = CATEGORY_THEME[cat_id]
        types = THEME_TYPES[theme]
        for i in range(100):
            type_label, (price_min, price_max), description, _image = types[i % len(types)]
            prefix = PREFIXES[(product_id + i) % len(PREFIXES)]
            product_name = f"{prefix} {type_label}"
            product_slug = f"{slugify(product_name)}-{product_id}"
            price = round(random.uniform(price_min, price_max), 2)
            stock = random.randint(15, 250)
            image = theme_image(theme, i)
            lines.append(
                "INSERT INTO products (id, category_id, name, slug, description, price, stock, image_url, active) VALUES "
                f"({product_id}, {cat_id}, {sql_str(product_name)}, {sql_str(product_slug)}, "
                f"{sql_str(description)}, {price:.2f}, {stock}, {sql_str(image)}, TRUE);"
            )
            product_id += 1

    output = "\n".join(lines) + "\n"
    target = Path(__file__).resolve().parent / "seed-catalog.sql"
    target.write_text(output, encoding="utf-8")
    print(f"Wrote {product_id - 1} products to {target}")


if __name__ == "__main__":
    main()
