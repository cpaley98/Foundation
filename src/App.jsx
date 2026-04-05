import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MOCK_ITEMS } from './data/mockData';
import { loadItems, saveItems } from './utils/storage';
import { enrichItems } from './utils/risk';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Detail from './pages/Detail';
import AddEdit from './pages/AddEdit';
import { todayISO } from './utils/dates';

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  // Raw items from storage, enriched with computed riskLevel on every render
  // Filter out any legacy items with unknown categories (e.g. old 'bills' items)
  const VALID_CATEGORIES = ['coverage', 'expirations', 'professional', 'references'];
  const [rawItems, setRawItems] = useState(() => {
    const stored = loadItems(MOCK_ITEMS);
    return stored.filter((item) => VALID_CATEGORIES.includes(item.category));
  });
  const items = useMemo(() => enrichItems(rawItems), [rawItems]);

  // Persist on every change
  useEffect(() => {
    saveItems(rawItems);
  }, [rawItems]);

  // ─── Navigation stack ───────────────────────────────────────────────────────
  // Each frame: { view: 'home' | 'browse' | 'detail' | 'add-edit', ...params }
  const [navStack, setNavStack] = useState([{ view: 'home' }]);
  const current = navStack[navStack.length - 1];

  const navigate = useCallback((view, params = {}) => {
    setNavStack((prev) => [...prev, { view, ...params }]);
  }, []);

  const goBack = useCallback(() => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const goHome = useCallback(() => setNavStack([{ view: 'home' }]), []);
  const goBrowse = useCallback(
    (cat) => setNavStack([{ view: 'browse', initialCategory: cat ?? undefined }]),
    []
  );

  // ─── CRUD ───────────────────────────────────────────────────────────────────
  const addItem = useCallback(
    (payload) => {
      const newItem = { ...payload, id: `item-${Date.now()}` };
      setRawItems((prev) => [...prev, newItem]);
      goBack();
    },
    [goBack]
  );

  const updateItem = useCallback(
    (id, updates) => {
      setRawItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
      goBack();
    },
    [goBack]
  );

  const deleteItem = useCallback(
    (id) => {
      setRawItems((prev) => prev.filter((item) => item.id !== id));
      goHome();
    },
    [goHome]
  );

  const markVerified = useCallback((id) => {
    setRawItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, lastVerified: todayISO() } : item
      )
    );
  }, []);

  // ─── Swipe-to-go-back ───────────────────────────────────────────────────────
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const canSwipeBack = navStack.length > 1;

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    if (!canSwipeBack || touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Swipe right ≥ 60px, more horizontal than vertical, starting in left 40px
    if (dx >= 60 && dy < dx && touchStartX.current <= 40) {
      goBack();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  const view = current.view;
  const showBottomNav = view === 'home' || view === 'browse';

  return (
    <div
      style={{
        maxWidth: 430,
        width: '100%',
        height: '100dvh',
        boxSizing: 'border-box',
        margin: '0 auto',
        background: '#F3F2EF',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 20px 60px rgba(0,0,0,0.08)',
      }}
    >
      {/* Scrollable content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingBottom: showBottomNav ? 88 : 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {view === 'home' && (
          <Home
            items={items}
            onItemClick={(id) => navigate('detail', { itemId: id })}
            onCategoryClick={(cat) => goBrowse(cat)}
          />
        )}

        {view === 'browse' && (
          <Browse
            items={items}
            onItemClick={(id) => navigate('detail', { itemId: id })}
            onAddClick={() => navigate('add-edit', { itemId: null })}
            initialCategory={current.initialCategory}
          />
        )}

        {view === 'detail' && (
          <Detail
            item={items.find((i) => i.id === current.itemId)}
            onBack={goBack}
            onEdit={() => navigate('add-edit', { itemId: current.itemId })}
            onDelete={deleteItem}
            onMarkVerified={markVerified}
          />
        )}

        {view === 'add-edit' && (
          <AddEdit
            item={current.itemId ? items.find((i) => i.id === current.itemId) : null}
            onBack={goBack}
            onSave={
              current.itemId
                ? (updates) => updateItem(current.itemId, updates)
                : addItem
            }
          />
        )}
      </div>

      {/* Bottom navigation */}
      {showBottomNav && (
        <BottomNav
          active={view}
          onHome={goHome}
          onBrowse={() => goBrowse()}
          onAdd={() => navigate('add-edit', { itemId: null })}
        />
      )}
    </div>
  );
}
