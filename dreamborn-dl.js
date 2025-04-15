// Open the IndexedDB database
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('dreamborn');

    request.onerror = () => reject(new Error('Failed to open database'));
    request.onsuccess = event => resolve(event.target.result);
  });
};

// Process a single card entry
const processCard = card => {
  try {
    const data = JSON.parse(card);

    // Skip if no ID or if it's a promo card
    if (!data.id || data.rarity === 'promo') {
      return null;
    }

    // Skip specific card numbers
    if (['223', '224', '225', '226'].includes(data.number)) {
      return null;
    }

    return {
      id: data.id,
      number: data.number,
      setId: data.setId,
      name: data.name,
      title: data.title,
      rarity: data.rarity,
      normalPrice: data.prices?.base?.TP?.price ?? 0,
      foilPrice: (data.prices?.foil ?? data.prices?.base)?.TP?.price ?? 0,
    };
  } catch (error) {
    console.error('Error processing card:', error);
    return null;
  }
};

// Main function to process all cards
const processAllCards = async () => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['dreamborn'], 'readonly');
    const objectStore = transaction.objectStore('dreamborn');

    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();

      request.onerror = () => reject(new Error('Failed to get cards'));

      request.onsuccess = event => {
        const sets = {};

        // Process each card and organize by set
        event.target.result.forEach(card => {
          const processedCard = processCard(card);
          if (processedCard) {
            const setId = processedCard.setId;
            if (!sets[setId]) {
              sets[setId] = [];
            }
            sets[setId].push(processedCard);
          }
        });

        resolve(sets);
      };
    });
  } catch (error) {
    console.error('Error in processAllCards:', error);
    throw error;
  }
};

// Execute the process
processAllCards()
  .then(sets => {
    console.log(JSON.stringify(sets, null, 2));
  })
  .catch(error => {
    console.error('Fatal error:', error);
  });
