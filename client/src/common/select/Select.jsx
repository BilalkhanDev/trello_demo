import { Select } from 'antd';
const { Option } = Select;

const CustomSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
  multiSelect = false
}) => {
 const handleChange = (val) => {
  console.log(`[${name}] Changed to:`, val);

  if (typeof onChange === 'function') {
    if (multiSelect) {
      onChange(val);
    } else {
      onChange({
        target: {
          name,
          value: val
        }
      });
    }
  }
};


  return (
    <div className="custom-select-wrapper">
      {label && <label>{label}</label>}
      <Select
        mode={multiSelect ? 'multiple' : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ width: '100%' }}
      >
        {options.map(opt => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CustomSelect;
