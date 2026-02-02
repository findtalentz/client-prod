interface Option {
  id: number;
  label: string;
  value: string;
}

interface Props {
  options: Option[];
}

export default function Select({ options }: Props) {
  return (
    <select className="py-2 px-4 rounded-4xl border border-primary outline-none focus:outline-none">
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
