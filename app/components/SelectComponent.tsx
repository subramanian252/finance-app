import CreatableSelect from "react-select/creatable";
import { SingleValue } from "react-select";
import { useMemo } from "react";

type Props = {
  disabled?: boolean;
  options?: { label: string; value: string }[];
  onChange: (value?: string) => void;
  onCreate?: (value: string) => void;
  placeholder?: string;
  value?: string | null | undefined;
};

export default function SelectComponent({
  value,
  options = [],
  onChange,
  disabled,
  onCreate,
  placeholder,
}: Props) {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  return (
    <CreatableSelect
      value={formattedValue}
      isDisabled={disabled}
      options={options}
      onCreateOption={onCreate}
      onChange={onSelect}
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
      }}
    />
  );
}
