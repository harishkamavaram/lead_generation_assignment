import random
import uuid
import json

names = ["Alice Smith","Bob Johnson","Charlie Lee","Diana Patel","Ethan Brown",
         "Fiona Davis","George Wilson","Hannah Clark","Ian Lewis","Julia Walker"]
titles = ["Python Developer","Frontend Developer","Backend Developer",
          "Full Stack Developer","Data Scientist","Machine Learning Engineer",
          "DevOps Engineer","UI/UX Designer"]
locations = ["Bangalore, India","Mumbai, India","Hyderabad, India","Delhi, India",
             "Pune, India","Chennai, India","Kolkata, India","Gurgaon, India"]
skills_pool = ["Python","Django","FastAPI","React","NodeJS","AWS","Docker",
               "Kubernetes","SQL","MongoDB","TypeScript","JavaScript"]
companies = ["Google","Microsoft","Apple","Amazon","Facebook","Twitter",
        "Instagram","LinkedIn","GitHub","IBM","Tesla","SpaceX","Meta","Netflix"]
        
data = []

for _ in range(50):  # generate 50 entries
    person = {
        "id": str(uuid.uuid4()),
        "name": random.choice(names) + " " + random.choice(["","Jr.","Sr."]),
        "title": random.choice(titles),
        "location": random.choice(locations),
        "company": random.choice(companies),
        "skills": random.sample(skills_pool, k=random.randint(2,5)),
        "profile_url": "https://github.com/" + str(uuid.uuid4())[:8],
        "resume_url": "https://example.com/resume/" + str(uuid.uuid4())[:8],
        "score": random.randint(50,100)
    }
    data.append(person)

# save to JSON
with open("dummy_leads.json", "w") as f:
    json.dump(data, f, indent=2)

# print("Generated 50 dummy leads in dummy_leads.json")
