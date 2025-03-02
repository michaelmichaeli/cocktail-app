import { useRef } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder }: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputRef.current?.value.trim();
      if (value && !tags.includes(value)) {
        onChange([...tags, value]);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
  };

  const handleAddTag = () => {
    const value = inputRef.current?.value.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span 
            key={tag} 
            className="badge badge-outline gap-2 py-3"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-error"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="input input-bordered flex-1"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn"
          onClick={handleAddTag}
        >
          Add Tag
        </button>
      </div>
    </div>
  );
}
