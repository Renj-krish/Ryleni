import urllib.request
import os

images = {
    'about_hallway.jpg': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
    'mobile_mockup.jpg': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    'laptop_code.jpg': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'software_boxes.jpg': 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    'ui_cards.jpg': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    'brain_tech.jpg': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    'team_minimal.jpg': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80'
}

os.makedirs('assets/images', exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for name, url in images.items():
    dest = os.path.join('assets/images', name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out_f:
            out_f.write(resp.read())
        print(f"Downloaded {name} successfully.")
    except Exception as e:
        print(f"Error {name}: {e}")
