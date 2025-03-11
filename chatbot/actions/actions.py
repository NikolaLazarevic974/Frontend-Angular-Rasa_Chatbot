# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

import random
from typing import Any, Text, Dict, List
#from data import getData

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
#
#


#-----------------------------------------------------------------------------------------

class ActionRecommendPetByType(Action):

    def name(self) -> Text:
        return "action_recommend_pet_by_type"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Extraction from slots
        type = tracker.get_slot("type")
        type = formatType(type)

        if not type:
            dispatcher.utter_message(text="You haven't provided the type in the message")
            return []
        
        eligable_pets = filterPets(type)

        attachment_data = {
            "action": "ActionRecommendPet",
            "ids": [pet["id"] for pet in random.sample(eligable_pets, 3)]
        }



        dispatcher.utter_message(text="Here are some recommendations", custom=attachment_data)
        return[]
    


#-----------------------------------------------------------------------------------------

class ActionRecommendSpecificPet(Action):

    def name(self) -> Text:
        return "action_recommend_specific_pet"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Debug: Print all slots
        print("All Slots:", tracker.slots)

        # Debug: Print latest entities
        print("Latest Entities:", tracker.latest_message.get("entities"))

        # Extraction from slots
        type = tracker.get_slot("type")

        size = tracker.get_slot("size")

        age = tracker.get_slot("age")
        print("Extracted Slots - Type:", type, "Size:", size, "Age:", age)


        size = formatSize(size)
        type = formatType(type)
        print(size, type)
        eligable_pets = filterPets(type, size, age)
        if (eligable_pets == None):
            dispatcher.utter_message(text="We don't have a pet that fits your criteria")
            return[]
        
        attachment_data = {
            "action": "ActionRecommendPet",
            "ids": [pet["id"] for pet in eligable_pets]
        }

        # Send the custom data in the message
        dispatcher.utter_message(
            text="Here are some of the pets I would recommend based on your criteria",
            custom=attachment_data  # This sends the custom object as part of the response
        )

        return[]


#-----------------------------------------------------------------------------------------

class ActionGetOrderStatus(Action):

    def name(self) -> Text:
        return "action_get_order_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Debug: Print all slots
        print("All Slots:", tracker.slots)

        # Debug: Print latest entities
        print("Latest Entities:", tracker.latest_message.get("entities"))

        # Extraction from slots
        id = tracker.get_slot("id")

        print(id)
        order = getOrderById(id)
        print(order)

        if (order == None):
            dispatcher.utter_message(text="The order number you provided does not seem to be valid")
            return[]

        order_id = order["id"]
        order_status = order["status"]

        if order_status == "accepted":
            message = f"Your order {order_id} has been accepted and is being prepared."
        elif order_status == "delivered":
            message = f"Your order {order_id} has been successfully delivered!"
        elif order_status == "canceled":
            message = f"Your order {order_id} has been canceled. If this is a mistake, please contact support."
        elif order_status == "in transit":
            message = f"Your order {order_id} is on the way and will arrive soon."
        else:
            message = f"Your order {order_id} has an unknown status. Please check again later."

        attachment_data = {
            "action": "ActionGetOrderStatus"
        }

        dispatcher.utter_message(text=message, custom=attachment_data)
        return[]


#-----------------------------------------------------------------------------------------


class ActionGetCartInfo(Action):

    def name(self) -> Text:
        return "action_get_cart_info"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        cart_items = getCart()

        if (len(cart_items) == 0):
            dispatcher.utter_message(text="The cart is currently empty")
            return[]

        totalPrice = getCartTotalPrice()

        message = "Here are the items in your cart:\n\n"

        for item in cart_items:
            item_summary = f"{item['quantity']}x {item['name']} ({item['sizes']}): ${item['price']} each\n\n"
            message += item_summary
        message += f"\nTotal price of items in your cart: ${totalPrice}"

        attachment_data = {
            "action": "ActionGetCartInfo"
        }


        dispatcher.utter_message(text=message, custom=attachment_data)
        return[]


