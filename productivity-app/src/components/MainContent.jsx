import QACard from "./QACard";

export default function MainContent({
  subject,
  onAddCard,
  onEditCard,
  onDeleteCard,
  searchQuery,
  onSearchChange,
  searchResults,
  onResultSelect,
  onTogglePin,
  activeIndex
}) {
  return (
    <div className="main">
      <div className="main-header">
        <h2>
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : subject?.name || "No Subject"}
        </h2>

        {!searchQuery && subject && (
          <button onClick={onAddCard}>+ Add Card</button>
        )}
      </div>

      {/* 🔍 Search Bar */}
      <input
        className="search-input"
        placeholder="Search questions or answers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="cards">
        {/* SEARCH MODE */}
        {searchQuery &&
          (searchResults.length === 0 ? (
            <p className="empty-text">No matching cards found</p>
          ) : (
            searchResults
              .sort((a, b) => b.pinned - a.pinned)
              .map((card) => (
                <QACard
                  key={card.id}
                  card={card}
                  subjectName={card.subjectName}
                  isActive={card === activeIndex}
                  onEdit={() => onResultSelect(card)}
                  onDelete={onDeleteCard}
                  onTogglePin={onTogglePin}
                />
              ))
          ))}

        {/* NORMAL MODE */}
        {!searchQuery &&
          subject?.cards
            .sort((a, b) => b.pinned - a.pinned)
            .map((card) => (
              <QACard
                key={card.id}
                card={card}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
                onTogglePin={onTogglePin}
              />
            ))}
      </div>
    </div>
  );
}
