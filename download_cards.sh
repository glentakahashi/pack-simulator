#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p cards

# Function to download a single image
download_image() {
    local set=$1
    local id=$2
    local padded_id=$(printf "%03d" $id)
    local padded_set=$(printf "%03d" $set)
    local url="https://cdn.dreamborn.ink/images/en/cards/${padded_set}-${padded_id}"
    local output="images/cards/${padded_set}-${padded_id}.jpg"
    
    # Only download if file doesn't exist
    if [ ! -f "$output" ]; then
        echo "Downloading set $set, card $id..."
        curl -s -f "$url" -o "$output"
        if [ $? -ne 0 ]; then
            echo "Failed to download $url"
            rm -f "$output" 2>/dev/null
        fi
    else
        echo "Skipping set $set, card $id (already exists)"
    fi
}

# Main download loop
for set in {1..7}; do
    echo "Processing set $set..."
    
    # Sets 1-2 have 216 cards
    if [ $set -le 2 ]; then
        max_cards=216
    # Sets 3-7 have 222 cards
    else
        max_cards=222
    fi
    
    for id in $(seq 1 $max_cards); do
        download_image $set $id
        # Add a small delay to be nice to the server
        sleep 0.1
    done
done

echo "Download complete!" 