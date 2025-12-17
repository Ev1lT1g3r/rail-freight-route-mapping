import './Breadcrumb.css';

function Breadcrumb({ items, onNavigate }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate(item.path)}
                    className="breadcrumb-link"
                  >
                    {item.label}
                  </button>
                  <span className="breadcrumb-separator" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;