#-----------------------------------------------------------------------------------------


def formatType(type):
    if type == None:
        return
    if type == "dogs":
        type = "dog"
    elif type == "cats":
        type = "cat"
    elif type == "parrots":
        type = "parrot"
    elif type == "chinchillas":
        type = "chinchilla"
    return type
    
def formatSize(size):
    if size == None:
        return
    if size == "very small":
        size = "XS"
    elif size == "small":
        size = "S"
    elif size == "medium":
        size = "M"
    elif size == "large":
        size = "L"
    elif size == "very large":
        size = "XL"
    return size


def filterPets( desiredType=None, desiredSize=None, desiredMaxAge=None):
    pets = getPets()
    eligableAnimals = []

    for animal in pets:
        condition1 = False
        condition2 = False
        if (desiredMaxAge == None):
            condition1 = True
        elif (animal["age"] <= float(desiredMaxAge)):
            condition2 = True
        if (
            (desiredType is None or animal["type"].lower() == desiredType.lower())
            and (desiredSize is None or animal["sizes"] == desiredSize)
            and (condition1 or condition2)
        ):
            eligableAnimals.append(animal)

    if len(eligableAnimals) > 3:
        eligableAnimals = random.sample(eligableAnimals, 3)
    return eligableAnimals if eligableAnimals else None

def getCartTotalPrice():
    cart_items = getCart()
    total_price = sum([item["price"] * item["quantity"] for item in cart_items])
    return total_price

def getOrderById(id):
    orders = getOrders()
    for order in orders:
        print(order["id"])
        print(order["id"] == id.strip())
        if order["id"] == id.strip():
            return order
    return None







def getCart():
    cart_items = [
        {
            "id": 32,
            "name": "Amazon Parrot",
            "type": "parrot",
            "species": "Amazona",
            "description": "A medium-sized parrot known for its bright green plumage and playful nature.",
            "age": 4,
            "sizes": "M",
            "price": 800,
            "reviews": [
                "Social and interactive.",
                "Great talkers."
            ],
            "image": "parrot_images/amazon_parrot.jpg",
            "quantity": 2
        },
        {
            "id": 5,
            "name": "Angelfish",
            "type": "fish",
            "species": "Pterophyllum scalare",
            "description": "A graceful freshwater fish with an iconic triangular shape.",
            "age": 2,
            "sizes": "L",
            "price": 15.99,
            "reviews": [
                "Majestic and elegant.",
                "Perfect for community tanks."
            ],
            "image": "fish_images/angelfish.jpg",
            "quantity": 1
        },
        {
            "id": 28,
            "name": "African Grey",
            "type": "parrot",
            "species": "Psittacus erithacus",
            "description": "An intelligent and quiet parrot known for its ability to mimic human speech.",
            "age": 3,
            "sizes": "M",
            "price": 350,
            "reviews": [
                "Extremely intelligent.",
                "Loves attention."
            ],
            "image": "parrot_images/african_grey.jpg",
            "quantity": 1
        }
    ]
    return cart_items




def getOrders():
    orders = [
        {
            "id": "drdnpM7G3HL4yxk51zggG",
            "cartAnimals": [
                {
                    "id": 2,
                    "name": "Betta",
                    "species": "Betta splendens",
                    "description": "An aggressive, colorful freshwater fish commonly kept in aquariums.",
                    "age": 1,
                    "sizes": "XS",
                    "price": 12.49,
                    "reviews": [
                        "Stunning colors!",
                        "Easy to care for."
                    ],
                    "image": "fish_images/betta.jpg",
                    "quantity": 2
                },
                {
                    "id": 5,
                    "name": "Angelfish",
                    "species": "Pterophyllum scalare",
                    "description": "A graceful freshwater fish with an iconic triangular shape.",
                    "age": 2,
                    "sizes": "L",
                    "price": 15.99,
                    "image": "fish_images/angelfish.jpg",
                    "reviews": [
                        "Majestic and elegant.",
                        "Perfect for community tanks."
                    ],
                    "quantity": 1
                }
            ],
            "totalPrice": 40.97,
            "status": "in transit"
        },
        {
            "id": "uBjBGBScPR69KgaiO4tGq",
            "cartAnimals": [
                {
                    "id": 5,
                    "name": "Angelfish",
                    "species": "Pterophyllum scalare",
                    "description": "A graceful freshwater fish with an iconic triangular shape.",
                    "age": 2,
                    "sizes": "L",
                    "price": 15.99,
                    "reviews": [
                        "Majestic and elegant.",
                        "Perfect for community tanks."
                    ],
                    "image": "fish_images/angelfish.jpg",
                    "quantity": 1
                }
            ],
            "totalPrice": 15.99,
            "status": "delivered"
        }
    ]
    return orders


