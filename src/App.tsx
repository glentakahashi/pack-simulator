import React, { useState } from 'react';
import { Card } from './types/card';
import { openPack, PACK_COSTS, SetName } from './services/cardService';
import { CardDisplay } from './components/CardDisplay';
import { CardTracker } from './components/CardTracker';
import './styles/App.css';

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [openedCards, setOpenedCards] = useState<Card[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [currentSet, setCurrentSet] = useState<SetName>('The First Chapter');
  const [packsOpened, setPacksOpened] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [useEightyPercent, setUseEightyPercent] = useState(false);
  const [customPackCost, setCustomPackCost] = useState<number | null>(null);
  const [revealImmediately, setRevealImmediately] = useState(false);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [openNumber, setOpenNumber] = useState(0);

  const adjustedValue = useEightyPercent ? totalValue * 0.8 : totalValue;
  const packCost = customPackCost ?? PACK_COSTS[currentSet].sealed_booster;
  const boxCost = customPackCost ? customPackCost * 24 : PACK_COSTS[currentSet].box;
  const caseCost = customPackCost ? customPackCost * 96 : PACK_COSTS[currentSet].case;

  const handleOpenPack = () => {
    setIsOpening(true);
    const { cards: newCards, packValue: newPackValue } = openPack(currentSet, true);
    setCards(newCards);
    setOpenedCards(prev => [...prev, ...newCards]);
    setPacksOpened(prev => prev + 1);
    setTotalCost(prev => prev + packCost);
    setTotalValue(prev => prev + newPackValue);
    setIsOpening(false);
    setOpenNumber(prev => prev + 1);
  };

  const handleOpenBox = () => {
    setIsOpening(true);
    let totalValue = 0;
    let allNewCards: Card[] = [];

    let allowEnchanted = true;
    for (let i = 0; i < 24; i++) {
      const { cards: newCards, packValue: newPackValue } = openPack(currentSet, allowEnchanted);
      if (newCards.some(card => card.rarity === 'Enchanted')) {
        allowEnchanted = false;
      }
      totalValue += newPackValue;
      allNewCards = [...allNewCards, ...newCards];
    }

    setCards(allNewCards);
    setOpenedCards(prev => [...prev, ...allNewCards]);
    setPacksOpened(prev => prev + 24);
    setTotalCost(prev => prev + boxCost);
    setTotalValue(prev => prev + totalValue);
    setIsOpening(false);
    setOpenNumber(prev => prev + 24);
  };

  const handleOpenCase = () => {
    setIsOpening(true);
    let totalValue = 0;
    let allNewCards: Card[] = [];

    let numEnchanted = 0;
    for (let i = 0; i < 96; i++) {
      const { cards: newCards, packValue: newPackValue } = openPack(currentSet, numEnchanted < 2);
      if (newCards.some(card => card.rarity === 'Enchanted')) {
        numEnchanted++;
      }
      totalValue += newPackValue;
      allNewCards = [...allNewCards, ...newCards];
    }

    setCards(allNewCards);
    setOpenedCards(prev => [...prev, ...allNewCards]);
    setPacksOpened(prev => prev + 96);
    setTotalCost(prev => prev + caseCost);
    setTotalValue(prev => prev + totalValue);
    setIsOpening(false);
    setOpenNumber(prev => prev + 96);
  };

  const handleReset = () => {
    setCards([]);
    setOpenedCards([]);
    setPacksOpened(0);
    setTotalCost(0);
    setTotalValue(0);
  };

  const profitLoss = adjustedValue - totalCost;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lorcana Pack Opening Simulator</h1>
        <div className="pack-info">
          <div className="header-content">
            <div className="stats-container">
              <div className="stat-box">
                <span className="stat-label">Packs Opened:</span>
                <span className="stat-value">{packsOpened}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Cost:</span>
                <span className="stat-value">${totalCost.toFixed(2)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Value:</span>
                <span className="stat-value">${adjustedValue.toFixed(2)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Profit/Loss:</span>
                <span className={`stat-value ${profitLoss >= 0 ? 'profit' : 'loss'}`}>
                  ${profitLoss.toFixed(2)} (
                  {totalCost === 0 ? '0' : ((profitLoss / totalCost) * 100).toFixed(1)}%)
                </span>
              </div>
              <button className="reset-button" onClick={handleReset}>
                Reset Session
              </button>
            </div>

            <div className="pack-buttons">
              <button className="open-pack-button" onClick={handleOpenPack} disabled={isOpening}>
                Open Single Pack (${packCost.toFixed(2)})
              </button>
              <button className="open-box-button" onClick={handleOpenBox} disabled={isOpening}>
                Open Box - 24 Packs (${boxCost.toFixed(2)})
              </button>
              <button className="open-case-button" onClick={handleOpenCase} disabled={isOpening}>
                Open Case - 96 Packs (${caseCost.toFixed(2)})
              </button>
            </div>

            <div className="set-selector-container">
              <div className="set-selector-options">
                <div className="set-selector">
                  <label htmlFor="set-select">Select Set:</label>
                  <select
                    id="set-select"
                    value={currentSet}
                    onChange={e => setCurrentSet(e.target.value as SetName)}
                    className="set-dropdown"
                  >
                    {Object.keys(PACK_COSTS).map(set => (
                      <option key={set} value={set}>
                        {set}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="custom-cost-label">
                  Custom Pack Cost: $
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={customPackCost ?? ''}
                    onChange={e =>
                      setCustomPackCost(e.target.value ? parseFloat(e.target.value) : null)
                    }
                    placeholder={PACK_COSTS[currentSet].sealed_booster.toFixed(2)}
                    className="custom-cost-input"
                  />
                </label>
                <div className="display-options">
                  <label>
                    <input
                      type="checkbox"
                      checked={useEightyPercent}
                      onChange={e => setUseEightyPercent(e.target.checked)}
                    />
                    Use 80% of TCGPlayer price
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={revealImmediately}
                      onChange={e => setRevealImmediately(e.target.checked)}
                    />
                    Reveal cards immediately
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={sortByPrice}
                      onChange={e => setSortByPrice(e.target.checked)}
                    />
                    Sort by price (high to low)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <CardDisplay
          cards={cards}
          revealImmediately={revealImmediately}
          sortByPrice={sortByPrice}
          useEightyPercent={useEightyPercent}
          openNumber={openNumber}
        />
        <CardTracker openedCards={openedCards} />
      </main>
      <footer className="app-footer">
        <div className="watermark">Prices updated 4/29/25</div>
        <div className="disclaimer">All images are property of Ravensburger and Disney</div>
      </footer>
    </div>
  );
};

export default App;
