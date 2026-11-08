export function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
        {label}
      </span>
      {children}
      {hint ? <span className="block text-xs text-ink/40">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props) {
  return <input className="field" {...props} />;
}

export function TextArea({ rows = 4, ...props }) {
  return <textarea className="field resize-y" rows={rows} {...props} />;
}

export function TagInput({ value, onChange, placeholder }) {
  const add = (raw) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  };

  return (
    <div className="field min-h-[48px] flex flex-wrap gap-1.5 items-center">
      {value.map((tag) => (
        <button
          key={tag}
          type="button"
          className="rounded-full bg-sage/10 px-2.5 py-0.5 text-xs text-sage"
          onClick={() => onChange(value.filter((item) => item !== tag))}
        >
          {tag} ×
        </button>
      ))}
      <input
        className="min-w-[140px] flex-1 bg-transparent py-1 text-sm outline-none"
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(e.currentTarget.value);
            e.currentTarget.value = "";
          }
          if (e.key === "Backspace" && !e.currentTarget.value && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
      />
    </div>
  );
}