def getPets():
    pets = [
        {
            "id": 1,
            "name": "Clownfish",
            "type": "fish",
            "species": "Amphiprioninae",
            "description": "A small, brightly colored fish known for its symbiotic relationship with sea anemones.",
            "age": 2,
            "sizes": "S",
            "price": 25.99,
            "reviews": ["Beautiful fish!", "Very healthy and active."],
            "image": "fish_images/clownfish.jpg"
        },
        {
            "id": 2,
            "name": "Betta",
            "type": "fish",
            "species": "Betta splendens",
            "description": "An aggressive, colorful freshwater fish commonly kept in aquariums.",
            "age": 1,
            "sizes": "XS",
            "price": 12.49,
            "reviews": ["Stunning colors!", "Easy to care for."],
            "image": "fish_images/betta.jpg"
        },
        {
            "id": 3,
            "name": "Goldfish",
            "type": "fish",
            "species": "Carassius auratus",
            "description": "A popular pet fish with a variety of colors and tail shapes.",
            "age": 3,
            "sizes": "M",
            "price": 8.99,
            "reviews": ["Classic favorite!", "Perfect for beginners."],
            "image": "fish_images/goldfish.jpg"
        },
        {
            "id": 4,
            "name": "Guppy",
            "type": "fish",
            "species": "Poecilia reticulata",
            "description": "A small, colorful fish that's easy to breed and maintain.",
            "age": 1,
            "sizes": "XS",
            "price": 4.99,
            "reviews": ["Hardy and colorful.", "Great for small tanks."],
            "image": "fish_images/guppy.jpg"
        },
        {
            "id": 5,
            "name": "Angelfish",
            "type": "fish",
            "species": "Pterophyllum scalare",
            "description": "A graceful freshwater fish with an iconic triangular shape.",
            "age": 2,
            "sizes": "L",
            "price": 15.99,
            "reviews": ["Majestic and elegant.", "Perfect for community tanks."],
            "image": "fish_images/angelfish.jpg"
        },
        {
            "id": 6,
            "name": "Neon Tetra",
            "type": "fish",
            "species": "Paracheirodon innesi",
            "description": "A small, peaceful fish with bright neon colors.",
            "age": 1,
            "sizes": "XS",
            "price": 5.99,
            "reviews": ["Vibrant colors!", "Great in schools."],
            "image": "fish_images/neon_tetra.jpg"
        },
        {
            "id": 7,
            "name": "Oscar",
            "type": "fish",
            "species": "Astronotus ocellatus",
            "description": "A large, predatory fish with bold colors and personality.",
            "age": 3,
            "sizes": "L",
            "price": 18.99,
            "reviews": ["Very intelligent!", "Aggressive but beautiful."],
            "image": "fish_images/oscar.jpg"
        },
        {
            "id": 8,
            "name": "Molly",
            "type": "fish",
            "species": "Poecilia sphenops",
            "description": "A live-bearing fish known for its variety of colors.",
            "age": 2,
            "sizes": "M",
            "price": 6.49,
            "reviews": ["Great for beginners!", "Active and colorful."],
            "image": "fish_images/molly.jpg"
        },
        {
            "id": 9,
            "name": "Platies",
            "type": "fish",
            "species": "Xiphophorus maculatus",
            "description": "A colorful, hardy fish often kept in freshwater aquariums.",
            "age": 1,
            "sizes": "S",
            "price": 4.49,
            "reviews": ["Easy to breed.", "Great for small aquariums."],
            "image": "fish_images/platies.jpg"
        },
        {
            "id": 10,
            "name": "Tetra",
            "type": "fish",
            "species": "Hyphessobrycon eques",
            "description": "A small, peaceful fish that thrives in schools.",
            "age": 1,
            "sizes": "S",
            "price": 3.99,
            "reviews": ["Great in groups!", "Bright and peaceful."],
            "image": "fish_images/tetra.jpg"
        },
        {
            "id": 11,
            "name": "Piranha",
            "type": "fish",
            "species": "Pygocentrus nattereri",
            "description": "A predatory fish known for its sharp teeth and aggressive behavior.",
            "age": 4,
            "sizes": "L",
            "price": 22.99,
            "reviews": ["Fearsome but fascinating.", "Needs a large tank."],
            "image": "fish_images/piranha.jpg"
        },
        {
            "id": 13,
            "name": "Golden Retriever",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A friendly, intelligent breed known for its loyalty.",
            "age": 4,
            "sizes": "L",
            "price": 200,
            "reviews": ["Gentle and loving.", "Great family dog."],
            "image": "dog_images/golden_retriever.jpg"
        },
        {
            "id": 14,
            "name": "Bulldog",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A sturdy dog with a muscular build and a calm temperament.",
            "age": 3,
            "sizes": "M",
            "price": 300,
            "reviews": ["Calm but strong.", "Great companion."],
            "image": "dog_images/bulldog.jpg"
        },
        {
            "id": 15,
            "name": "Labrador Retriever",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A versatile, friendly dog breed known for being great with families.",
            "age": 2,
            "sizes": "L",
            "price": 300,
            "reviews": ["Friendly and playful.", "Loyal and loving."],
            "image": "dog_images/labrador_retriever.jpg"
        },
        {
            "id": 16,
            "name": "Poodle",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A highly intelligent dog breed with curly fur.",
            "age": 3,
            "sizes": "M",
            "price": 250,
            "reviews": ["Intelligent and easy to train.", "Great with families."],
            "image": "dog_images/poodle.jpg"
        },
        {
            "id": 17,
            "name": "Beagle",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A small hound dog breed known for its tracking abilities.",
            "age": 4,
            "sizes": "M",
            "price": 350,
            "reviews": ["Playful and energetic.", "Great with kids."],
            "image": "dog_images/beagle.jpg"
        },
        {
            "id": 18,
            "name": "Cocker Spaniel",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A gentle, affectionate dog breed with long, flowing ears.",
            "age": 3,
            "sizes": "M",
            "price": 400,
            "reviews": ["Loyal and sweet.", "Great companion dog."],
            "image": "dog_images/cocker_spaniel.jpg"
        },
        {
            "id": 19,
            "name": "Rottweiler",
            "type": "dog",
            "species": "Canis lupus familiaris",
            "description": "A strong, confident breed known for its guarding instincts.",
            "age": 5,
            "sizes": "L",
            "price": 300,
            "reviews": ["Confident and brave.", "Needs training."],
            "image": "dog_images/rottweiler.jpg"
        },
        {
            "id": 20,
            "name": "Persian",
            "type": "cat",
            "species": "Felis catus",
            "description": "A calm and affectionate breed with a long, luxurious coat.",
            "age": 4,
            "sizes": "M",
            "price": 200,
            "reviews": ["Calm and loving.", "Low energy."],
            "image": "cat_images/persian.jpg"
        },
        {
            "id": 21,
            "name": "Siamese",
            "type": "cat",
            "species": "Felis catus",
            "description": "A vocal and playful breed with striking blue eyes.",
            "age": 2,
            "sizes": "M",
            "price": 400,
            "reviews": ["Very vocal!", "Very active and social."],
            "image": "cat_images/siamese.jpg"
        },
        {
            "id": 22,
            "name": "Maine Coon",
            "type": "cat",
            "species": "Felis catus",
            "description": "A large, gentle breed with tufted ears and long fur.",
            "age": 3,
            "sizes": "L",
            "price": 300,
            "reviews": ["Loyal and friendly.", "Great with children."],
            "image": "cat_images/maine_coon.jpg"
        },
        {
            "id": 23,
            "name": "Bengal",
            "type": "cat",
            "species": "Felis catus",
            "description": "A striking breed known for its leopard-like markings and energetic nature.",
            "age": 2,
            "sizes": "M",
            "price": 300,
            "reviews": ["Active and playful.", "Needs lots of attention."],
            "image": "cat_images/bengal.jpg"
        },
        {
            "id": 24,
            "name": "Sphynx",
            "type": "cat",
            "species": "Felis catus",
            "description": "A hairless breed known for its affectionate nature and wrinkled skin.",
            "age": 3,
            "sizes": "M",
            "price": 450,
            "reviews": ["Loving and sociable.", "Needs regular skin care."],
            "image": "cat_images/sphynx.jpg"
        },
        {
            "id": 25,
            "name": "British Shorthair",
            "type": "cat",
            "species": "Felis catus",
            "description": "A calm, round-faced breed known for its plush coat.",
            "age": 3,
            "sizes": "M",
            "price": 200,
            "reviews": ["Calm and independent.", "Great for apartment living."],
            "image": "cat_images/british_shorthair.jpg"
        },
        {
            "id": 26,
            "name": "Russian Blue",
            "type": "cat",
            "species": "Felis catus",
            "description": "A breed known for its beautiful blue-gray coat and green eyes.",
            "age": 2,
            "sizes": "M",
            "price": 220,
            "reviews": ["Reserved but loving.", "Great companion."],
            "image": "cat_images/russian_blue.jpg"
        },
        {
            "id": 27,
            "name": "Macaw",
            "type": "parrot",
            "species": "Ara macao",
            "description": "A colorful and intelligent bird known for its large size and long tail.",
            "age": 4,
            "sizes": "L",
            "price": 300,
            "reviews": ["Bright and friendly.", "Needs lots of space."],
            "image": "parrot_images/macaw.jpg"
        },
        {
            "id": 28,
            "name": "African Grey",
            "type": "parrot",
            "species": "Psittacus erithacus",
            "description": "An intelligent and quiet parrot known for its ability to mimic human speech.",
            "age": 3,
            "sizes": "M",
            "price": 350,
            "reviews": ["Extremely intelligent.", "Loves attention."],
            "image": "parrot_images/african_grey.jpg"
        },
        {
            "id": 29,
            "name": "Cockatoo",
            "type": "parrot",
            "species": "Cacatuidae",
            "description": "A playful and affectionate parrot known for its iconic crest.",
            "age": 5,
            "sizes": "M",
            "price": 320,
            "reviews": ["Very social and vocal.", "Needs constant interaction."],
            "image": "parrot_images/cockatoo.jpg"
        },
        {
            "id": 30,
            "name": "Budgerigar",
            "type": "parrot",
            "species": "Melopsittacus undulatus",
            "description": "A small and colorful parrot commonly kept as a pet.",
            "age": 2,
            "sizes": "XS",
            "price": 30,
            "reviews": ["Friendly and easy to care for.", "Great for beginners."],
            "image": "parrot_images/budgerigar.jpg"
        },
        {
            "id": 31,
            "name": "Lovebird",
            "type": "parrot",
            "species": "Agapornis",
            "description": "A small, affectionate parrot known for its vibrant colors.",
            "age": 1,
            "sizes": "XS",
            "price": 50,
            "reviews": ["Loves to cuddle.", "Very active and playful."],
            "image": "parrot_images/lovebird.jpg"
        },
        {
            "id": 32,
            "name": "Amazon Parrot",
            "type": "parrot",
            "species": "Amazona",
            "description": "A medium-sized parrot known for its bright green plumage and playful nature.",
            "age": 4,
            "sizes": "M",
            "price": 800,
            "reviews": ["Social and interactive.", "Great talkers."],
            "image": "parrot_images/amazon_parrot.jpg"
        },
        {
            "id": 33,
            "name": "Eclectus Parrot",
            "type": "parrot",
            "species": "Eclectus roratus",
            "description": "A colorful parrot known for the dramatic color differences between males and females.",
            "age": 3,
            "sizes": "M",
            "price": 950,
            "reviews": ["Affectionate and intelligent.", "Quiet compared to other parrots."],
            "image": "parrot_images/eclectus_parrot.jpg"
        },
        
        # Hamsters
        {
            "id": 34,
            "name": "Syrian Hamster",
            "type": "hamster",
            "species": "Mesocricetus auratus",
            "description": "A popular hamster breed known for its docile nature and golden fur.",
            "age": 1,
            "sizes": "S",
            "price": 15,
            "reviews": ["Easy to care for.", "Great for kids."],
            "image": "hamster_images/syrian_hamster.jpg"
        },
        {
            "id": 35,
            "name": "Dwarf Hamster",
            "type": "hamster",
            "species": "Phodopus",
            "description": "A small hamster breed with a gentle and friendly personality.",
            "age": 1,
            "sizes": "XS",
            "price": 10,
            "reviews": ["Tiny and adorable.", "Needs a small cage."],
            "image": "hamster_images/dwarf_hamster.jpg"
        },
        {
            "id": 36,
            "name": "Roborovski Hamster",
            "type": "hamster",
            "species": "Phodopus roborovskii",
            "description": "The smallest hamster breed, known for its speed and agility.",
            "age": 1,
            "sizes": "XS",
            "price": 12,
            "reviews": ["Very fast and active.", "Requires a large space."],
            "image": "hamster_images/roborovski_hamster.jpg"
        },
        {
            "id": 37,
            "name": "Campbell's Dwarf Hamster",
            "type": "hamster",
            "species": "Phodopus campbelli",
            "description": "A small hamster known for its sociable nature and variety of colors.",
            "age": 1,
            "sizes": "XS",
            "price": 8,
            "reviews": ["Friendly and curious.", "Enjoys company."],
            "image": "hamster_images/campbells_dwarf_hamster.jpg"
        },
        {
            "id": 38,
            "name": "Chinese Hamster",
            "type": "hamster",
            "species": "Cricetulus griseus",
            "description": "A small, shy hamster breed with a distinctive long body.",
            "age": 2,
            "sizes": "S",
            "price": 18,
            "reviews": ["Quiet and independent.", "Great for solitary living."],
            "image": "hamster_images/chinese_hamster.jpg"
        },
        
        # Chinchillas
        {
            "id": 39,
            "name": "Standard Chinchilla",
            "type": "chinchilla",
            "species": "Chinchilla lanigera",
            "description": "A fluffy, nocturnal rodent known for its thick, soft fur.",
            "age": 2,
            "sizes": "M",
            "price": 200,
            "reviews": ["Softest fur!", "Active at night."],
            "image": "chinchilla_images/standard_chinchilla.jpg"
        },
        {
            "id": 40,
            "name": "Black Velvet Chinchilla",
            "type": "chinchilla",
            "species": "Chinchilla lanigera",
            "description": "A chinchilla breed known for its dark fur with a velvety sheen.",
            "age": 1,
            "sizes": "M",
            "price": 250,
            "reviews": ["Beautiful dark color.", "Very gentle."],
            "image": "chinchilla_images/black_velvet_chinchilla.jpg"
        },
        {
            "id": 41,
            "name": "Himalayan Chinchilla",
            "type": "chinchilla",
            "species": "Chinchilla lanigera",
            "description": "A chinchilla breed with a unique light-colored coat and dark points.",
            "age": 2,
            "sizes": "M",
            "price": 220,
            "reviews": ["Cute and friendly.", "Loves attention."],
            "image": "chinchilla_images/himalayan_chinchilla.jpg"
        }
    ]
    return pets


    


