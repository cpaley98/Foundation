import Icon from '../shared/Icon';

export default function BottomNav({ active, onHome, onBrowse, onAdd }) {
  const base = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flex: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 4px',
    minHeight: 56,
  };

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid #E8E6E1',
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 100,
      }}
    >
      {/* Home */}
      <button onClick={onHome} style={base} aria-label="Home">
        <Icon
          name="home"
          size={22}
          color={active === 'home' ? '#2F3437' : '#C4C1BB'}
          strokeWidth={active === 'home' ? 2.2 : 1.75}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: active === 'home' ? 700 : 500,
            color: active === 'home' ? '#2F3437' : '#C4C1BB',
            letterSpacing: 0.1,
          }}
        >
          Home
        </span>
      </button>

      {/* Browse */}
      <button onClick={onBrowse} style={base} aria-label="Browse">
        <Icon
          name="grid"
          size={22}
          color={active === 'browse' ? '#2F3437' : '#C4C1BB'}
          strokeWidth={active === 'browse' ? 2.2 : 1.75}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: active === 'browse' ? 700 : 500,
            color: active === 'browse' ? '#2F3437' : '#C4C1BB',
            letterSpacing: 0.1,
          }}
        >
          Browse
        </span>
      </button>

      {/* Add — center accent button */}
      <button
        onClick={onAdd}
        style={{
          ...base,
          flex: 'none',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#2F3437',
          boxShadow: '0 4px 14px rgba(47,52,55,0.3)',
          marginBottom: 12,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
        }}
        aria-label="Add item"
      >
        <Icon name="plus" size={22} color="#FFFFFF" strokeWidth={2.2} />
      </button>

      {/* Spacers to balance layout */}
      <div style={{ flex: 1 }} />
      <div style={{ flex: 1 }} />
    </nav>
  );
}
