interface TagFilterProps {
  tags: string[]
  selectedTag: string | null
  onSelectTag: (tag: string | null) => void
}

export default function TagFilter({ tags, selectedTag, onSelectTag }: TagFilterProps) {
  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onSelectTag(null)}
        className={`px-3 py-1 rounded-full text-sm ${
          selectedTag === null
            ? 'bg-gray-900 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedTag === tag
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
