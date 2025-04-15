#!/usr/bin/env python3

import requests
import json
import os

# mapping of each set to list of tcgplayer ids (sealed booster, box, case)
SET_TO_TCGPLAYER_IDS = {
    "The First Chapter": {'sealed_booster': "491182", 'box': "485256", 'case': "485258"},
    "Rise of the Floodborn": {'sealed_booster': "529695", 'box': "516276", 'case': "518639"},
    "Into the Inklands": {'sealed_booster': "543932", 'box': "531521", 'case': "531522"},
    "Ursula's Return": {'sealed_booster': "553902", 'box': "543859", 'case': "543885"},
    "Shimmering Skies": {'sealed_booster': "565133", 'box': "555130", 'case': "555131"},
      "Azurite Sea": {'sealed_booster': "593831", 'box': "578093", 'case': "578094"},
    "Archazia's Island": {'sealed_booster': "607762", 'box': "607758", 'case': "607759"}
}

# Initialize prices dictionary
PRICES = {set_name: {} for set_name in SET_TO_TCGPLAYER_IDS.keys()}

def get_market_price(product_id):
    """Fetch market price for a given TCGPlayer product ID."""
    url = f"https://mp-search-api.tcgplayer.com/v2/product/{product_id}/details"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data.get('marketPrice')
    except requests.exceptions.RequestException as e:
        print(f"Error fetching price for product {product_id}: {e}")
        return None

# Get the prices for each set
for set_name, product_ids in SET_TO_TCGPLAYER_IDS.items():
    print(f"Getting prices for {set_name}")
    for product_type, product_id in product_ids.items():
        print(f"Getting price for {product_id}")
        price = get_market_price(product_id)
        if price is not None:
            PRICES[set_name][product_type] = price

# Export the prices to a json file
# uses dirname of the script to get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(current_dir, '../../src/data/prices.json'), 'w') as f:
    json.dump(PRICES, f)

