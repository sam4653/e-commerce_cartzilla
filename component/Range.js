import React, { useState } from "react";
import InputRange from "react-input-range";
const Range = (props) => {
  // const [slide, setSlide] = useState({ min: 0, max: 10000 });
  const { value, onChange } = props;
  return (
    <>
      <div className="mt-5">
        <InputRange
          minValue={0}
          maxValue={10000}
          value={value}
          step={100}
          onChange={(v) => onChange(v)}
        // value={this.state.value}
        // onChange={(value) => this.setState({ value })}
        />
      </div>
    </>
  );
};

export default Range;
