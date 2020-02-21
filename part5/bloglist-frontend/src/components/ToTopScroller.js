import React, { useState, useImperativeHandle } from "react";

const ToTopScroller = React.forwardRef((props, ref) => {
  const [isHidden, setIsHidden] = useState(true);
  const toTopClass = isHidden ? "c-to-top isHidden" : "c-to-top";

  const scrollToTop = () => {
    document.documentElement.scrollTop = 0;
  };

  const show = () => {
    setIsHidden(false);
  };

  const hide = () => {
    setIsHidden(true);
  };

  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    };
  });

  return (
    <div className={toTopClass}>
      <button
        type="button"
        onClick={scrollToTop}
        className="c-btn c-btn--transparent"
      >
        Back To Top
      </button>
    </div>
  );
});

export default React.memo(ToTopScroller);
