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

  const handleOpenPack = () => {
    setIsOpening(true);
    const { cards: newCards, packValue: newPackValue } = openPack(currentSet);
    const packCost = PACK_COSTS[currentSet].single;

    setCards(newCards);
    setOpenedCards(prev => [...prev, ...newCards]);
    setPacksOpened(prev => prev + 1);
    setTotalCost(prev => prev + packCost);
    setTotalValue(prev => prev + newPackValue);
    setIsOpening(false);
  };

  const handleOpenBox = () => {
    setIsOpening(true);
    let totalValue = 0;
    let allNewCards: Card[] = [];
    const boxCost = PACK_COSTS[currentSet].box;

    for (let i = 0; i < 24; i++) {
      const { cards: newCards, packValue: newPackValue } = openPack(currentSet);
      totalValue += newPackValue;
      allNewCards = [...allNewCards, ...newCards];
    }

    setCards(allNewCards);
    setOpenedCards(prev => [...prev, ...allNewCards]);
    setPacksOpened(prev => prev + 24);
    setTotalCost(prev => prev + boxCost);
    setTotalValue(prev => prev + totalValue);
    setIsOpening(false);
  };

  const handleOpenCase = () => {
    setIsOpening(true);
    let totalValue = 0;
    let allNewCards: Card[] = [];
    const caseCost = PACK_COSTS[currentSet].case;

    for (let i = 0; i < 96; i++) {
      const { cards: newCards, packValue: newPackValue } = openPack(currentSet);
      totalValue += newPackValue;
      allNewCards = [...allNewCards, ...newCards];
    }

    setCards(allNewCards);
    setOpenedCards(prev => [...prev, ...allNewCards]);
    setPacksOpened(prev => prev + 96);
    setTotalCost(prev => prev + caseCost);
    setTotalValue(prev => prev + totalValue);
    setIsOpening(false);
  };

  const handleReset = () => {
    setCards([]);
    setOpenedCards([]);
    setPacksOpened(0);
    setTotalCost(0);
    setTotalValue(0);
  };

  const profitLoss = totalValue - totalCost;

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
                <span className="stat-value">${totalValue.toFixed(2)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Profit/Loss:</span>
                <span className={`stat-value ${profitLoss >= 0 ? 'profit' : 'loss'}`}>
                  ${profitLoss.toFixed(2)} ({((profitLoss / totalCost) * 100).toFixed(1)}%)
                </span>
              </div>
              <button className="reset-button" onClick={handleReset}>
                Reset Session
              </button>
            </div>
            <div className="set-selector-container">
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
              <div className="pack-buttons">
                <button className="open-pack-button" onClick={handleOpenPack} disabled={isOpening}>
                  Open Single Pack (${PACK_COSTS[currentSet].single.toFixed(2)})
                </button>
                <button className="open-box-button" onClick={handleOpenBox} disabled={isOpening}>
                  Open Box - 24 Packs (${PACK_COSTS[currentSet].box.toFixed(2)})
                </button>
                <button className="open-case-button" onClick={handleOpenCase} disabled={isOpening}>
                  Open Case - 96 Packs (${PACK_COSTS[currentSet].case.toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <CardDisplay cards={cards} />
        <CardTracker openedCards={openedCards} />
      </main>
      <footer className="app-footer">
        <div className="watermark">Prices updated 4/14/25</div>
        <div className="disclaimer">All images are property of Ravensburger and Disney</div>
      </footer>
    </div>
  );
};

export default App;
