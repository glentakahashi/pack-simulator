#!/usr/bin/env python3

import requests
import json

# mapping of each set to list of tcgplayer ids (sealed booster, box, case)
SET_TO_TCGPLAYER_IDS = {
    "The First Chapter": ["491182", "485256", "485258"],
    "Rise of the Floodborn": ["529695", "516276", "518639"],
    "Into the Inklands": ["543932", "531521", "531522"],
    "Ursula's Return": ["553902", "543859", "543885"],
    "Shimmering Skies": ["565133", "555130", "555131"],
    "Azurite Sea": ["593831", "578093", "578094"],
    "Archazia's Island": ["607762", "607758", "607759"]
}

# Initialize prices dictionary
PRICES = {set_name: [] for set_name in SET_TO_TCGPLAYER_IDS.keys()}

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
    for product_id in product_ids:
        print(f"Getting price for {product_id}")
        price = get_market_price(product_id)
        if price is not None:
            PRICES[set_name].append(price)

# Print the results
print("\nPrices by set:")
for set_name, prices in PRICES.items():
    print(f"{set_name}: {prices}") 