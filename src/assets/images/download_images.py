import requests
import os
import json

fish = [
    {'name': 'Clownfish', 'image': 'fish_images/clownfish.jpg'},
    {'name': 'Betta', 'image': 'fish_images/betta.jpg'},
    {'name': 'Goldfish', 'image': 'fish_images/goldfish.jpg'},
    {'name': 'Guppy', 'image': 'fish_images/guppy.jpg'},
    {'name': 'Angelfish', 'image': 'fish_images/angelfish.jpg'},
    {'name': 'Neon Tetra', 'image': 'fish_images/neon_tetra.jpg'},
    {'name': 'Oscar', 'image': 'fish_images/oscar.jpg'},
    {'name': 'Molly', 'image': 'fish_images/molly.jpg'},
    {'name': 'Platies', 'image': 'fish_images/platies.jpg'},
    {'name': 'Tetra', 'image': 'fish_images/tetra.jpg'},
    {'name': 'Piranha', 'image': 'fish_images/piranha.jpg'},
    {'name': 'Shark', 'image': 'fish_images/shark.jpg'}
]

dogs = [
    {'name': 'Golden Retriever', 'image': 'dog_images/golden_retriever.jpg'},
    {'name': 'Bulldog', 'image': 'dog_images/bulldog.jpg'},
    {'name': 'Labrador Retriever', 'image': 'dog_images/labrador_retriever.jpg'},
    {'name': 'Poodle', 'image': 'dog_images/poodle.jpg'},
    {'name': 'Beagle', 'image': 'dog_images/beagle.jpg'},
    {'name': 'Cocker Spaniel', 'image': 'dog_images/cocker_spaniel.jpg'},
    {'name': 'Rottweiler', 'image': 'dog_images/rottweiler.jpg'}
]

cats = [
    {'name': 'Persian', 'image': 'cat_images/persian.jpg'},
    {'name': 'Siamese', 'image': 'cat_images/siamese.jpg'},
    {'name': 'Maine Coon', 'image': 'cat_images/maine_coon.jpg'},
    {'name': 'Bengal', 'image': 'cat_images/bengal.jpg'},
    {'name': 'Sphynx', 'image': 'cat_images/sphynx.jpg'},
    {'name': 'British Shorthair', 'image': 'cat_images/british_shorthair.jpg'},
    {'name': 'Russian Blue', 'image': 'cat_images/russian_blue.jpg'}
]

parrots = [
    {'name': 'Macaw', 'image': 'parrot_images/macaw.jpg'},
    {'name': 'African Grey', 'image': 'parrot_images/african_grey.jpg'},
    {'name': 'Cockatoo', 'image': 'parrot_images/cockatoo.jpg'},
    {'name': 'Budgerigar', 'image': 'parrot_images/budgerigar.jpg'},
    {'name': 'Lovebird', 'image': 'parrot_images/lovebird.jpg'},
    {'name': 'Amazon Parrot', 'image': 'parrot_images/amazon_parrot.jpg'},
    {'name': 'Eclectus Parrot', 'image': 'parrot_images/eclectus_parrot.jpg'}
]

hamsters = [
    {'name': 'Syrian Hamster', 'image': 'hamster_images/syrian_hamster.jpg'},
    {'name': 'Dwarf Hamster', 'image': 'hamster_images/dwarf_hamster.jpg'},
    {'name': 'Roborovski Hamster', 'image': 'hamster_images/roborovski_hamster.jpg'},
    {'name': 'Campbell\'s Dwarf Hamster', 'image': 'hamster_images/campbells_dwarf_hamster.jpg'},
    {'name': 'Chinese Hamster', 'image': 'hamster_images/chinese_hamster.jpg'}
]

chinchillas = [
    {'name': 'Standard Chinchilla', 'image': 'chinchilla_images/standard_chinchilla.jpg'},
    {'name': 'Black Velvet Chinchilla', 'image': 'chinchilla_images/black_velvet_chinchilla.jpg'},
    {'name': 'Himalayan Chinchilla', 'image': 'chinchilla_images/himalayan_chinchilla.jpg'}
]


def download_images(api_key, query, directory, save_location, num_images=10,):
    base_url = "https://api.unsplash.com/search/photos"
    headers = {
        "Authorization": f"Client-ID {api_key}"
    }
    params = {
        "query": query,
        "per_page": num_images
    }

    response = requests.get(base_url, headers=headers, params=params)
    data = response.json()

    if not os.path.exists(f"{directory}_images"):
        os.makedirs(f"{directory}_images")

    for i, image in enumerate(data["results"], 1):
        image_url = image["urls"]["regular"]
        image_response = requests.get(image_url)
        
        if image_response.status_code == 200:
            with open(f"{ save_location }", "wb") as file:
                file.write(image_response.content)
            print(f"Downloaded { save_location }")
        else:
            print(f"Failed to download image { save_location }")

    print("Download complete!")


api_key = "fDq1TNerje6C3ijljgh_D5FL9NAi8ywX-UX9f7LnGwg"
for i in chinchillas:
    download_images(api_key, i["name"], "chinchilla", i["image"], 1)





#download_shirt_images(api_key, "jeans men", 3)

